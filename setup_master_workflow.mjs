import axios from 'axios';

// Configuration
const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';
const GEMINI_API_KEY = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc';

const workflowJson = {
    "name": "Lilymag Marketing Master [V4] - ENHANCED",
    "nodes": [
        {
            "parameters": {
                "httpMethod": "POST",
                "path": "lilymag-studio-v4",
                "responseMode": "responseNode",
                "options": {}
            },
            "id": "webhook-trigger",
            "name": "Webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [400, 400]
        },
        {
            "parameters": {
                "method": "POST",
                "url": `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                "sendBody": true,
                "contentType": "json",
                "bodyParameters": {
                    "parameters": [
                        {
                            "name": "contents",
                            "value": "={{ [{\n  \"parts\": [{\n    \"text\": \"당신은 릴리맥(Lilymag)의 수석 마케팅 디렉터입니다. 다음 키워드에 대해 블로그, 인스타그램, 쇼츠 대본을 각각 생성하세요.\\n\\n[브랜드 컨텍스트]\\n- 30년 전통의 공간 플라워 큐레이션 전문\\n- 철학: 꽃이 아닌 공간의 품격을 완성\\n- 주요 가치: 공간 조화(Space-First), 실패 없는 안목(Proven Expertise)\\n\\n[키워드]\\n\" + ($json.body.keyword || $json.body.topic || \"계절 꽃\") + \"\\n\\n[출력 형식 - JSON]\\n{\\n  \\\"blog\\\": { \\\"title\\\": \\\"\\\", \\\"content\\\": \\\"\\\", \\\"tags\\\": [] },\\n  \\\"instagram\\\": { \\\"caption\\\": \\\"\\\", \\\"hashtags\\\": [] },\\n  \\\"shorts\\\": { \\\"script\\\": \\\"\\\", \\\"overlay_text\\\": \\\"\\\" },\\n  \\\"image_prompt\\\": \\\"High-end flower arrangement in a luxury interior, realistic, 8k, professional photography\\\",\\n  \\\"status\\\": \\\"ready_for_approval\\\"\\n}\\n\\n주의: 모든 텍스트는 릴리맥 특유의 우아하고 전문적인 어조를 유지하세요. 응답은 오직 순수 JSON만 출력하세요.\"\n  }]\n}] }}"
                        }
                    ]
                },
                "options": {}
            },
            "id": "gemini-generator",
            "name": "Gemini AI Content Generator",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.1,
            "position": [620, 400]
        },
        {
            "parameters": {
                "respondWith": "json",
                "responseBody": "={{ \n  const content = JSON.parse($json.candidates[0].content.parts[0].text.replace(/```json|```/g, ''));\n  const keyword = $node[\"Webhook\"].json.body.keyword || \"flowers\";\n  content.image_url = `https://source.unsplash.com/featured/?flower,${encodeURIComponent(keyword)}`;\n  content.video_url = \"https://www.w3schools.com/html/mov_bbb.mp4\"; // Placeholder\n  return content;\n}}",
                "options": {}
            },
            "id": "respond-node",
            "name": "Respond to App",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [840, 400]
        }
    ],
    "connections": {
        "Webhook": {
            "main": [
                [
                    {
                        "node": "Gemini AI Content Generator",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Gemini AI Content Generator": {
            "main": [
                [
                    {
                        "node": "Respond to App",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        }
    },
    "settings": {
        "executionOrder": "v1"
    }
};

async function deployMasterWorkflow() {
    console.log('🚀 Updating Master Workflow with image/video support...');

    try {
        // Find existing workflow to update or create new
        const listRes = await axios.get(`${N8N_URL}/api/v1/workflows`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        const existing = listRes.data.data.find(w => w.name.includes("Lilymag Marketing Master"));

        if (existing) {
            await axios.put(`${N8N_URL}/api/v1/workflows/${existing.id}`, workflowJson, {
                headers: { 'X-N8N-API-KEY': N8N_API_KEY }
            });
            console.log(`✅ Master Workflow Updated! ID: ${existing.id}`);
            await axios.post(`${N8N_URL}/api/v1/workflows/${existing.id}/activate`, {}, {
                headers: { 'X-N8N-API-KEY': N8N_API_KEY }
            });
        } else {
            const createRes = await axios.post(`${N8N_URL}/api/v1/workflows`, workflowJson, {
                headers: { 'X-N8N-API-KEY': N8N_API_KEY }
            });
            console.log(`✅ Master Workflow Created! ID: ${createRes.data.id}`);
            await axios.post(`${N8N_URL}/api/v1/workflows/${createRes.data.id}/activate`, {}, {
                headers: { 'X-N8N-API-KEY': N8N_API_KEY }
            });
        }

    } catch (error) {
        if (error.response) {
            console.error('FAILED:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('ERROR:', error.message);
        }
    }
}

deployMasterWorkflow();
