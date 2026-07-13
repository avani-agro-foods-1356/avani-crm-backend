import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    console.log("No workspace found.");
    return;
  }

  const templates = [
    {
      name: "loan_consultation_offer_day3",
      category: "MARKETING",
      content: "Hello {{1}}, we noticed you haven't proceeded with your loan application. If you need any assistance or have questions, our advisors are here to help. Please reply YES if you'd like a call.",
      status: "APPROVED",
      workspaceId: workspace.id
    },
    {
      name: "loan_consultation_offer_day5",
      category: "MARKETING",
      content: "Hello {{1}}, this is our final reminder regarding your loan inquiry. We have exclusive interest rates available right now. If you're no longer interested, please share this offer with friends or family who might need a loan. Thank you!",
      status: "APPROVED",
      workspaceId: workspace.id
    }
  ];

  for (const t of templates) {
    const exists = await prisma.template.findFirst({ where: { name: t.name }});
    if (!exists) {
      await prisma.template.create({ data: t });
      console.log(`Created template: ${t.name}`);
    } else {
      console.log(`Template already exists: ${t.name}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
