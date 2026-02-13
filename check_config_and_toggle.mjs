import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function checkN8nConfig() {
    try {
        console.log('--- ⚙️ Checking n8n Instance Configuration ---');
        // This endpoint often reveals the instance URL known to n8n
        // Or owner/me
        try {
            const userRes = await axios.get(`${n8n_url}/api/v1/owner`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            console.log('User Info:', JSON.stringify(userRes.data, null, 2));
        } catch (e) { console.log('Owner check failed'); }

        // Try to trigger a webhook test to see what URL it suggests in the error or response?
        // Actually, let's look at the "Push" or "Webhook" nodes in the workflow to see if they have a "url" property in the UI data?
        // The API list-workflows doesn't show the full resolved URL.

        // What if we try to update the workflow to be INACTIVE then ACTIVE again?
        // Maybe the restart loaded the DB state but didn't trigger the "on activation" hooks properly?
        // This happens sometimes.

        console.log('... Attempting toggle activation ...');
        const wfId = 'RkWJfU114SPseYSP'; // v2 ID

        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/deactivate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        console.log('Deactivated.');

        await new Promise(r => setTimeout(r, 1000));

        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        console.log('Activated.');

    } catch (error) {
        console.error('FAILED:', error.message);
    }
}

checkN8nConfig();
