import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

// Gemini Key (Known Working ID)
const gemini_cred_id = 'alOOT6OgNi3ist2C';

async function deployFailSafeFactory() {
    try {
        console.log('--- [긴급] 최종 가동 보장형 공장 재배포 ---');

        // 1. 기존 워크플로우 정리
        const workflows = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of workflows.data.data) {
            if (wf.name.includes("Lilymag")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            }
        }

        // 2. 심플 & 강력 워크플로우 (Gemini Text + Pollinations Image)
        const workflow = {
            name: "Lilymag Creative Studio [FAILSAFE]",
            nodes: [
                // [1] Webhook
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [0, 300]
                },
                // [2] Text Generator (Chain LLM)
                {
                    parameters: {
                        prompt: "={{ $json.body.topic }}에 대해 [에이전트]: {{ $json.body.agent }} 성격으로 짧고 강렬한 마케팅 콘텐츠를 작성해줘. (브랜드: 릴리맥, 어조: 우아함)"
                    },
                    name: "Text Generator", type: "@n8n/n8n-nodes-langchain.chainLlm", typeVersion: 1.4, position: [300, 300]
                },
                // [3] Gemini Model (Key Connected)
                {
                    parameters: { modelName: "gemini-1.5-flash", options: {} }, // Flash is safer/faster
                    name: "Gemini Pro", type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini", typeVersion: 1, position: [300, 520],
                    credentials: { googlePalmApi: { id: gemini_cred_id, name: "Google Gemini(PaLM) Api account" } }
                },
                // [4] Output Formatter
                {
                    parameters: {
                        respondWith: "allIncomingItems",
                        options: {
                            responseBody: "{\n  \"text\": \"{{ $json.text.replace(/\"/g, '\\\\\"').replace(/\\n/g, '\\\\n') }}\",\n  \"image_url\": \"https://image.pollinations.ai/prompt/{{$node['Webhook'].json.body.topic}}%20luxury%20floral%20design%20cinematic%20lighting?width=1024&height=1024&nologo=true&seed={{$json.runIndex}}\",\n  \"video_url\": \"\"\n}"
                        }
                    },
                    name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [700, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "Text Generator", "type": "main", "index": 0 }]] },
                "Gemini Pro": { "ai_languageModel": [[{ "node": "Text Generator", "type": "ai_languageModel", "index": 0 }]] },
                "Text Generator": { "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfId = createRes.data.id;

        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        console.log(`✅ [복구 완료] 워크플로우 재배포 & 활성화 성공.`);
        console.log(`(ID: ${wfId})`);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

deployFailSafeFactory();
