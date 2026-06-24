import { Module } from '@nestjs/common';
import { OptsService } from './opts.service';
import { OptsController } from './opts.controller';

@Module({
  controllers: [OptsController],
  providers: [OptsService],
})
export class OptsModule {}
