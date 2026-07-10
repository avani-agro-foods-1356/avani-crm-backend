import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});
  }

  const content = `Hi Sachin, looking for funds for a medical emergency, wedding, or travel? AVANI LOAN SERVICES offers instant Personal Loans starting at just 10.5% p.a. Minimal documentation and fast 24-hour disbursal!

Reply STOP to unsubscribe`;

  const existing = await prisma.template.findFirst({ where: { name: 'instant_approval_focus' } });
  if (existing) {
    await prisma.template.update({
      where: { id: existing.id },
      data: { content, status: 'APPROVED', category: 'MARKETING' }
    });
  } else {
    await prisma.template.create({
      data: {
        name: 'instant_approval_focus',
        category: 'MARKETING',
        content,
        status: 'APPROVED',
        workspaceId: workspace.id
      }
    });
  }

  console.log("Template 'instant_approval_focus' added successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
