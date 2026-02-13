import axios from 'axios';

const WEBHOOK_URL = 'http://localhost:5678/webhook/lilymag-studio-v2';

async function testWebhook() {
    console.log(`📡 Testing Webhook: ${WEBHOOK_URL}`);
    try {
        const response = await axios.post(WEBHOOK_URL, {
            prompt: "Test Gemini integration via local n8n"
        });

        console.log('✅ Success!');
        console.log('Status:', response.status);
        console.log('Headers:', JSON.stringify(response.headers, null, 2));
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('❌ Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testWebhook();
