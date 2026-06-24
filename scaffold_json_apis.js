const fs = require('fs');

const resources = [
  { name: 'forms', cap: 'Forms' },
  { name: 'columns', cap: 'Columns' },
  { name: 'opts', cap: 'Opts' },
  { name: 'faq', cap: 'Faq' },
  { name: 'assistant', cap: 'Assistant' },
  { name: 'flows', cap: 'Flows' },
  { name: 'settings', cap: 'Settings' },
  { name: 'knowledge', cap: 'Knowledge' },
  { name: 'developers', cap: 'Developers' }
];

resources.forEach(res => {
  const serviceCode = `import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const resourceName: string = '${res.name}';

@Injectable()
export class ${res.cap}Service {
  private readonly filePath = path.join(process.cwd(), '${res.name}.json');

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
      console.error('Error reading ${res.name} data', e);
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
      console.error('Error writing ${res.name} data', e);
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
      console.error('Error deleting ${res.name} item', e);
      return { success: false, error: e.message };
    }
  }
}
`;

  const controllerCode = `import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ${res.cap}Service } from './${res.name}.service';

@Controller('${res.name}')
export class ${res.cap}Controller {
  constructor(private readonly ${res.name}Service: ${res.cap}Service) {}

  @Get()
  findAll() {
    return this.${res.name}Service.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.${res.name}Service.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${res.name}Service.remove(id);
  }
}
`;

  const moduleCode = `import { Module } from '@nestjs/common';
import { ${res.cap}Service } from './${res.name}.service';
import { ${res.cap}Controller } from './${res.name}.controller';

@Module({
  controllers: [${res.cap}Controller],
  providers: [${res.cap}Service],
})
export class ${res.cap}Module {}
`;

  fs.mkdirSync(`src/${res.name}`, { recursive: true });
  fs.writeFileSync(`src/${res.name}/${res.name}.service.ts`, serviceCode, 'utf8');
  fs.writeFileSync(`src/${res.name}/${res.name}.controller.ts`, controllerCode, 'utf8');
  fs.writeFileSync(`src/${res.name}/${res.name}.module.ts`, moduleCode, 'utf8');
});

console.log('JSON APIs successfully scaffolded.');
