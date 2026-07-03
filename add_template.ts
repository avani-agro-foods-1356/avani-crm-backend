import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addTemplate() {
  const ws = await prisma.workspace.findFirst();
  if (!ws) {
    console.log("No workspace found");
    return;
  }

  // Check if it already exists
  const existing = await prisma.template.findFirst({
    where: { name: "personal_loan_inquiry" }
  });

  if (existing) {
    await prisma.template.update({
      where: { id: existing.id },
      data: {
        category: "MARKETING",
        content: "Hello {{1}}, looking for a personal loan? Avani Loan Services offers quick approvals up to ₹5,00,000 with minimal documentation. Reply YES or call us at +91 9175635165 to check your eligibility today! - Avani Loan Services (RBI Registered DSA)"
      }
    });
    console.log("Template Updated!");
  } else {
    await prisma.template.create({
      data: {
        name: "personal_loan_inquiry",
        category: "MARKETING",
        content: "Hello {{1}}, looking for a personal loan? Avani Loan Services offers quick approvals up to ₹5,00,000 with minimal documentation. Reply YES or call us at +91 9175635165 to check your eligibility today! - Avani Loan Services (RBI Registered DSA)",
        status: "APPROVED",
        workspaceId: ws.id
      }
    });
    console.log("Template Created!");
  }
}

addTemplate().catch(e => console.error(e)).finally(() => prisma.$disconnect());
