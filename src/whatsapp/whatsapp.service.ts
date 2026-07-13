import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { FaqService } from '../faq/faq.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private prisma: PrismaService,
    private faqService: FaqService
  ) {}

  private async getCredentials() {
    try {
      const workspace = await this.prisma.workspace.findFirst();
      if (workspace) {
        return {
          whatsappToken: workspace.whatsappToken || process.env.WHATSAPP_TOKEN,
          whatsappPhoneNumberId: workspace.whatsappPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID,
          geminiApiKey: workspace.geminiApiKey || process.env.GEMINI_API_KEY,
        };
      }
    } catch (e) {
      this.logger.error('Failed to read settings from database, falling back to env', e);
    }
    return {
      whatsappToken: process.env.WHATSAPP_TOKEN,
      whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      geminiApiKey: process.env.GEMINI_API_KEY,
    };
  }

  async processIncomingMessage(from: string, messageBody: string, phoneNumberId: string) {
    this.logger.log(`Received message from ${from}: ${messageBody}`);
    
    // Check if contact exists
    let contact = await this.prisma.contact.findUnique({
      where: { phone: from },
    });

    if (!contact) {
      let workspace = await this.prisma.workspace.findFirst();
      if (!workspace) {
        workspace = await this.prisma.workspace.create({
          data: { name: 'Avani Loan Services Default' },
        });
      }

      contact = await this.prisma.contact.create({
        data: {
          phone: from,
          workspaceId: workspace.id,
        },
      });
      this.logger.log(`Created new contact for ${from}`);
    }

    // Save INBOUND message
    await this.prisma.message.create({
      data: {
        contactId: contact.id,
        direction: 'INBOUND',
        type: 'TEXT',
        content: messageBody,
        status: 'DELIVERED',
      },
    });

    // --- AI Agent Integration ---
    let aiResponseText = '';

    try {
      // Fetch conversation history
      const previousMessages = await this.prisma.message.findMany({
        where: { contactId: contact.id },
        orderBy: { timestamp: 'asc' }, // Must be ascending for chronological order
        take: 20, // Send last 20 messages for context
      });

      const aiMessages = previousMessages.map(m => ({
        role: m.direction === 'INBOUND' ? 'user' : 'assistant',
        content: m.content
      }));

      const response = await fetch('https://avani-loan-agents.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: aiMessages })
      });
      
      const text = await response.text();
      let fullText = '';
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('0:')) {
          try {
            fullText += JSON.parse(line.substring(2));
          } catch(e) {}
        }
      }
      aiResponseText = fullText || "I'm having trouble connecting to my AI brain. Please try again later.";
    } catch (err) {
      this.logger.error(`AI Agent Error: ${err.message}`);
      aiResponseText = "I'm having trouble connecting to my AI brain. Please try again later.";
    }

    // Save OUTBOUND message
    await this.prisma.message.create({
      data: {
        contactId: contact.id,
        direction: 'OUTBOUND',
        type: 'TEXT',
        content: aiResponseText,
        status: 'SENT',
      },
    });

    // Send the reply
    await this.sendMessage(from, aiResponseText, phoneNumberId);
  }

  async sendMessage(
    to: string,
    text: string,
    mediaType?: 'text' | 'image' | 'video' | 'document' | 'template' | string,
    mediaUrl?: string,
    phoneNumberId?: string,
    templateParams?: string[]
  ) {
    const credentials = await this.getCredentials();
    const activePhoneNumberId = phoneNumberId || credentials.whatsappPhoneNumberId;
    const token = credentials.whatsappToken;

    if (!activePhoneNumberId) {
      this.logger.error('WhatsApp Phone Number ID is missing');
      return;
    }

    let payload: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
    };

    const type = mediaType || 'text';

    if (type === 'image' && mediaUrl) {
      payload.type = 'image';
      payload.image = { link: mediaUrl, caption: text || '' };
    } else if (type === 'video' && mediaUrl) {
      payload.type = 'video';
      payload.video = { link: mediaUrl, caption: text || '' };
    } else if (type === 'document' && mediaUrl) {
      payload.type = 'document';
      payload.document = { 
        link: mediaUrl, 
        caption: text || '',
        filename: mediaUrl.substring(mediaUrl.lastIndexOf('/') + 1) || 'document.pdf'
      };
    } else if (type === 'template' && mediaUrl) {
      // Meta only accepts lowercase and underscores for template names.
      if (/[A-Z ]/.test(mediaUrl)) {
        throw new Error(`Invalid Meta Template Name: "${mediaUrl}". Template names must be lowercase and use underscores (e.g., "business_loan_inquiry"). Please refresh your browser to load the latest templates from the database.`);
      } else {
        payload.type = 'template';
        payload.template = {
          name: mediaUrl,
          language: { code: 'en_US' } // default to en_US for Meta templates
        };
      }
      
      if (payload.template && templateParams && templateParams.length > 0) {
        payload.template.components = [
          {
            type: "body",
            parameters: templateParams.map(param => ({
              type: "text",
              text: String(param)
            }))
          }
        ];
      }
    } else {
      payload.type = 'text';
      payload.text = { body: text };
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${activePhoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        const errCode = data?.error?.code;
        const errMsg = data?.error?.message || '';
        const errType = data?.error?.type || '';
        const errSubcode = data?.error?.error_subcode;

        // Detect expired/invalid token specifically
        if (errCode === 190 || errType === 'OAuthException') {
          this.logger.error(`[META TOKEN EXPIRED] ❌ Your WhatsApp Access Token has EXPIRED or is INVALID!`);
          this.logger.error(`[META TOKEN EXPIRED] Go to https://business.facebook.com/settings/system-users and generate a NEVER-EXPIRING System User Token.`);
          this.logger.error(`[META TOKEN EXPIRED] Then update the token in the CRM Settings page: https://frontend-liart-gamma-68.vercel.app/settings`);
          throw new Error('Authentication Error: WhatsApp token expired. Please generate a new permanent token from Meta Business Manager.');
        }

        this.logger.error(`[META API ERROR] code=${errCode} subcode=${errSubcode} type=${errType} message=${errMsg}`);
        this.logger.error(`[META API ERROR] Full response: ${JSON.stringify(data)}`);
        
        const isPlaceholder = 
          !token || 
          token.includes('YOUR_') || 
          activePhoneNumberId.includes('YOUR_') ||
          activePhoneNumberId === '2563121230792397';

        if (isPlaceholder) {
          this.logger.warn(`[META API FALLBACK] Placeholder credentials detected. Mocking success for demo. Message: "${text.substring(0, 30)}..."`);
          return { message_id: `mock_msg_${Date.now()}`, success: true, mocked: true };
        }

        throw new Error(errMsg || 'Failed to send WhatsApp message via Meta API');
      } else {
        this.logger.log(`Message (${type}) successfully sent to ${to}`);
        return data;
      }
    } catch (error) {
      const isPlaceholder = 
        !token || 
        token.includes('YOUR_') || 
        activePhoneNumberId.includes('YOUR_') ||
        activePhoneNumberId === '2563121230792397';

      if (isPlaceholder && error.message.includes('fetch failed')) {
        this.logger.warn(`[META API FALLBACK] Catch block: Mocking success for demo. Error: ${error.message}`);
        return { message_id: `mock_msg_${Date.now()}`, success: true, mocked: true };
      }

      this.logger.error(`Error sending message to ${to}: ${error.message}`);
      throw error;
    }
  }
}
