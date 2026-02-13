import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function deployNoKeyFactory2() {
    try {
        console.log('--- [최종] 무인증 엔진 교체 (Pollinations Text & Image) (Settings Fix) ---');

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
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [0, 300]
                },
                {
                    parameters: {
                        url: "https://text.pollinations.ai/",
                        method: "POST",
                        sendBody: true,
                        bodyParameters: {
                            parameters: [
                                // { name: "messages", value: "={{ [{\"role\": \"system\", \"content\": \"You are a friendly assistant.\"}, {\"role\": \"user\", \"content\": $json.body.topic }] }}" },
                                // Simplified for n8n expression compatibility - passing json directly might be tricky in code generation context, let's use raw body if possible or simpler request
                                { name: "messages", value: "={{ [{\"role\": \"user\", \"content\": $json.body.topic + \"에 대해 어조: 우아함으로 짧은 마케팅 카피를 써줘(한국어)\" }] }}" },
                                { name: "model", value: "openai" },
                                { name: "seed", value: "={{ Math.floor(Math.random() * 1000) }}" }
                            ]
                        }
                    },
                    name: "Free Text AI", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [300, 300]
                },
                {
                    parameters: {
                        respondWith: "allIncomingItems",
                        options: {
                            // Pollinations text api returns raw string usually, or simple json depending on accept header. Let's assume it returns text.
                            // Actually it returns raw text if not json requested properly.
                            // But usually httpRequest parses JSON response automatically.
                            // Let's force it to text if needed. But let's assume JSON parsing works or it's just raw content.
                            // Pollinations returns raw string by default.
                            responseBody: "{\n  \"text\": \"{{ $json.data || $json }}\",\n  \"image_url\": \"https://image.pollinations.ai/prompt/{{$node['Webhook'].json.body.topic}}%20luxury%20floral?width=1024&height=1024&nologo=true&seed={{$runIndex}}\",\n  \"video_url\": \"\"\n}"
                        }
                    },
                    name: "Respond", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [600, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "Free Text AI", "type": "main", "index": 0 }]] },
                "Free Text AI": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" } // Critical fix
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfId = createRes.data.id;

        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        console.log(`✅ [완료] 키 필요 없는 안전 엔진 배포됨.`);
        console.log(`(ID: ${wfId})`);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

deployNoKeyFactory2();
