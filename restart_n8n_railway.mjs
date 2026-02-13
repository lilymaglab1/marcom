import { createClient } from '@urql/core';
import { fetch } from 'cross-fetch';

const client = createClient({
    url: 'https://backboard.railway.app/graphql/v2',
    fetch,
    fetchOptions: {
        headers: {
            Authorization: `Bearer 698f79f4-8c43-4dc3-876b-96792994e637`,
        },
    },
});

const SERVICE_ID = '3a479c4a-874b-449a-89a3-53d7119c3666'; // Primary Service ID from previous logs

const RESTART_MUTATION = `
  mutation serviceRestart($id: String!) {
    serviceRestart(id: $id)
  }
`;

async function restartService() {
    console.log(`🔄 [Railway] Service Restart Initiated for ID: ${SERVICE_ID}`);
    try {
        const result = await client.mutation(RESTART_MUTATION, { id: SERVICE_ID }).toPromise();

        if (result.error) {
            console.error('❌ Restart Failed:', result.error.message);
        } else {
            console.log('✅ Restart Triggered Successfully:', result.data);
            console.log('⏳ Please wait 1-2 minutes for the service to come back online.');
        }
    } catch (error) {
        console.error('❌ Connection Error:', error);
    }
}

restartService();
