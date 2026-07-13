import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    console.log("No workspace found.");
    return;
  }

  const template = {
    name: 'clinic_setup__expansion',
    category: 'MARKETING',
    content: "Dr. {{1}}, upgrade your practice with Avani Loan Services. We offer specialized Doctor Loans for clinic expansion and equipment financing at exclusive interest rates. Let's discuss your growth plan today.",
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
