import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WebhooksService {
  private readonly filePath = path.join(process.cwd(), 'webhooks.json');

  constructor() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
    }
  }

  logEvent(payload: any) {
    try {
      const fileData = fs.readFileSync(this.filePath, 'utf8');
      const events = JSON.parse(fileData);
      const newEvent = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        payload,
      };
      events.unshift(newEvent);
      // Keep only last 100 events to prevent massive file size
      if (events.length > 100) {
        events.pop();
      }
      fs.writeFileSync(this.filePath, JSON.stringify(events, null, 2), 'utf8');
      return newEvent;
    } catch (e) {
      console.error('Failed to log webhook event', e);
    }
  }

  findAll() {
    try {
      const fileData = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(fileData);
    } catch (e) {
      console.error('Failed to read webhook events', e);
      return [];
    }
  }

  clearAll() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
      return { success: true };
    } catch (e) {
      console.error('Failed to clear webhook events', e);
      return { success: false };
    }
  }
}
