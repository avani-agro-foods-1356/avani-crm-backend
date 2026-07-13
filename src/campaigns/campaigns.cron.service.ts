import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { BlandService } from '../bland/bland.service';

@Injectable()
export class CampaignsCronService {
  private readonly logger = new Logger(CampaignsCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService,
    private readonly blandService: BlandService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledCampaigns() {
    this.logger.log('Checking for scheduled campaigns...');
    
    // Find all SCHEDULED campaigns whose scheduled time is now or in the past
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: new Date(),
        },
      },
    });

    for (const campaign of campaigns) {
      this.logger.log(`Starting scheduled campaign: ${campaign.id} (${campaign.name})`);
      
      try {
        // Mark as RUNNING
        await this.prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'RUNNING' },
        });

        const payload: any = campaign.payload;
        if (!payload || !payload.csvRows) {
          throw new Error('No payload or contacts found for this campaign.');
        }

        const { csvRows, recipientColumn, variableMappings, mediaType, mediaUrl, templateContent, firstMessage } = payload;
        
        let successCount = 0;
        let failedCount = 0;

        for (const row of csvRows) {
          let phone = row[recipientColumn] || "";
          phone = phone.replace(/[^0-9]/g, ""); // strip non-numeric
          if (phone.length === 10) phone = "91" + phone;
          if (!phone.startsWith("+") && phone.length > 0) phone = "+" + phone;
          
          if (!phone) {
            failedCount++;
            continue;
          }

          if (campaign.type === 'WHATSAPP') {
            // Helper to format message
            let compiledMessage = templateContent || '';
            Object.entries(variableMappings).forEach(([placeholder, colHeader]: any) => {
              const val = row[colHeader] || `[${colHeader || "value"}]`;
              compiledMessage = compiledMessage.replaceAll(placeholder, val);
            });

            const paramKeys = Object.keys(variableMappings).sort((a, b) => {
              return (parseInt(a.replace(/\D/g, '')) || 0) - (parseInt(b.replace(/\D/g, '')) || 0);
            });
            const templateParams = paramKeys.map(key => String(row[variableMappings[key]] || ""));

            try {
              await this.whatsappService.sendMessage(
                phone, 
                compiledMessage, 
                mediaType, 
                mediaUrl, 
                undefined, 
                mediaType === "template" ? templateParams : undefined
              );
              successCount++;
            } catch (err) {
              this.logger.error(`Failed to send WA message to ${phone}: ${err.message}`);
              failedCount++;
            }
          } else if (campaign.type === 'VOICE') {
             try {
                // Determine name if possible, or fallback to generic
                const nameCol = payload.nameColumn || payload.recipientColumn;
                const name = row[nameCol] || "Customer";
                await this.blandService.dispatchCall(phone, name);
                successCount++;
             } catch (err) {
                this.logger.error(`Failed to make voice call to ${phone}: ${err.message}`);
                failedCount++;
             }
          }

          // Throttle
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Mark as COMPLETED
        await this.prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'COMPLETED' },
        });

        this.logger.log(`Campaign ${campaign.name} finished. Success: ${successCount}, Failed: ${failedCount}`);

      } catch (err) {
        this.logger.error(`Error processing campaign ${campaign.id}: ${err.message}`);
        await this.prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'FAILED' },
        });
      }
    }
  }
}
