import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const ws = await prisma.workspace.findFirst();
  if (!ws) {
    console.log("No workspace found");
    return;
  }

  const templates = [
    {
      name: "pl_new_lead_welcome",
      category: "UTILITY",
      content: "Hi {{1}}, welcome to Avani Loan Services! 🏦 We received your inquiry for a Personal Loan. To help us find the best interest rate for you, could you please let us know your required loan amount?",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "pl_eligibility_check",
      category: "MARKETING",
      content: "Hello {{1}}, Sachin Shinde here from Avani Loan Services. Did you know you might be eligible for a pre-approved Personal Loan with minimal documentation? Tap below to check your free eligibility instantly!",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "bl_document_request",
      category: "UTILITY",
      content: "Dear {{1}}, your Business Loan application is moving forward! 📈 To proceed to the sanction stage, please upload or share your last 3 years ITR and 6-month bank statement.",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "bl_sanction_congrats",
      category: "UTILITY",
      content: "Congratulations {{1}}! 🎉 Your Business Loan of Rs. {{2}} has been successfully sanctioned. Please visit our office at Rajiv Gandhi Chowk, Latur to sign the final agreement.",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "dr_clinic_expansion",
      category: "MARKETING",
      content: "Dr. {{1}}, upgrade your practice with Avani Loan Services. We offer specialized Doctor Loans for clinic expansion and equipment financing at exclusive interest rates. Let's discuss your growth plan today.",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "hl_interest_offer",
      category: "MARKETING",
      content: "Hi {{1}}, planning to buy your dream home? Avani Loan Services is currently offering Home Loans starting at highly competitive rates. Tap below to get a customized quote for your property.",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "cibil_free_consult",
      category: "MARKETING",
      content: "Hello {{1}}, a healthy CIBIL score is the key to financial freedom. 📊 Avani Loan Services offers expert CIBIL Improvement Consultation. Reply below to book your free credit score analysis session with our experts.",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "gen_doc_pending_rem",
      category: "UTILITY",
      content: "Hi {{1}}, we are eager to process your loan application! However, we are still waiting on a few pending documents. Please share them at your earliest convenience to avoid delays.",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "gen_google_review",
      category: "UTILITY",
      content: "Hi {{1}}, it was a pleasure helping you secure your loan! 🌟 If you were satisfied with Sachin Shinde and the Avani Loan Services team, we would be incredibly grateful if you could leave us a quick Google Review.",
      status: "APPROVED",
      workspaceId: ws.id
    },
    {
      name: "gen_lead_reactivation",
      category: "MARKETING",
      content: "Hi {{1}}, it's been a while since we last spoke! If you are still exploring loan options, we have some new schemes that might interest you. Are you still looking for funding?",
      status: "APPROVED",
      workspaceId: ws.id
    }
  ];

  for (const t of templates) {
    await prisma.template.create({ data: t });
  }
  console.log("Templates Seeded!");
}

seed().catch(e => console.error(e)).finally(() => prisma.$disconnect());
