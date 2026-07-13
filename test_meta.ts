import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const ws = await prisma.workspace.findFirst();
  
  const token = ws?.whatsappToken;
  const phoneId = ws?.whatsappPhoneNumberId;
  
  console.log("Token:", token?.substring(0, 15) + "...");
  console.log("Phone ID:", phoneId);
  
  // 1. Try sending as plain text
  console.log("--- Sending Plain Text ---");
  const res1 = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: '917219053645',
      type: 'text',
      text: { body: 'Hello this is a test text message' }
    }),
  });
  console.log("Text Status:", res1.status);
  console.log("Text Response:", await res1.json());

  // 2. Try sending as template (business_loan_inquiry)
  // Wait, I don't know the exact name. The user said they sent "loan_consultation_offer · English" or something, 
  // but the screenshot showed "Business Loan Inquiry". 
  
}
main();
