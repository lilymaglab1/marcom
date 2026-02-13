import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const wf_id = 'SUd6bHQ6AJWYfbZh';

async function deployGoogleUltimateFactory() {
    try {
        console.log('--- 🏗️ 구글 기반 궁극의 멀티미디어 공장 건설 시작 ---');

        const workflow = {
            name: "Lilymag Google Ultimate Creative Factory [v5]",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    id: "webhook", name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [-200, 300]
                },
                // 1. Google Vertex AI - 메인 에이전트
                {
                    parameters: {
                        options: {
                            systemMessage: "당신은 릴리맥의 총괄 디렉터입니다. 구글 최신 모델(Gemini, Imagen, Veo)을 지휘하여 최고의 텍스트, 이미지 프롬프트, 영상 시나리오를 동시에 생성합니다."
                        }
                    },
                    id: "agent", name: "Google Creative Director", type: "@n8n/n8n-nodes-langchain.agent", typeVersion: 1.6, position: [100, 300]
                },
                {
                    parameters: { modelName: "gemini-1.5-pro", options: {} },
                    id: "vertex-llm", name: "Google Vertex AI (Gemini)", type: "@n8n/n8n-nodes-langchain.lmChatGoogleVertexAi", typeVersion: 1, position: [20, 520]
                },
                {
                    parameters: {},
                    id: "memory", name: "Google Cloud Memory", type: "@n8n/n8n-nodes-langchain.memoryWindowBuffer", typeVersion: 1, position: [180, 520]
                },

                // 2. Google Vertex AI - Imagen 3 (Image Generation)
                {
                    parameters: {
                        resource: "image",
                        operation: "generate",
                        prompt: "={{ $node['Google Creative Director'].json.image_prompt }}",
                        model: "imagen-3"
                    },
                    id: "google-imagen", name: "Google Imagen 3", type: "n8n-nodes-base.googleCloudVertexAi", typeVersion: 1, position: [400, 450]
                },

                // 3. Google Vertex AI - Veo (Video Generation via HTTP)
                {
                    parameters: {
                        url: "https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT/locations/us-central1/publishers/google/models/veo:predict",
                        method: "POST",
                        authentication: "predefinedCredentialType",
                        nodeCredentialType: "googleCloudVertexAiApi",
                        sendBody: true,
                        bodyParameters: { parameters: [{ name: "prompt", value: "={{ $node['Google Creative Director'].json.video_prompt }}" }] }
                    },
                    id: "google-veo", name: "Google Veo (Video Gen)", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [400, 150]
                },

                // 4. Grok (Backup/Extra Logic)
                {
                    parameters: {
                        model: "grok-1",
                        prompt: "={{ $node['Google Creative Director'].json.output }}"
                    },
                    id: "xai-grok", name: "xAI Grok (Reviewer)", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [650, 300]
                },

                {
                    parameters: {
                        respondWith: "allIncomingItems",
                        options: {
                            responseBody: "{\n  \"text\": \"{{ $node['Google Creative Director'].json.output }}\",\n  \"image_url\": \"{{ $node['Google Imagen 3'].json.url }}\",\n  \"video_url\": \"{{ $node['Google Veo (Video Gen)'].json.url }}\",\n  \"grok_note\": \"{{ $node['xAI Grok (Reviewer)'].json.content }}\"\n}"
                        }
                    },
                    id: "respond", name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [900, 300]
                }
            ],
            connections: {
                "webhook": { "main": [[{ "node": "agent", "type": "main", "index": 0 }]] },
                "vertex-llm": { "ai_languageModel": [[{ "node": "agent", "type": "ai_languageModel", "index": 0 }]] },
                "memory": { "ai_memory": [[{ "node": "agent", "type": "ai_memory", "index": 0 }]] },
                "agent": {
                    "main": [
                        [{ "node": "google-veo", "type": "main", "index": 0 }],
                        [{ "node": "google-imagen", "type": "main", "index": 0 }]
                    ]
                },
                "google-veo": { "main": [[{ "node": "xai-grok", "type": "main", "index": 0 }]] },
                "google-imagen": { "main": [[{ "node": "xai-grok", "type": "main", "index": 0 }]] },
                "xai-grok": { "main": [[{ "node": "respond", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        console.log('--- 🚀 최신 구글 모델 기반 아키텍처 배포 중 ---');
        await axios.put(`${n8n_url}/api/v1/workflows/${wf_id}`, workflow, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });

        console.log('✅ 전 공정 구글화 완료: Gemini Pro, Imagen 3, Veo 라인 구축 성공.');
    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

deployGoogleUltimateFactory();
