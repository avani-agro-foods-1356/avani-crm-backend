import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const TOKEN = process.env.META_API_TOKEN || process.env.WHATSAPP_TOKEN;
  console.log(`Fetching WABA info using token...`);
  
  // Get the WhatsApp Business Accounts for this token
  const response = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${TOKEN}`);
  const data = await response.json();
  console.log("Accounts:", JSON.stringify(data, null, 2));

  // Let's also check the actual WABA IDs linked to this business
  const wabaResponse = await fetch(`https://graph.facebook.com/v19.0/me/businesses?access_token=${TOKEN}`);
  const wabaData = await wabaResponse.json();
  console.log("Businesses:", JSON.stringify(wabaData, null, 2));
}

main().catch(console.error);
