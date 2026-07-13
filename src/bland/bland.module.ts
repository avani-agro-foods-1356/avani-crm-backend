import { Module } from '@nestjs/common';
import { BlandController } from './bland.controller';
import { BlandService } from './bland.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [PrismaModule, WhatsappModule],
  controllers: [BlandController],
  providers: [BlandService],
  exports: [BlandService]
})
export class BlandModule {}
