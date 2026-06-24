import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      let workspace = await this.prisma.workspace.findFirst();
      if (!workspace) {
        workspace = await this.prisma.workspace.create({
          data: {
            name: 'Avani Loan Services',
            timezone: 'IST',
            currency: 'INR',
            autoReply: true,
            whatsappToken: process.env.WHATSAPP_TOKEN || '',
            whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
            geminiApiKey: process.env.GEMINI_API_KEY || ''
          }
        });
      }
      return [workspace];
    } catch (e) {
      this.logger.error('Error fetching settings from database', e);
      return [];
    }
  }

  async create(item: any) {
    try {
      let workspace = await this.prisma.workspace.findFirst();
      if (!workspace) {
        return await this.prisma.workspace.create({
          data: { ...item }
        });
      }
      
      const updated = await this.prisma.workspace.update({
        where: { id: workspace.id },
        data: {
          name: item.name,
          timezone: item.timezone,
          currency: item.currency,
          autoReply: item.autoReply,
          whatsappToken: item.whatsappToken,
          whatsappPhoneNumberId: item.whatsappPhoneNumberId,
          geminiApiKey: item.geminiApiKey
        }
      });
      return updated;
    } catch (e) {
      this.logger.error('Error updating settings in database', e);
      throw e;
    }
  }

  async remove(id: string) {
    // We do not allow removing the main workspace settings via this endpoint
    return { success: false, message: 'Cannot delete global settings' };
  }
}
