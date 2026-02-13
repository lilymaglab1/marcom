import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function restoreGoogleFactory() {
    try {
        console.log('--- [복구] Google Premium Factory (Gemini 1.5 Pro) 재건설 ---');

        // 1. 기존 삭제
        const workflows = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of workflows.data.data) {
            if (wf.name.includes("Lilymag")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            }
        }

        // 2. Real Google Workflow
        const workflow = {
            name: "Lilymag Creative Studio [GOOGLE PRO]",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [-200, 300]
                },
                {
                    parameters: {
                        // 에이전트 대신 체인 사용 (안정성 확보)
                        prompt: "={{ $json.body.topic }}에 대해 [페르소나: {{ $json.body.agent }}]로서 릴리맥 브랜드의 우아하고 전문적인 마케팅 콘텐츠를 작성하시오. (한국어)"
                    },
                    name: "Gemini Agent", type: "@n8n/n8n-nodes-langchain.chainLlm", typeVersion: 1.4, position: [100, 300]
                },
                {
                    parameters: { modelName: "models/gemini-1.5-pro", options: {} },
                    name: "Google Gemini Pro", type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini", typeVersion: 1, position: [100, 520],
                    // credentials: { googlePalmApi: { id: "NEW_KEY", name: "Google Gemini Key" } } // 수동 연결 유도
                },
                // Imagen 3 (Placeholder for Setup)
                {
                    parameters: {
                        resource: "image", operation: "generate",
                        prompt: "={{ $json.text }} related luxury floral image, cinematic lighting, 8k",
                        model: "imagen-3"
                    },
                    name: "Google Imagen 3", type: "n8n-nodes-base.googleCloudVertexAi", typeVersion: 1, position: [400, 450]
                },
                // Veo (Placeholder)
                {
                    parameters: { url: "https://veo.google.com/api" },
                    name: "Google Veo", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [400, 150]
                },
                // Output
                {
                    parameters: {
                        respondWith: "allIncomingItems",
                        options: {
                            responseBody: "{\n  \"text\": \"{{ $json.text.replace(/\"/g, '\\\\\"').replace(/\\n/g, '\\\\n') }}\",\n  \"image_url\": \"\",\n  \"video_url\": \"\"\n}"
                        }
                    },
                    name: "Respond", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [800, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "Gemini Agent", "type": "main", "index": 0 }]] },
                "Google Gemini Pro": { "ai_languageModel": [[{ "node": "Gemini Agent", "type": "ai_languageModel", "index": 0 }]] },
                "Gemini Agent": {
                    "main": [
                        [{ "node": "Respond", "type": "main", "index": 0 }]
                        // 병렬로 Imagen/Veo 연결하려면 Agent 뒤에 Flow 분기 필요하지만, 
                        // 현재 500 에러 방지를 위해 Text->Respond를 메인으로 잡고 
                        // Imagen 등은 추후 연결하도록 일단 끊어둡니다. (키 넣고 연결하시면 됩니다)
                    ]
                }
            },
            settings: { executionOrder: "v1" }
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfId = createRes.data.id;

        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        console.log(`✅ [복구 완료] Gemini Pro 기반 프리미엄 공장(ID: ${wfId})`);
        console.log(`이제 'Google Gemini Pro' 노드를 눌러서 [Create New Credential] -> API Key만 입력하면 됩니다.`);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

restoreGoogleFactory();
