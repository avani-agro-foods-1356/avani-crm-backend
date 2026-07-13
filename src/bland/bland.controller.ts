import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { BlandService } from './bland.service';

@Controller('bland')
export class BlandController {
  constructor(private readonly blandService: BlandService) {}

  @Post('call')
  async dispatchCall(@Body() body: { phone: string; name: string }) {
    return this.blandService.dispatchCall(body.phone, body.name);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    return this.blandService.handleWebhook(body);
  }
}
