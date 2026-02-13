import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const gemini_cred_id = 'alOOT6OgNi3ist2C';

async function deployNoMemFactory() {
    try {
        console.log('--- [최종] 메모리 제외 & 핵심 기능 가동 ---');

        // 1. 구형 삭제
        const workflows = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of workflows.data.data) {
            if (wf.name.includes("Lilymag")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            }
        }

        // 2. 핵심 (Text + Image) 워크플로우
        const workflow = {
            name: "Lilymag Creative Studio [LIVE]",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [0, 300]
                },
                // LLM Chain (Agent 대신 Chain 사용 - 더 안정적)
                {
                    parameters: {
                        prompt: "={{ $json.body.topic }}에 대해 [에이전트]: {{ $json.body.agent }} 성격으로 마케팅 콘텐츠를 작성해줘. (브랜드: 릴리맥, 어조: 우아함)"
                    },
                    name: "Text Generator", type: "@n8n/n8n-nodes-langchain.chainLlm", typeVersion: 1.4, position: [300, 300]
                },
                // Gemini Model (Key Auto-Connected)
                {
                    parameters: { modelName: "gemini-1.5-pro", options: {} },
                    name: "Gemini Pro", type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini", typeVersion: 1, position: [300, 520],
                    credentials: { googlePalmApi: { id: gemini_cred_id, name: "Google Gemini(PaLM) Api account" } }
                },
                // Output Formatting
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

        console.log(`✅ [성공] 텍스트 & 이미지 자동 생성 엔진 활성화 완료.`);
        console.log(`(워크플로우 ID: ${wfId})`);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

deployNoMemFactory();
