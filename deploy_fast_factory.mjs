import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const gemini_cred_id = 'alOOT6OgNi3ist2C'; // 기존 확보된 키 ID

async function deployInstantMultimediaFactory() {
    try {
        console.log('--- [긴급] 즉시 작동하는 멀티미디어 공장 가동 ---');

        // 1. 기존 워크플로우 정리
        const workflows = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of workflows.data.data) {
            if (wf.name.includes("Lilymag")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            }
        }

        // 2. 심플 & 강력 워크플로우 (Gemini Text + Pollinations Image)
        const workflow = {
            name: "Lilymag Creative Studio [INSTANT LIVE]",
            nodes: [
                // [1] Webhook
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [0, 300]
                },
                // [2] AI Agent (Text)
                {
                    parameters: { options: { systemMessage: "릴리맥의 수석 디렉터로서 우아한 톤의 마케팅 카피를 작성합니다." } },
                    name: "AI Director", type: "@n8n/n8n-nodes-langchain.agent", typeVersion: 1.6, position: [250, 300]
                },
                // [3] Gemini Model (Text Engine) - *Key Auto-Connected*
                {
                    parameters: { modelName: "gemini-1.5-pro", options: {} },
                    name: "Gemini Pro", type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini", typeVersion: 1, position: [150, 520],
                    credentials: { googlePalmApi: { id: gemini_cred_id, name: "Google Gemini(PaLM) Api account" } }
                },
                // [4] Memory
                {
                    parameters: {},
                    name: "Memory", type: "@n8n/n8n-nodes-langchain.memoryWindowBuffer", typeVersion: 1, position: [350, 520]
                },
                // [5] Image Generation (Pollinations - No Key Needed)
                {
                    parameters: {
                        url: "https://image.pollinations.ai/prompt/{{$node['Webhook'].json.body.topic}}%20in%20luxury%20flower%20style?width=1024&height=1024&nologo=true",
                        method: "GET"
                    },
                    name: "Instant Image Gen", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [500, 150]
                },
                // [6] Output Formatter
                {
                    parameters: {
                        respondWith: "allIncomingItems",
                        options: {
                            responseBody: "{\n  \"text\": \"{{ $node['AI Director'].json.output }}\",\n  \"image_url\": \"https://image.pollinations.ai/prompt/{{$node['Webhook'].json.body.topic}}%20luxury%20floral?width=1024&height=1024&nologo=true\",\n  \"video_url\": \"\"\n}"
                        }
                    },
                    name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [800, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "AI Director", "type": "main", "index": 0 }, { "node": "Instant Image Gen", "type": "main", "index": 0 }]] },
                "Gemini Pro": { "ai_languageModel": [[{ "node": "AI Director", "type": "ai_languageModel", "index": 0 }]] },
                "Memory": { "ai_memory": [[{ "node": "AI Director", "type": "ai_memory", "index": 0 }]] },
                "AI Director": { "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]] },
                "Instant Image Gen": { "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfId = createRes.data.id;

        // Active
        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        console.log(`✅ [성공] 즉시 작동 모드 활성화 완료.`);
        console.log(`- 텍스트: Gemini Pro (키 자동연결됨)`);
        console.log(`- 이미지: Pollinations AI (무제한/무료)`);
        console.log(`- 영상: 준비중 (빈 값 반환)`);
        console.log(`👉 이제 앱에서 버튼만 누르시면 됩니다.`);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

deployInstantMultimediaFactory();
