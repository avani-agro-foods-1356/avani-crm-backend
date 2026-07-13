import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class BlandService {
  private readonly logger = new Logger(BlandService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService
  ) {}

  async dispatchCall(phone: string, name: string) {
    const BLAND_API_KEY = process.env.BLAND_API_KEY;
    if (!BLAND_API_KEY) {
      throw new HttpException('Bland API Key is missing', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const response = await axios.post(
        'https://api.bland.ai/v1/calls',
        {
          phone_number: phone,
          task: `You are the Avani Loan Services AI Agent. Your goal is to collect loan requirements from the user. You are speaking with ${name}. Ask them what type of loan they need if they haven't specified: Personal, Business, Doctor, CA, Home, or Education. Proceed to collect necessary details and at the end, inform them that a checklist of documents will be sent to their WhatsApp.`,
          voice: 'jennifer',
          first_sentence: `Hello ${name}, this is the AI assistant from Avani Loan Services. How can I help you with your loan requirements today?`,
          wait_for_greeting: false,
          max_duration: 15,
          webhook: 'https://avani-crm-backend.onrender.com/api/bland/webhook',
          metadata: { name: name, phone: phone }
        },
        {
          headers: {
            'authorization': BLAND_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Bland API Error:', error?.response?.data || error.message);
      throw new HttpException(
        error?.response?.data?.message || 'Failed to dispatch call to Bland AI',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async handleWebhook(body: any) {
    this.logger.log('Received Bland AI webhook: ' + JSON.stringify(body));

    // After the call completes, Bland sends a webhook with the call details
    // The "completed" status means the call ended successfully
    if (body.call_id) {
      const phone = body.to || body.variables?.phone || body.metadata?.phone;
      const name = body.variables?.name || body.metadata?.name || 'Customer';

      if (phone) {
        try {
          this.logger.log(`Sending loan_consultation_offer template to ${phone} after Bland AI call.`);
          
          // Add contact and log message first
          let contact = await this.prisma.contact.findUnique({ where: { phone } });
          if (!contact) {
            const ws = await this.prisma.workspace.findFirst();
            contact = await this.prisma.contact.create({
              data: {
                phone,
                name,
                source: 'BLAND_AI',
                workspace: { connect: { id: ws?.id } }
              }
            });
          }

          // Send Meta approved template 'clinic_setup__expansion'
          await this.whatsappService.sendMessage(
            phone,
            `Hello ${name}, this is our loan consultation offer...`, // Fallback text if template fails (e.g. dummy environment)
            'template',
            'clinic_setup__expansion',
            undefined, // No phoneNumberId
            [name]
          );

          // Save message to DB
          await this.prisma.message.create({
            data: {
              contactId: contact.id,
              direction: 'OUTBOUND',
              type: 'TEMPLATE',
              content: `[Template Sent: clinic_setup__expansion]\nSent after Bland AI call finished.`,
              status: 'SENT'
            }
          });
          
        } catch (error) {
          this.logger.error(`Failed to send WhatsApp follow-up to ${phone}`, error);
        }
      } else {
        this.logger.warn('Could not extract phone number from Bland Webhook payload to send WhatsApp follow-up.');
      }
    }
    return { success: true };
  }
}
