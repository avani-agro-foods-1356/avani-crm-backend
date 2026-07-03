import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});
  }

  const content = `Hello Dr. Mahesh, planning to upgrade your clinic or buy new medical equipment? AVANI LOAN SERVICES offers specialized Doctor Loans with high limits and low interest rates designed just for medical professionals.

Reply STOP to unsubscribe`;

  const existing = await prisma.template.findFirst({ where: { name: 'clinic_setup__expansion' } });
  if (existing) {
    await prisma.template.update({
      where: { id: existing.id },
      data: { content, status: 'APPROVED', category: 'MARKETING' }
    });
  } else {
    await prisma.template.create({
      data: {
        name: 'clinic_setup__expansion',
        category: 'MARKETING',
        content,
        status: 'APPROVED',
        workspaceId: workspace.id
      }
    });
  }

  console.log("Template 'clinic_setup__expansion' added successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
