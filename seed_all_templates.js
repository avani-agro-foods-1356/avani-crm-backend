const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 12 compliant WhatsApp Templates for AVANI LOAN SERVICES...');

  // 1. Get or Create Default Workspace
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: 'Avani Loan Services Default' }
    });
  }
  const wsId = workspace.id;

  const newTemplates = [
    {
      name: 'personal_loan_application_status',
      category: 'UTILITY',
      content: 'Personal Loan Update\n\nHello {{1}},\n\nYour Personal Loan application reference number {{2}} has been successfully received by AVANI LOAN SERVICES.\n\nCurrent Status: {{3}}\n\nOur team will contact you shortly for the next steps.\n\nThank you.'
    },
    {
      name: 'business_loan_status_update',
      category: 'UTILITY',
      content: 'Business Loan Update\n\nHello {{1}},\n\nYour Business Loan application {{2}} is currently under review.\n\nCurrent Status: {{3}}\n\nOur loan advisor will keep you informed regarding further processing.\n\nThank you.'
    },
    {
      name: 'doctor_loan_application_update',
      category: 'UTILITY',
      content: 'Doctor Loan Update\n\nHello Dr. {{1}},\n\nYour Doctor Loan application {{2}} has been processed.\n\nCurrent Status: {{3}}\n\nFor any queries, please reply to this message.\n\nThank you.'
    },
    {
      name: 'ca_loan_application_update',
      category: 'UTILITY',
      content: 'CA Professional Loan Update\n\nHello {{1}},\n\nYour Chartered Accountant Loan application reference {{2}} is currently {{3}}.\n\nOur team will contact you regarding further requirements if needed.\n\nThank you.'
    },
    {
      name: 'home_loan_status_update',
      category: 'UTILITY',
      content: 'Home Loan Update\n\nHello {{1}},\n\nYour Home Loan application {{2}} is currently at the following stage:\n\n{{3}}\n\nOur representative will guide you through the next process.\n\nThank you.'
    },
    {
      name: 'mortgage_loan_status_update',
      category: 'UTILITY',
      content: 'Mortgage Loan Update\n\nHello {{1}},\n\nWe would like to inform you that your Mortgage Loan application {{2}} is currently:\n\n{{3}}\n\nFor assistance, please reply to this message.\n\nThank you.'
    },
    {
      name: 'education_loan_india_update',
      category: 'UTILITY',
      content: 'Education Loan Update\n\nHello {{1}},\n\nYour Education Loan (India) application {{2}} has been updated.\n\nCurrent Status: {{3}}\n\nOur team will assist you with the next steps.\n\nThank you.'
    },
    {
      name: 'education_loan_global_update',
      category: 'UTILITY',
      content: 'Global Education Loan Update\n\nHello {{1}},\n\nYour Global Education Loan application {{2}} is currently:\n\n{{3}}\n\nPlease keep the required documents ready for further processing.\n\nThank you.'
    },
    {
      name: 'school_funding_application_update',
      category: 'UTILITY',
      content: 'School Funding Update\n\nHello {{1}},\n\nYour School Funding request {{2}} has been reviewed.\n\nCurrent Status: {{3}}\n\nOur funding specialist will contact you shortly.\n\nThank you.'
    },
    {
      name: 'college_funding_application_update',
      category: 'UTILITY',
      content: 'College Funding Update\n\nHello {{1}},\n\nYour College Funding request {{2}} is currently:\n\n{{3}}\n\nPlease reply if you require any assistance.\n\nThank you.'
    },
    {
      name: 'cibil_consultation_confirmation',
      category: 'UTILITY',
      content: 'Consultation Confirmation\n\nHello {{1}},\n\nYour CIBIL Improvement Consultation has been successfully scheduled.\n\nConsultation Date: {{2}}\nConsultation Time: {{3}}\n\nOur advisor will contact you at the scheduled time.\n\nThank you.'
    },
    {
      name: 'document_verification_request',
      category: 'UTILITY',
      content: 'Document Verification\n\nHello {{1}},\n\nAdditional documents are required to process your application {{2}}.\n\nRequired Document: {{3}}\n\nPlease submit the requested document at the earliest convenience.\n\nThank you.'
    }
  ];

  for (const tpl of newTemplates) {
    // delete if existing to overwrite
    await prisma.template.deleteMany({
      where: { name: tpl.name, workspaceId: wsId }
    });

    await prisma.template.create({
      data: {
        name: tpl.name,
        category: tpl.category,
        content: tpl.content,
        status: 'APPROVED',
        workspaceId: wsId
      }
    });
    console.log(`Seeded Template: ${tpl.name} [APPROVED]`);
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
