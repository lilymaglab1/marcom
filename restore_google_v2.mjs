import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function restoreGoogleFactoryV2() {
    try {
        console.log('--- [복구V2] Google Gemini (Safe Node) ---');

        const workflows = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        for (const wf of workflows.data.data) {
            if (wf.name.includes("Lilymag")) {
                await axios.delete(`${n8n_url}/api/v1/workflows/${wf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            }
        }

        const workflow = {
            name: "Lilymag Creative Studio [GOOGLE GEMINI PRO]",
            nodes: [
                {
                    parameters: { httpMethod: "POST", path: "lilymag-creative-studio", responseMode: "responseNode" },
                    name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 1, position: [-200, 300]
                },
                {
                    parameters: {
                        prompt: "={{ $json.body.topic }}에 대해 [{{ $json.body.agent }}]로서 릴리맥 브랜드의 우아하고 전문적인 마케팅 콘텐츠를 작성하시오. (한국어)"
                    },
                    name: "Gemini Agent", type: "@n8n/n8n-nodes-langchain.chainLlm", typeVersion: 1.4, position: [100, 300]
                },
                {
                    // This node type is definitely supported
                    parameters: { modelName: "models/gemini-1.5-pro", options: {} },
                    name: "Google Gemini Pro", type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini", typeVersion: 1, position: [100, 520]
                },
                // Image Placeholder (HTTP Request is safest)
                {
                    parameters: { url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent" },
                    name: "Google Imagen (Concept)", type: "n8n-nodes-base.httpRequest", typeVersion: 4, position: [400, 450]
                },
                {
                    parameters: {
                        respondWith: "allIncomingItems",
                        options: {
                            responseBody: "{\n  \"text\": \"{{ $json.text.replace(/\"/g, '\\\\\"').replace(/\\n/g, '\\\\n') }}\",\n  \"image_url\": \"\",\n  \"video_url\": \"\"\n}"
                        }
                    },
                    name: "Respond", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1, position: [800, 300]
                }
            ],
            connections: {
                "Webhook": { "main": [[{ "node": "Gemini Agent", "type": "main", "index": 0 }]] },
                "Google Gemini Pro": { "ai_languageModel": [[{ "node": "Gemini Agent", "type": "ai_languageModel", "index": 0 }]] },
                "Gemini Agent": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
            },
            settings: { executionOrder: "v1" }
        };

        const createRes = await axios.post(`${n8n_url}/api/v1/workflows`, workflow, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfId = createRes.data.id;

        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        console.log(`✅ [복구 완료] Gemini Pro 정상 노드 배포.`);
        console.log(`(ID: ${wfId})`);

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

restoreGoogleFactoryV2();
