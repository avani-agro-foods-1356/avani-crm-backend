import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { CampaignsCronService } from './campaigns.cron.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { BlandModule } from '../bland/bland.module';

@Module({
  imports: [PrismaModule, WhatsappModule, BlandModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignsCronService]
})
export class CampaignsModule {}
