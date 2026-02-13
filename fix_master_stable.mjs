import axios from 'axios';

const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';
const GEMINI_API_KEY = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc';
const WORKFLOW_ID = 'xGoI8eWhSA2HVS6R';
const MODERN_MODEL = 'gemini-2.5-flash-preview-09-2025';

const workflowJson = {
    "name": "Lilymag Universal Storyteller [V30]",
    "nodes": [
        {
            "parameters": { "httpMethod": "POST", "path": "lilymag-studio-v4", "responseMode": "lastNode" },
            "id": "w1", "name": "Webhook", "type": "n8n-nodes-base.webhook", "typeVersion": 1, "position": [100, 100], "webhookId": "7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f7f"
        },
        {
            "parameters": {
                "jsCode": "const input = $json.body.keyword || \"꽃\";\nreturn [{\n  json: {\n    contents: [{\n      parts: [{\n        text: `당신은 릴리맥(Lilymag)의 유니버설 크리에이티브 디렉터입니다. 릴리맥은 LILYMAG 으로 표기합니다 (Lillymac, Lillimac, LILIMAC 절대 아님).\\n\\n키워드 [${input}]를 활용해 다학제적 매거진 기사를 작성하세요.\\n\\n[필수 포함 - 3개 이상 융합]\\n- 미술/영화/음악: 명화, 영화 장면, 클래식/가요 등 문화예술 연결\\n- 심리학/인간관계: 꽃이 주는 심리적 치유, 관계의 따뜻함\\n- 컬러학/인테리어: 색채 심리, 공간 연출법\\n- 환경/ESG: 지속가능성, 자연 보호\\n- 마케팅/트렌드: 소비 트렌드, 라이프스타일 변화\\n- 추억/에피소드: 고객 이야기, 감성적 체험담\\n\\n[규칙]\\n- 분량: 2,500~3,500자\\n- 이미지 지문: 본문 중간에 [이미지 삽입 1] ~ [이미지 삽입 5] 배치\\n- 어투: 전문 에세이스트의 따뜻한 산문체\\n- 브랜드: 릴리맥(Lilymag) 정확히 표기\\n\\n[출력 - JSON만 출력. 앞뒤 설명 절대 금지]\\n{\\n  \"blog\": { \"title\": \"\", \"content\": \"\", \"tags\": [] },\\n  \"instagram\": { \"caption\": \"\", \"hashtags\": [] },\\n  \"shorts\": { \"script\": \"\", \"overlay_text\": \"\" },\\n  \"image_suggestions\": [\\n    { \"id\": 1, \"recommended_prompt\": \"\" },\\n    { \"id\": 2, \"recommended_prompt\": \"\" },\\n    { \"id\": 3, \"recommended_prompt\": \"\" },\\n    { \"id\": 4, \"recommended_prompt\": \"\" },\\n    { \"id\": 5, \"recommended_prompt\": \"\" }\\n  ]\\n}`\n      }]\n    }]\n  }\n}];"
            },
            "id": "p1", "name": "Universal Persona", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [300, 100]
        },
        {
            "parameters": {
                "method": "POST",
                "url": `https://generativelanguage.googleapis.com/v1beta/models/${MODERN_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
                "sendBody": true,
                "specifyBody": "json",
                "jsonBody": "={{ $json }}",
                "options": { "timeout": 120000 }
            },
            "id": "g1", "name": "Gemini-Universal", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.1, "position": [500, 100]
        },
        {
            "parameters": {
                "jsCode": "try {\n  const res = $node[\"Gemini-Universal\"].json;\n  const raw = res.candidates[0].content.parts[0].text;\n  const firstBrace = raw.indexOf('{');\n  const lastBrace = raw.lastIndexOf('}');\n  if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON found in response');\n  const clean = raw.substring(firstBrace, lastBrace + 1);\n  const parsed = JSON.parse(clean);\n  \n  const images = (parsed.image_suggestions || []).map((s, idx) => ({\n    ...s,\n    url: `https://plus.unsplash.com/premium_photo-${1670000000000 + (idx * 98765)}?auto=format&fit=crop&q=80&w=800`\n  }));\n\n  return [{ json: { ...parsed, images, status: 'success_v30' } }];\n} catch (e) {\n  return [{ json: { blog: { title: '처리 오류', content: '다시 시도해 주세요. 상세: ' + e.message, tags: [] }, instagram: { caption: '', hashtags: [] }, shorts: { script: '', overlay_text: '' }, images: [], status: 'error' } }];\n}"
            },
            "id": "c1", "name": "Universal Processor", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [700, 100]
        }
    ],
    "connections": {
        "Webhook": { "main": [[{ "node": "Universal Persona", "type": "main", "index": 0 }]] },
        "Universal Persona": { "main": [[{ "node": "Gemini-Universal", "type": "main", "index": 0 }]] },
        "Gemini-Universal": { "main": [[{ "node": "Universal Processor", "type": "main", "index": 0 }]] }
    },
    "settings": { "executionOrder": "v1" }
};

async function deployV30() {
    try {
        await axios.put(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}`, workflowJson, { headers: { 'X-N8N-API-KEY': N8N_API_KEY } });
        await axios.post(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}/activate`, {}, { headers: { 'X-N8N-API-KEY': N8N_API_KEY } });
        console.log('✅ V30 LILYMAG Branding Fixed & Deployed!');
    } catch (e) { console.error(e.response?.data || e.message); }
}
deployV30();
