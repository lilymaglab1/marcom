import axios from 'axios';

const RAILWAY_API_URL = 'https://backboard.railway.app/graphql/v2';
const RAILWAY_TOKEN = '698f79f4-8c43-4dc3-876b-96792994e637';
const SERVICE_ID = '3a479c4a-874b-449a-89a3-53d7119c3666';

async function restartService() {
    console.log(`🔄 Restarting N8N Service (${SERVICE_ID})...`);

    try {
        const query = `
            mutation serviceRestart($id: String!) {
                serviceRestart(id: $id)
            }
        `;

        const variables = { id: SERVICE_ID };

        const response = await axios.post(RAILWAY_API_URL, {
            query,
            variables
        }, {
            headers: {
                'Authorization': `Bearer ${RAILWAY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.errors) {
            console.error('❌ Restart Failed:', JSON.stringify(response.data.errors, null, 2));
        } else {
            console.log('✅ Restart Triggered Successfully!');
            console.log('Result:', JSON.stringify(response.data.data, null, 2));
            console.log('⏳ Please wait 30-60 seconds for the service to rebuild.');
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

restartService();
