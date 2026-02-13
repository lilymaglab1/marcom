import axios from 'axios';

// n8n often exposes a test webhook URL that works even if the production one is flaky
// Format: http://localhost:5678/webhook-test/lilymag-studio-v2

const WEBHOOK_TEST_URL = 'http://localhost:5678/webhook-test/lilymag-studio-v2';

async function testWebhookDebug() {
    console.log(`📡 Testing Webhook DEBUG URL: ${WEBHOOK_TEST_URL}`);
    try {
        const response = await axios.post(WEBHOOK_TEST_URL, {
            prompt: "Test Gemini integration via local n8n DEBUG"
        });

        console.log('✅ Success!');
        console.log('Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testWebhookDebug();
