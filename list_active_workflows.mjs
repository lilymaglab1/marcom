import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function listWorkflows() {
    try {
        console.log('--- 📋 Listing All Active Workflows ---');
        const response = await axios.get(`${n8n_url}/api/v1/workflows`, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });

        const activeWfs = response.data.data.filter(w => w.active);
        console.log(`Total Workflows: ${response.data.data.length}`);
        console.log(`Active Workflows: ${activeWfs.length}`);

        activeWfs.forEach(w => {
            console.log(`\n🆔 ID: ${w.id}`);
            console.log(`📛 Name: ${w.name}`);
            console.log(`📅 Created: ${w.createdAt}`);
            console.log(`🔄 Updated: ${w.updatedAt}`);
            // Find Webhook node to print path
            const webhookNode = w.nodes.find(n => n.type.includes('webhook'));
            if (webhookNode) {
                console.log(`🔗 Webhook Path: ${webhookNode.parameters.path}`);
                console.log(`📡 Method: ${webhookNode.parameters.httpMethod || 'GET'}`);
            } else {
                console.log('⚠️ No Webhook Node found');
            }
        });

    } catch (error) {
        console.error('FAILED:', error.message);
    }
}

listWorkflows();
