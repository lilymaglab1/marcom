import axios from 'axios';

const RAILWAY_API_URL = 'https://backboard.railway.app/graphql/v2';
const RAILWAY_TOKEN = '698f79f4-8c43-4dc3-876b-96792994e637';
const SERVICE_ID = '3a479c4a-874b-449a-89a3-53d7119c3666';

async function restartServiceRetry() {
    console.log(`🔄 Triggering Redeploy for N8N Service (${SERVICE_ID})...`);

    try {
        // Correct mutation for "Restart/Redeploy" in Railway API is causing a new deployment
        const query = `
            mutation serviceInstanceDeploy($serviceId: String!) {
                serviceInstanceDeploy(serviceId: $serviceId)
            }
        `;

        // If that fails, we try the known working "variable update" trick which forces a restart
        // But let's try finding the right mutation first. 
        // Actually, often users just redeploy the latest commit.

        // Let's try a strict "deploymentTrigger" if available, or just a dummy variable update.
        // A guaranteed way to restart is to update a dummy variable.

        const mutation = `
            mutation variableCollectionUpsert($serviceId: String!, $variables: [VariableConstructInput!]!) {
                variableCollectionUpsert(serviceId: $serviceId, variables: $variables)
            }
        `;

        // Just touching a variable (even with same value, or a timestamp) triggers redeploy
        const variables = {
            serviceId: SERVICE_ID,
            variables: {
                "RESTART_TRIGGER": new Date().toISOString()
            }
        };

        const response = await axios.post(RAILWAY_API_URL, {
            query: mutation,
            variables
        }, {
            headers: {
                'Authorization': `Bearer ${RAILWAY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.errors) {
            console.error('❌ Redeploy Failed:', JSON.stringify(response.data.errors, null, 2));
        } else {
            console.log('✅ Redeploy Triggered Successfully! (Updated RESTART_TRIGGER)');
            console.log('⏳ Service will restart in 30-60 seconds.');
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
}

restartServiceRetry();
