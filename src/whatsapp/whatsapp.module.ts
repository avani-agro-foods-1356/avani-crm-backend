import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { FaqModule } from '../faq/faq.module';

@Module({
  imports: [WebhooksModule, FaqModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService]
})
export class WhatsappModule {}
