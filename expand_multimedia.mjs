import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const wf_id = 'SUd6bHQ6AJWYfbZh';

async function expandToMultimediaFactory() {
    try {
        console.log('--- [확장] 멀티미디어 생산 라인 설계 중 ---');

        const workflow = {
            name: "Lilymag Multimedia Creative Factory [Full Scale]",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    id: "node-webhook", name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [0, 300]
                },
                {
                    parameters: { options: { systemMessage: "당신은 릴리맥의 총괄 디렉터입니다. 글자뿐만 아니라 이미지와 영상 제작을 위한 기획까지 수행합니다." } },
                    id: "node-agent", name: "AI Agent", type: "@n8n/n8n-nodes-langchain.agent", typeVersion: 1.6, position: [260, 300]
                },
                {
                    parameters: { modelName: "gemini-1.5-pro", options: {} },
                    id: "node-gemini", name: "Google Gemini Chat Model", type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini", typeVersion: 1, position: [180, 520]
                },
                {
                    parameters: {},
                    id: "node-memory", name: "Window Buffer Memory", type: "@n8n/n8n-nodes-langchain.memoryWindowBuffer", typeVersion: 1, position: [340, 520]
                },
                // --- 이미지 생성 라인 ---
                {
                    parameters: { operation: "textToImage" },
                    id: "node-dalle", name: "DALL-E (Image Gen)", type: "n8n-nodes-base.openAi", typeVersion: 1, position: [550, 450]
                },
                // --- 영상 생성 라인 (API 연동) ---
                {
                    parameters: { url: "https://api.runwayml.com/v1/generate", method: "POST", bodyParameters: { parameters: [{ name: "prompt", value: "={{ $node['AI Agent'].json.video_prompt }}" }] } },
                    id: "node-video", name: "Runway AI (Video Gen)", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [550, 150]
                },
                {
                    parameters: { respondWith: "allIncomingItems", options: { responseBody: "{\n  \"text\": \"{{ $node['AI Agent'].json.output }}\",\n  \"image_url\": \"{{ $node['DALL-E (Image Gen)'].json.url }}\",\n  \"video_url\": \"{{ $node['Runway AI (Video Gen)'].json.url }}\"\n}" } },
                    id: "node-respond", name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [850, 300]
                },
                {
                    parameters: { content: "### 릴리맥 멀티미디어 공장\n1. 상단: 영상 생성 라인\n2. 중앙: 텍스트 엔진\n3. 하단: 이미지 생성 라인" },
                    id: "node-note", name: "Manual", type: "n8n-nodes-base.stickyNote", typeVersion: 1, position: [-50, 50]
                }
            ],
            connections: {
                "node-webhook": { "main": [[{ "node": "node-agent", "type": "main", "index": 0 }]] },
                "node-gemini": { "ai_languageModel": [[{ "node": "node-agent", "type": "ai_languageModel", "index": 0 }]] },
                "node-memory": { "ai_memory": [[{ "node": "node-agent", "type": "ai_memory", "index": 0 }]] },
                "node-agent": {
                    "main": [
                        [{ "node": "node-video", "type": "main", "index": 0 }],
                        [{ "node": "node-dalle", "type": "main", "index": 0 }]
                    ]
                },
                "node-video": { "main": [[{ "node": "node-respond", "type": "main", "index": 0 }]] },
                "node-dalle": { "main": [[{ "node": "node-respond", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        console.log('--- Pushing Full Scale Multimedia Architecture ---');
        await axios.put(`${n8n_url}/api/v1/workflows/${wf_id}`, workflow, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });

        console.log('SUCCESS: 멀티미디어 통합 생산 공장 라인 구축 완료.');
    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

expandToMultimediaFactory();
