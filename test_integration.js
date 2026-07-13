const axios = require('axios');

async function runTests() {
  const phone = '917219053645';
  const name = 'Teacher Khandu';
  const baseUrl = 'http://localhost:4000/api';

  console.log('--- TEST 1: Bland AI Webhook (Call Completion) ---');
  try {
    const blandPayload = {
      call_id: 'test-call-123',
      to: phone,
      variables: { name }
    };
    const res1 = await axios.post(`${baseUrl}/bland/webhook`, blandPayload);
    console.log('Bland Webhook Response:', res1.data);
  } catch (err) {
    console.error('Bland Webhook Error:', err.response?.data || err.message);
  }

  console.log('\nWaiting 3 seconds before next test...\n');
  await new Promise(r => setTimeout(r, 3000));

  console.log('--- TEST 2: Customer Replies to WhatsApp (Trigger AI Agent) ---');
  try {
    const waPayload = {
      object: 'whatsapp_business_account',
      entry: [{
        id: '123456',
        changes: [{
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '1234567890',
              phone_number_id: '1234567890'
            },
            contacts: [{
              profile: { name },
              wa_id: phone
            }],
            messages: [{
              from: phone,
              id: 'wamid.HBgLOTE3MjE5MDUzNjQ1FQIAEhgWM0VCMDE4QjBEMzJEMTJEMEI5QjU3RgA=',
              timestamp: '1690000000',
              type: 'text',
              text: { body: 'Yes, I want to know more about the doctor loan' }
            }]
          }
        }]
      }]
    };
    
    const res2 = await axios.post(`http://localhost:4000/api/whatsapp/webhook`, waPayload);
    console.log('WhatsApp Webhook Response:', res2.data);
  } catch (err) {
    console.error('WhatsApp Webhook Error:', err.response?.data || err.message);
  }
}

runTests();
