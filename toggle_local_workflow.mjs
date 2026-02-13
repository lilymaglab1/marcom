import axios from 'axios';

const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';
const WORKFLOW_ID = 'EmA0nfxCqfyPV0Mu';

async function toggleWorkflow() {
    console.log(`🔄 Toggling workflow ${WORKFLOW_ID}...`);
    try {
        console.log('Stopping...');
        await axios.post(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}/deactivate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log('✅ Deactivated.');

        await new Promise(r => setTimeout(r, 2000));

        console.log('Starting...');
        await axios.post(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}/activate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log('✅ Activated.');

    } catch (error) {
        if (error.response) {
            console.error('FAILED:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('ERROR:', error.message);
        }
    }
}

toggleWorkflow();
