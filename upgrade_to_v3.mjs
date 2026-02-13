import axios from 'axios';

const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';
const WORKFLOW_ID = 'EmA0nfxCqfyPV0Mu';

async function updateToV3() {
    console.log(`🔧 Updating workflow ${WORKFLOW_ID} to V3...`);
    try {
        // 1. Get current workflow
        let { data: workflow } = await axios.get(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        // 1.5 Sanitize for Update (Remove read-only fields)
        const allowedKeys = ['name', 'nodes', 'connections', 'settings', 'staticData'];
        const updatePayload = {};
        for (const key of allowedKeys) {
            if (workflow[key] !== undefined) updatePayload[key] = workflow[key];
        }

        // 2. Modify Webhook Node (path: lilymag-studio-v3)
        const webhookNode = updatePayload.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
        if (webhookNode) {
            webhookNode.parameters.path = 'lilymag-studio-v3';
            console.log('   - Webhook path updated to: lilymag-studio-v3');
        }

        // 3. Modify Respond Node (Static JSON)
        const respondNode = updatePayload.nodes.find(n => n.type === 'n8n-nodes-base.respondToWebhook');
        if (respondNode) {
            respondNode.parameters = {
                "respondWith": "json",
                "responseBody": "{\n \"result\": \"success\",\n \"message\": \"Hello from V3\"\n}",
                "options": {}
            };
            console.log('   - Respond node updated to return static JSON');
        }

        // 4. Save
        await axios.put(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}`, updatePayload, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log('✅ Workflow saved.');

        // 5. Activate
        await axios.post(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}/activate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log('✅ Workflow activated.');

    } catch (error) {
        console.error('❌ Failed:', error.message);
        if (error.response) console.error(JSON.stringify(error.response.data, null, 2));
    }
}

updateToV3();
