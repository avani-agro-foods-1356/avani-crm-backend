import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});
    }
    const createData: any = { ...data };
    createData.workspace = { connect: { id: workspace.id } };
    return this.prisma.template.create({ data: createData });
  }

  findAll() {
    return this.prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
  }

  remove(id: string) {
    return this.prisma.template.delete({ where: { id } });
  }

  async syncFromMeta() {
    const WABA_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || process.env.WABA_ID;
    const TOKEN = process.env.META_API_TOKEN || process.env.WHATSAPP_TOKEN;
    if (!WABA_ID || !TOKEN) throw new Error("Missing Meta API Credentials in .env");

    const response = await fetch(`https://graph.facebook.com/v19.0/${WABA_ID}/message_templates?limit=100`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Meta API Error: ${errText}`);
    }

    const data = await response.json();
    const templates = data.data || [];

    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) workspace = await this.prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});

    let added = 0;
    for (const tpl of templates) {
      const existing = await this.prisma.template.findFirst({ where: { name: tpl.name } });
      if (!existing) {
        const bodyComponent = tpl.components.find((c: any) => c.type === 'BODY');
        let content = bodyComponent ? bodyComponent.text : '';
        await this.prisma.template.create({
          data: {
            name: tpl.name,
            category: tpl.category || 'MARKETING',
            content: content,
            status: tpl.status,
            workspaceId: workspace.id
          }
        });
        added++;
      } else if (existing.status !== tpl.status) {
        // Sync status if changed (e.g. pending -> approved)
        await this.prisma.template.update({
          where: { id: existing.id },
          data: { status: tpl.status }
        });
      }
    }
    return { success: true, message: `Synced ${added} new templates.`, addedCount: added };
  }
}
