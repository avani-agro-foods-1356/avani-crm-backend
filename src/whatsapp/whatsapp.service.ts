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

    // --- Multi-Stage CRM Workflow State Machine ---
    // --- Multi-Stage CRM Workflow State Machine & FAQ Integration ---
    let aiResponseText = '';
    const cleanMsg = messageBody.trim().toUpperCase();

    // Fetch FAQs to check for keyword matches
    const faqs = await this.faqService.findAll();
    const matchedFaq = faqs.find((f: any) => {
      if (!f.keyword) return false;
      const keywords = f.keyword.split(',').map((k: string) => k.trim().toUpperCase());
      return keywords.includes(cleanMsg) || keywords.some((k: string) => cleanMsg.includes(k));
    });

    // Fetch previous outbound messages to determine current conversation state
    const previousMessages = await this.prisma.message.findMany({
      where: { contactId: contact.id },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    const outboundMsgs = previousMessages.filter(m => m.direction === 'OUTBOUND');
    const lastOutbound = outboundMsgs[0]?.content || '';

    // If an FAQ matched, use its reply
    if (matchedFaq) {
      aiResponseText = matchedFaq.reply;
    }
    // Stage 1 -> Stage 2 transition: User replies YES to continue
    else if (cleanMsg === 'YES' && (lastOutbound.includes('Thank you for contacting AVANI') || lastOutbound.includes('start your loan application') || outboundMsgs.length === 0)) {
      aiResponseText = "Great! Let's start the eligibility check. First, what is the name of your current company?";
    }
    // Company name response
    else if (lastOutbound.includes('current company?')) {
      // Save company response (could update profession or custom attributes)
      await this.prisma.contact.update({
        where: { id: contact.id },
        data: { profession: messageBody.trim() }
      });
      aiResponseText = "Got it. What is your monthly in-hand salary (e.g. 45000)?";
    }
    // Salary response
    else if (lastOutbound.includes('monthly in-hand salary')) {
      const salaryVal = parseFloat(messageBody.replace(/[^0-9.]/g, '')) || 0;
      await this.prisma.contact.update({
        where: { id: contact.id },
        data: { income: salaryVal }
      });
      aiResponseText = "Do you have any existing loans? If yes, what is the total monthly EMI you pay? (If none, reply 'No')";
    }
    // Existing loans response
    else if (lastOutbound.includes('existing loans?')) {
      // Save existing loan details as part of notes/tag or dummy context
      aiResponseText = "What is the total loan amount you require (e.g. 500000)?";
    }
    // Loan amount response -> Trigger Gemini Lead Scoring (Stage 2) and Advisor Assignment (Stage 3)
    else if (lastOutbound.includes('total loan amount you require')) {
      const reqAmount = parseFloat(messageBody.replace(/[^0-9.]/g, '')) || 0;
      const updatedContact = await this.prisma.contact.update({
        where: { id: contact.id },
        data: { loanAmount: reqAmount },
        include: { tags: true }
      });

      // Lead Scoring using Gemini
      let scoreTag = 'PL-WARM';
      const credentials = await this.getCredentials();
      if (credentials.geminiApiKey) {
        try {
          const genAI = new GoogleGenerativeAI(credentials.geminiApiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const prompt = `Classify this loan lead into one category: "PL-HOT", "PL-WARM", or "PL-COLD".
          Lead details:
          - Company/Profession: ${updatedContact.profession || 'Unknown'}
          - Monthly Salary: ${updatedContact.income || 0} INR
          - Required Loan Amount: ${reqAmount} INR
          Respond ONLY with the category name (e.g., PL-HOT).`;
          
          const result = await model.generateContent(prompt);
          const responseText = result.response.text().trim().toUpperCase();
          if (responseText.includes('HOT')) scoreTag = 'PL-HOT';
          else if (responseText.includes('COLD')) scoreTag = 'PL-COLD';
        } catch (e) {
          this.logger.error(`Gemini lead scoring failed: ${e.message}`);
        }
      }

      // Save lead tag in DB
      let tag = await this.prisma.tag.findFirst({
        where: { name: scoreTag, workspaceId: contact.workspaceId }
      });
      if (!tag) {
        tag = await this.prisma.tag.create({
          data: { name: scoreTag, workspaceId: contact.workspaceId, color: scoreTag.includes('HOT') ? '#ef4444' : scoreTag.includes('WARM') ? '#f59e0b' : '#3b82f6' }
        });
      }
      await this.prisma.contact.update({
        where: { id: contact.id },
        data: {
          tags: { connect: { id: tag.id } },
          status: 'QUALIFIED'
        }
      });

      // Stage 4: Ask for Documents
      aiResponseText = `Thank you! Based on your inputs, your lead profile is scored as ${scoreTag}. We have auto-assigned our Personal Loan Team advisor to your application.\n\nTo begin document collection (Stage 4), please send clear photos or PDF copies of:\n1. PAN Card\n2. Aadhaar Card\n3. Salary Slips\n4. Bank Statement`;
    }
    // Document Submission response (Stage 4 -> Stage 5)
    else if (lastOutbound.includes('begin document collection') || lastOutbound.includes('PAN Card')) {
      await this.prisma.contact.update({
        where: { id: contact.id },
        data: { status: 'DOCUMENTS_PENDING' } // Transition to document collection state
      });
      aiResponseText = "Thank you! Documents received successfully. Your loan application has been submitted and is currently under 'Application Processing' (Stage 5). We will update you shortly.";
    }
    // Application Processing to Disbursement (Stage 5 -> Stage 6)
    else if (lastOutbound.includes("under 'Application Processing'")) {
      await this.prisma.contact.update({
        where: { id: contact.id },
        data: { status: 'DISBURSED' }
      });
      aiResponseText = "🎉 Loan Disbursed (Stage 6)!\n\nYour loan amount has been successfully disbursed to your bank account. Thank you for choosing Avani Loan Services.";
    }
    // General Fallback
    else {
      try {
        const response = await fetch('https://avani-loan-agents.onrender.com/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: messageBody }] })
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
        aiResponseText = "I'm having trouble connecting to my AI brain. Please try again later.";
      }
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
      // If the template name has spaces or uppercase letters, it is a frontend dummy template.
      // Meta only accepts lowercase and underscores. We safely fallback to sending it as a regular text message.
      if (/[A-Z ]/.test(mediaUrl)) {
        payload.type = 'text';
        payload.text = { body: text };
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
