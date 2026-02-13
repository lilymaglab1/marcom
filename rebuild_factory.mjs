import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function rebuildFromScratch() {
    try {
        console.log('--- [1] 기존 워크플로우 청소 ---');
        const listRes = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of listRes.data.data) {
            if (wf.name.includes("Lilymag Google")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
                console.log(`삭제됨: ${wf.name}`);
            }
        }

        console.log('--- [2] 구글 기반 풀스택 공장 재건설 ---');
        const workflow = {
            name: "Lilymag Google Ultimate Factory [FINAL]",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [-200, 300]
                },
                {
                    parameters: { options: { systemMessage: "릴리맥 수석 디렉터로서 텍스트, 이미지(Imagen), 영상(Veo) 기획을 총괄합니다." } },
                    name: "Google Creative Director", type: "@n8n/n8n-nodes-langchain.agent", typeVersion: 1.6, position: [100, 300]
                },
                {
                    parameters: { modelName: "gemini-1.5-pro" },
                    name: "Google Vertex AI (Gemini)", type: "@n8n/n8n-nodes-langchain.lmChatGoogleVertexAi", typeVersion: 1, position: [0, 520]
                },
                {
                    parameters: {},
                    name: "Google Cloud Memory", type: "@n8n/n8n-nodes-langchain.memoryWindowBuffer", typeVersion: 1, position: [200, 520]
                },
                {
                    parameters: { resource: "image", operation: "generate" },
                    name: "Google Imagen 3", type: "n8n-nodes-base.googleCloudVertexAi", typeVersion: 1, position: [400, 450]
                },
                {
                    parameters: { url: "https://veo.google.com/api" },
                    name: "Google Veo (Video Gen)", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [400, 150]
                },
                {
                    parameters: { url: "https://api.x.ai/v1" },
                    name: "xAI Grok (Reviewer)", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [650, 300]
                },
                {
                    parameters: { respondWith: "allIncomingItems" },
                    name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [900, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "Google Creative Director", "type": "main", "index": 0 }]] },
                "Google Vertex AI (Gemini)": { "ai_languageModel": [[{ "node": "Google Creative Director", "type": "ai_languageModel", "index": 0 }]] },
                "Google Cloud Memory": { "ai_memory": [[{ "node": "Google Creative Director", "type": "ai_memory", "index": 0 }]] },
                "Google Creative Director": {
                    "main": [
                        [{ "node": "Google Veo (Video Gen)", "type": "main", "index": 0 }],
                        [{ "node": "Google Imagen 3", "type": "main", "index": 0 }]
                    ]
                },
                "Google Veo (Video Gen)": { "main": [[{ "node": "xAI Grok (Reviewer)", "type": "main", "index": 0 }]] },
                "Google Imagen 3": { "main": [[{ "node": "xAI Grok (Reviewer)", "type": "main", "index": 0 }]] },
                "xAI Grok (Reviewer)": { "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        console.log(`✅ 생성 완료! 새 ID: ${createRes.data.id}`);
        console.log(`주소: ${n8n_url}/workflow/${createRes.data.id}`);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

rebuildFromScratch();
