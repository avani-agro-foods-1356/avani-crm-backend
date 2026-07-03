import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedFile = path.join(__dirname, 'templates_seed.json');
  const rawData = fs.readFileSync(seedFile, 'utf-8');
  const templates = JSON.parse(rawData);

  // We need a workspace to attach the templates to. Let's find the first one.
  let workspace = await prisma.workspace.findFirst();
  
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'Avani Loan Services',
      },
    });
  }

  for (const template of templates) {
    await prisma.template.create({
      data: {
        name: template.name,
        category: template.category,
        content: template.content,
        status: template.status,
        volume: template.volume,
        product: template.product,
        workspaceId: workspace.id,
      },
    });
    console.log(`Created template: ${template.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
