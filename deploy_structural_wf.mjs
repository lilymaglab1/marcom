import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function deployFullWorkflow() {
    const workflow = {
        name: "Lilymag Creative Studio [Structural Build]",
        nodes: [
            {
                parameters: {
                    httpMethod: "POST",
                    path: "lilymag-creative-studio",
                    responseMode: "responseNode",
                    options: {}
                },
                id: "node-webhook",
                name: "Webhook",
                type: "n8n-nodes-base.webhook",
                typeVersion: 1,
                position: [200, 300],
                webhookId: "lilymag-creative-studio"
            },
            {
                parameters: {
                    options: {}
                },
                id: "node-agent",
                name: "AI Agent",
                type: "@n8n/n8n-nodes-langchain.agent",
                typeVersion: 1.6,
                position: [460, 300]
            },
            {
                parameters: {
                    modelName: "gemini-1.5-pro",
                    options: {}
                },
                id: "node-gemini",
                name: "Google Gemini Chat Model",
                type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
                typeVersion: 1,
                position: [380, 520]
            },
            {
                parameters: {},
                id: "node-memory",
                name: "Window Buffer Memory",
                type: "@n8n/n8n-nodes-langchain.memoryWindowBuffer",
                typeVersion: 1,
                position: [540, 520]
            },
            {
                parameters: {
                    respondWith: "allIncomingItems",
                    options: {
                        responseBody: "{\n  \"output\": \"{{ $json.output }}\"\n}"
                    }
                },
                id: "node-respond",
                name: "Respond to Webhook",
                type: "n8n-nodes-base.respondToWebhook",
                typeVersion: 1,
                position: [750, 300]
            },
            {
                parameters: {
                    content: "## 릴리맥 크리에이티브 엔진\n이 워크플로우는 AI 에이전트를 통해 릴리맥의 브랜드 톤앤매너로 콘텐츠를 생성합니다.\n\n1. Webhook으로 주제를 전달받음\n2. AI Agent가 Gemini 모델을 사용하여 콘텐츠 생성\n3. Respond node를 통해 결과를 반환"
                },
                id: "node-note",
                name: "Sticky Note",
                type: "n8n-nodes-base.stickyNote",
                typeVersion: 1,
                position: [160, 100]
            }
        ],
        connections: {
            "node-webhook": {
                "main": [[{ "node": "node-agent", "type": "main", "index": 0 }]]
            },
            "node-gemini": {
                "ai_languageModel": [[{ "node": "node-agent", "type": "ai_languageModel", "index": 0 }]]
            },
            "node-memory": {
                "ai_memory": [[{ "node": "node-agent", "type": "ai_memory", "index": 0 }]]
            },
            "node-agent": {
                "main": [[{ "node": "node-respond", "type": "main", "index": 0 }]]
            }
        },
        settings: {
            executionOrder: "v1"
        }
    };

    try {
        console.log('--- Cleaning up old workflows ---');
        const workflows = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of workflows.data.data) {
            if (wf.name.includes("Lilymag Creative Studio")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
                console.log(`Deleted: ${wf.name}`);
            }
        }

        console.log('--- Deploying Structural Workflow ---');
        const response = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });
        console.log('SUCCESS: Workflow created with ID:', response.data.id);
        console.log('URL: https://primary-production-89e96.up.railway.app/workflow/' + response.data.id);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

deployFullWorkflow();
