import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function listNodeTypesV2() {
    try {
        // Try internal-ish endpoints if public ones fail
        const response = await axios.get(`${n8n_url}/api/v1/node-types`, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });
        console.log('Node Types found:', response.data.length);
    } catch (error) {
        try {
            // Maybe it's under a different version or path
            const response2 = await axios.get(`${n8n_url}/api/v1/owner/settings`, {
                headers: { 'X-N8N-API-KEY': n8n_api_key }
            });
            console.log('Settings:', JSON.stringify(response2.data, null, 2));
        } catch (e) {
            console.error('Failed to get settings.');
        }
    }
}
listNodeTypesV2();
