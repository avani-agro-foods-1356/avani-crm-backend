import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const resourceName: string = 'flows';

@Injectable()
export class FlowsService {
  private readonly filePath = path.join(process.cwd(), 'flows.json');

  constructor() {
    if (!fs.existsSync(this.filePath)) {
      const initialData = this.getInitialData();
      fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2), 'utf8');
    }
  }

  private getInitialData() {
    if (resourceName === 'settings') {
      return [{ id: 'default', name: 'Avani Loan Services', timezone: 'IST', currency: 'INR', autoReply: true }];
    }
    if (resourceName === 'assistant') {
      return [{ id: 'default', name: 'Avani Agent', model: 'gemini-1.5-flash', systemPrompt: 'You are a loan qualification assistant for Avani Loan Services.', temperature: 0.7 }];
    }
    return [];
  }

  findAll() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading flows data', e);
      return [];
    }
  }

  create(item: any) {
    try {
      const items = this.findAll();
      const newItem = {
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        ...item
      };
      if (resourceName === 'settings' || resourceName === 'assistant') {
        // Single config update
        const index = items.findIndex((i: any) => i.id === 'default');
        if (index !== -1) {
          items[index] = { ...items[index], ...item };
          fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf8');
          return items[index];
        }
      }
      items.unshift(newItem);
      fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf8');
      return newItem;
    } catch (e) {
      console.error('Error writing flows data', e);
      throw e;
    }
  }

  remove(id: string) {
    try {
      const items = this.findAll();
      const filtered = items.filter((item: any) => item.id !== id);
      fs.writeFileSync(this.filePath, JSON.stringify(filtered, null, 2), 'utf8');
      return { success: true };
    } catch (e) {
      console.error('Error deleting flows item', e);
      return { success: false, error: e.message };
    }
  }
}
