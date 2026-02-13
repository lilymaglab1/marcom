import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function deployNoKeyFactory() {
    try {
        console.log('--- [긴급] 무인증 엔진 교체 (Pollinations Text & Image) ---');

        // 1. 기존 삭제
        const workflows = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of workflows.data.data) {
            if (wf.name.includes("Lilymag")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            }
        }

        // 2. Pollinations Text + Image (No API Key Required)
        const workflow = {
            name: "Lilymag Creative Studio [NO-KEY]",
            nodes: [
                // [1] Webhook
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [0, 300]
                },
                // [2] Text Gen (Pollinations Text API - GPT-4o Compatible, Free)
                {
                    parameters: {
                        url: "https://text.pollinations.ai/",
                        method: "POST",
                        sendBody: true,
                        bodyParameters: {
                            parameters: [
                                { name: "messages", value: "={{ [{\"role\": \"system\", \"content\": \"You are a luxury brand marketer for Lilymag. Write elegant, short Korean marketing copy about the user's topic.\"}, {\"role\": \"user\", \"content\": $json.body.topic }] }}" },
                                { name: "model", value: "openai" }, // default
                                { name: "seed", value: "={{ Math.floor(Math.random() * 1000) }}" }
                            ]
                        }
                    },
                    name: "Free Text AI", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [300, 300]
                },
                // [3] Image Gen (Pollinations Image API - Free)
                // This logic is embedded in Response, but let's make it explicit or keep it simple
                // We will construct the image URL in the response directly as it's GET based.

                // [4] Output
                {
                    parameters: {
                        respondWith: "allIncomingItems",
                        options: {
                            responseBody: "{\n  \"text\": \"{{ $json.content || $json.choices[0].message.content || '생성 실패' }}\",\n  \"image_url\": \"https://image.pollinations.ai/prompt/{{$node['Webhook'].json.body.topic}}%20luxury%20floral%20design?width=1024&height=1024&nologo=true&seed={{$runIndex}}\",\n  \"video_url\": \"\"\n}"
                        }
                    },
                    name: "Respond", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [600, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "Free Text AI", "type": "main", "index": 0 }]] },
                "Free Text AI": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
            }
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfId = createRes.data.id;

        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        console.log(`✅ [완료] 키가 필요 없는 완전 자동화 엔진 배포됨.`);
        console.log(`(ID: ${wfId})`);
        console.log(`이제 앱에서 500 에러 없이 즉시 결과가 나올 것입니다.`);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

deployNoKeyFactory();
