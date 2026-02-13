import axios from 'axios';

const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';

async function listWorkflows() {
    console.log('--- 📋 Listing Local Workflows ---');
    try {
        const res = await axios.get(`${N8N_URL}/api/v1/workflows`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        const workflows = res.data.data;
        console.log(`Total Workflows: ${workflows.length}`);

        for (const wf of workflows) {
            console.log(`\n🆔 ID: ${wf.id}`);
            console.log(`📛 Name: ${wf.name}`);
            console.log(`💡 Active: ${wf.active}`);

            // Find webhook node
            const webhookNode = wf.nodes.find(n => n.type.includes('webhook'));
            if (webhookNode) {
                console.log(`🔗 Webhook Path: ${webhookNode.parameters.path}`);
                console.log(`📡 Method: ${webhookNode.parameters.httpMethod}`);
            } else {
                console.log(`❌ No Webhook Node Found`);
            }
        }
    } catch (error) {
        console.error('FAILED:', error.message);
    }
}

listWorkflows();
