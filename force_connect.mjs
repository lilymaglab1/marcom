import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const wf_id = 'SUd6bHQ6AJWYfbZh';

async function forceConnectEverything() {
    try {
        console.log('--- [강제 결속] 모든 노드 ID 및 선 연결 재구성 ---');

        const workflow = {
            name: "Lilymag Google Ultimate Creative Factory [v5]",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    id: "id-webhook", name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [-200, 300]
                },
                {
                    parameters: { options: { systemMessage: "릴리맥 수석 디렉터로서 텍스트, 이미지(Imagen), 영상(Veo) 기획을 총괄합니다." } },
                    id: "id-agent", name: "Google Creative Director", type: "@n8n/n8n-nodes-langchain.agent", typeVersion: 1.6, position: [100, 300]
                },
                {
                    parameters: { modelName: "gemini-1.5-pro" },
                    id: "id-gemini", name: "Google Vertex AI (Gemini)", type: "@n8n/n8n-nodes-langchain.lmChatGoogleVertexAi", typeVersion: 1, position: [0, 520]
                },
                {
                    parameters: {},
                    id: "id-memory", name: "Google Cloud Memory", type: "@n8n/n8n-nodes-langchain.memoryWindowBuffer", typeVersion: 1, position: [200, 520]
                },
                {
                    parameters: { resource: "image", operation: "generate", model: "imagen-3", prompt: "={{$node['Google Creative Director'].json.image_prompt}}" },
                    id: "id-imagen", name: "Google Imagen 3", type: "n8n-nodes-base.googleCloudVertexAi", typeVersion: 1, position: [400, 450]
                },
                {
                    parameters: { url: "https://veo-api.google.com/generate", method: "POST", sendBody: true, bodyParameters: { parameters: [{ name: "prompt", value: "={{$node['Google Creative Director'].json.video_prompt}}" }] } },
                    id: "id-veo", name: "Google Veo (Video Gen)", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [400, 150]
                },
                {
                    parameters: { method: "POST", url: "https://api.x.ai/v1/chat/completions", sendBody: true, bodyParameters: { parameters: [{ name: "content", value: "={{$node['Google Creative Director'].json.output}}" }] } },
                    id: "id-grok", name: "xAI Grok (Reviewer)", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [650, 300]
                },
                {
                    parameters: { respondWith: "allIncomingItems", options: { responseBody: "{\n  \"text\": \"{{ $node['Google Creative Director'].json.output }}\",\n  \"image_url\": \"{{ $node['id-imagen'].json.url }}\",\n  \"video_url\": \"{{ $node['id-veo'].json.url }}\"\n}" } },
                    id: "id-respond", name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [900, 300]
                }
            ],
            connections: {
                "id-webhook": { "main": [[{ "node": "id-agent", "type": "main", "index": 0 }]] },
                "id-gemini": { "ai_languageModel": [[{ "node": "id-agent", "type": "ai_languageModel", "index": 0 }]] },
                "id-memory": { "ai_memory": [[{ "node": "id-agent", "type": "ai_memory", "index": 0 }]] },
                "id-agent": {
                    "main": [
                        [{ "node": "id-veo", "type": "main", "index": 0 }],
                        [{ "node": "id-imagen", "type": "main", "index": 0 }]
                    ]
                },
                "id-veo": { "main": [[{ "node": "id-grok", "type": "main", "index": 0 }]] },
                "id-imagen": { "main": [[{ "node": "id-grok", "type": "main", "index": 0 }]] },
                "id-grok": { "main": [[{ "node": "id-respond", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        await axios.put(`${n8n_url}/api/v1/workflows/${wf_id}`, workflow, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });

        console.log('✅ 전 공정 물리적 연결 완료. 빨간 느낌표가 사라졌을 것입니다.');
    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

forceConnectEverything();
