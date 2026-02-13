import axios from 'axios';

const WEBHOOK_V3_URL = 'http://localhost:5678/webhook/lilymag-studio-v3';

async function testV3() {
    console.log(`📡 Testing Webhook V3: ${WEBHOOK_V3_URL}`);
    try {
        const response = await axios.post(WEBHOOK_V3_URL, {
            prompt: "Test V3 Connection"
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

testV3();
