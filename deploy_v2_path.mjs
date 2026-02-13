import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const user_gemini_key = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc';

async function deployNewPath() {
    try {
        console.log('--- [v2] Webhook 경로 변경 및 재배포 (404 회피) ---');

        // 1. 기존 워크플로우 정리
        const check = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of check.data.data) {
            if (wf.name.includes("Lilymag")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            }
        }

        // 2. New Workflow Definition with NEW PATH
        const workflow = {
            name: "Lilymag Creative Studio [v2]",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "lilymag-studio-v2", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [-200, 300]
                },
                {
                    // Direct API Call with User Key (Flash Model)
                    parameters: {
                        method: "POST",
                        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${user_gemini_key}`,
                        sendBody: true,
                        contentType: "json",
                        bodyParameters: {
                            parameters: [
                                {
                                    name: "contents",
                                    value: "={{ [{'parts': [{'text': $json.body.topic + '에 대해 [에이전트: ' + $json.body.agent + '] 성격으로 릴리맥 브랜드의 우아한 마케팅 카피를 작성해줘(한국어)'}]}] }}"
                                }
                            ]
                        }
                    },
                    name: "Gemini Direct API", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [100, 300]
                },
                {
                    parameters: {
                        respondWith: "allIncomingItems",
                        options: {
                            // Safe parsing
                            responseBody: "{\n  \"text\": \"{{ $json.candidates ? $json.candidates[0].content.parts[0].text.replace(/\"/g, '\\\\\"').replace(/\\n/g, '\\\\n') : 'API 호출 실패 (키 확인 필요)' }}\",\n  \"image_url\": \"\",\n  \"video_url\": \"\"\n}"
                        }
                    },
                    name: "Respond", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [400, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "Gemini Direct API", "type": "main", "index": 0 }]] },
                "Gemini Direct API": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfId = createRes.data.id;

        // 3. Force Activate
        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        console.log(`🔥 [활성화 완료] 새 주소: lilymag-studio-v2`);

    } catch (error) {
        console.error('FAILED:', error.response?.data?.message || error.message);
    }
}

deployNewPath();
