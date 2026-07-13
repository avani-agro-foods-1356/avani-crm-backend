import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    console.log("No workspace found.");
    return;
  }

  const template = {
    name: 'loan_consultation_offer',
    category: 'MARKETING',
    content: "Hello {{1}}, we're reaching out from AVANI LOAN SERVICES to discuss your loan options. Please reply if you'd like to continue the consultation over WhatsApp.",
    status: 'APPROVED',
  };

  const existing = await prisma.template.findFirst({
    where: { name: template.name }
  });

  if (!existing) {
    await prisma.template.create({
      data: {
        name: template.name,
        category: template.category,
        content: template.content,
        status: template.status,
        workspaceId: workspace.id,
      }
    });
    console.log(`Created template: ${template.name}`);
  } else {
    console.log(`Template already exists: ${template.name}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
