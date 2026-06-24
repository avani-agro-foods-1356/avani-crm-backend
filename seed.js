const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CRM data for Avani Loan Services products...');

  // 1. Create Default Workspace
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: 'Avani Loan Services Default' }
    });
  }
  const wsId = workspace.id;

  // 2. Seed Projects
  const products = [
    { name: 'Personal / Salary', description: 'Personal loan offerings for salaried professionals' },
    { name: 'Business loan', description: 'Working capital and term loans for business owners' },
    { name: 'Chartered Accountant Doctor / Professional', description: 'Specialized low-ROI loans for professionals' },
    { name: 'Home / Mortgage', description: 'Home purchasing loans and Loans Against Property (LAP)' },
    { name: 'Education (India)', description: 'Higher studies funding for Indian institutions' },
    { name: 'Education (Global)', description: 'Abroad education and immigration study loans' },
    { name: 'School funding', description: 'Infrastructure development and equipment loans for schools' },
    { name: 'college funding', description: 'Institutional expansion and campus construction funding' }
  ];

  for (const prod of products) {
    const existing = await prisma.project.findFirst({
      where: { name: prod.name, workspaceId: wsId }
    });
    if (!existing) {
      await prisma.project.create({
        data: { name: prod.name, description: prod.description, workspaceId: wsId }
      });
      console.log(`Created Project: ${prod.name}`);
    }
  }

  // 3. Seed Tags
  const tags = [
    { name: 'Personal', color: '#3b82f6' },
    { name: 'Business', color: '#10b981' },
    { name: 'Professional', color: '#8b5cf6' },
    { name: 'Mortgage', color: '#f59e0b' },
    { name: 'Edu India', color: '#ec4899' },
    { name: 'Edu Global', color: '#06b6d4' },
    { name: 'School', color: '#14b8a6' },
    { name: 'College', color: '#f43f5e' }
  ];

  for (const tag of tags) {
    const existing = await prisma.tag.findFirst({
      where: { name: tag.name, workspaceId: wsId }
    });
    if (!existing) {
      await prisma.tag.create({
        data: { name: tag.name, color: tag.color, workspaceId: wsId }
      });
      console.log(`Created Tag: ${tag.name}`);
    }
  }

  // 4. Seed WhatsApp Templates
  const templates = [
    {
      name: 'personal_salary_lead_followup',
      category: 'MARKETING',
      content: 'Hello {{1}}, we noticed you are interested in a Personal Loan. Get up to Rs. 15 Lakhs at special rates with instant approval. Reply YES to proceed.'
    },
    {
      name: 'business_loan_requirement_form',
      category: 'UTILITY',
      content: 'Hello {{1}}, to process your Business Loan application, please upload your 1 year GST returns and bank statements here. Thanks, Avani Loans.'
    },
    {
      name: 'doctor_professional_special_rate',
      category: 'MARKETING',
      content: 'Respected {{1}}, Avani Loans offers custom professional loans for Doctors and Chartered Accountants at low ROI starting from 8.25%. Let us know if you want to connect.'
    },
    {
      name: 'home_mortgage_eligibility',
      category: 'MARKETING',
      content: 'Hello {{1}}, interest rates for Home Loans have dropped to 8.4%! Calculate your EMI and check pre-approved eligibility instantly. Reply ROI to start.'
    },
    {
      name: 'education_loan_india',
      category: 'UTILITY',
      content: 'Hello {{1}}, secure your child\'s future with Avani Education Loans for top Indian universities. Covers 100% course fee, zero processing fee.'
    },
    {
      name: 'education_loan_global',
      category: 'UTILITY',
      content: 'Hello {{1}}, studying abroad is now stress-free. Avani Global Education Loans cover tuition fees, housing, travel expenses at attractive interest rates.'
    },
    {
      name: 'school_funding_infrastructure',
      category: 'MARKETING',
      content: 'Dear Administrator, Avani institutional loans help upgrade school infrastructure and laboratories with flexible repayment plans up to 10 years.'
    },
    {
      name: 'college_funding_expansion',
      category: 'MARKETING',
      content: 'Dear Trustee, expand your campus and student facilities with institutional college funding options up to 15 Crores. Request brochure by replying brochure.'
    }
  ];

  for (const tpl of templates) {
    const existing = await prisma.template.findFirst({
      where: { name: tpl.name, workspaceId: wsId }
    });
    if (!existing) {
      await prisma.template.create({
        data: { name: tpl.name, category: tpl.category, content: tpl.content, workspaceId: wsId }
      });
      console.log(`Created Template: ${tpl.name}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
