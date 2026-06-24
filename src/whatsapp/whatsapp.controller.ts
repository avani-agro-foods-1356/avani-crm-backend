import { Controller, Get, Post, Query, Body, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import type { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly webhooksService: WebhooksService,
  ) {}

  // Webhook verification for Meta
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN = 'avani_secure_webhook_token_2026'; // Should ideally be in env

    // Log verification attempt
    this.webhooksService.logEvent({ type: 'verification_attempt', query: { mode, token, challenge } });

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.type('text/plain').status(HttpStatus.OK).send(challenge);
      } else {
        res.sendStatus(HttpStatus.FORBIDDEN);
      }
    } else {
      res.sendStatus(HttpStatus.BAD_REQUEST);
    }
  }

  // Receive messages from Meta
  @Post('webhook')
  async handleIncomingMessage(@Body() body: any, @Res() res: Response) {
    // Log raw body payload
    this.webhooksService.logEvent({ type: 'incoming_webhook', body });

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text

        await this.whatsappService.processIncomingMessage(from, msgBody, phoneNumberId);
      }
      res.sendStatus(HttpStatus.OK);
    } else {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
