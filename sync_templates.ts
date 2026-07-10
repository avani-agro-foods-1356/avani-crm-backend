import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function syncTemplates() {
  try {
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});
    }

    const WABA_ID = workspace.whatsappBusinessAccountId || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || process.env.WABA_ID;
    const TOKEN = workspace.whatsappToken || process.env.META_API_TOKEN || process.env.WHATSAPP_TOKEN;

    if (!WABA_ID || !TOKEN) {
      console.error("Missing WABA_ID or META_API_TOKEN");
      process.exit(1);
    }

    console.log(`Fetching templates for WABA_ID: ${WABA_ID}`);
    const response = await fetch(`https://graph.facebook.com/v19.0/${WABA_ID}/message_templates?limit=100`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const data = await response.json();
    const templates = data.data;
    console.log(`Found ${templates.length} templates in Meta.`);



    let added = 0;
    for (const tpl of templates) {
      const existing = await prisma.template.findFirst({
        where: { name: tpl.name }
      });

      if (!existing) {
        // Extract content from BODY component
        const bodyComponent = tpl.components.find((c: any) => c.type === 'BODY');
        let content = bodyComponent ? bodyComponent.text : '';

        await prisma.template.create({
          data: {
            name: tpl.name,
            category: tpl.category,
            content: content,
            status: tpl.status,
            workspaceId: workspace.id
          }
        });
        console.log(`Added template: ${tpl.name}`);
        added++;
      }
    }
    
    console.log(`Successfully synced ${added} new templates!`);
  } catch (error: any) {
    console.error("Error syncing templates:", error.response?.data || error.message);
  } finally {
    await prisma.$disconnect();
  }
}

syncTemplates();
