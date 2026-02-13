import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function deployEcho() {
    try {
        console.log('--- [TEST] Echo Webhook 배포 ---');

        // 1. 기존 echo 워크플로우 삭제 (중복 방지)
        const check = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const existing = check.data.data.find(w => w.name === "Echo Test");
        if (existing) {
            await axios.delete(`${n8n_url}/api/v1/workflows/${existing.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        }

        // 2. Echo Workflow Definition
        const workflow = {
            name: "Echo Test",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "echo-check", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [-200, 300]
                },
                {
                    parameters: {
                        respondWith: "json",
                        responseBody: "{\n  \"status\": \"ok\",\n  \"message\": \"Echo Check Passed\"\n}"
                    },
                    name: "Respond", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [100, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfId = createRes.data.id;

        // 3. Force Activate
        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        console.log(`✅ [Echo Test] 배포 완료 (Address: echo-check)`);

        // 4. Immediate Self-Check
        const testUrl = `${n8n_url}/webhook/echo-check`;
        console.log(`Checking URL: ${testUrl}`);
        try {
            const res = await axios.post(testUrl, {}, { validateStatus: () => true });
            if (res.status === 200) {
                console.log("🎉 SUCCESS: Echo responded immediately!");
            } else {
                console.log(`❌ FAILED: ${res.status} ${res.statusText}`);
            }
        } catch (e) {
            console.log(`❌ CONNECTION FAILED: ${e.message}`);
        }

    } catch (error) {
        console.error('FAILED:', error.response?.data?.message || error.message);
    }
}

deployEcho();
