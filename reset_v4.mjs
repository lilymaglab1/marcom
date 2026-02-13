import axios from 'axios';

const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';
const WORKFLOW_ID = 'VrE4giq4b0V7HcVz';

async function resetWorkflow() {
    try {
        console.log(`Deactivating ${WORKFLOW_ID}...`);
        await axios.post(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}/deactivate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        await new Promise(r => setTimeout(r, 1000));

        console.log(`Activating ${WORKFLOW_ID}...`);
        await axios.post(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}/activate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        console.log('Done.');
    } catch (e) {
        console.error(e.message);
    }
}

resetWorkflow();
