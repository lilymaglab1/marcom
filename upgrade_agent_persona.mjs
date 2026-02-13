import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const wf_id = 'SUd6bHQ6AJWYfbZh';

async function upgradeWorkflowEngine() {
    try {
        console.log('--- Step 1: Fetching current state ---');
        const res = await axios.get(`${n8n_url}/api/v1/workflows/${wf_id}`, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });
        const wf = res.data;

        // Step 2: Update AI Agent with System Instruction
        const agentNode = wf.nodes.find(n => n.name === 'AI Agent');
        if (agentNode) {
            agentNode.parameters.promptType = 'define';
            agentNode.parameters.text = "당신은 릴리맥의 수석 크리에이티브 디렉터 '고다리 부장'입니다.\n\n" +
                "입력받은 [주제]에 대해 [에이전트 타입]의 성격에 맞춰 최고의 마케팅 콘텐츠를 작성하세요.\n" +
                "- 주제: {{ $json.body.topic }}\n" +
                "- 에이전트 타입: {{ $json.body.agent }}\n\n" +
                "### 브랜드 가이드라인:\n" +
                "1. 릴리맥은 30년 역사의 프리미엄 디자인 브랜드입니다.\n" +
                "2. 어조는 우아하고 인문학적이며, 전문 지식이 돋보여야 합니다.\n" +
                "3. 단순히 정보를 나열하지 말고, 독자의 감성을 자극하는 스토리텔링을 가미하세요.";

            // For n8n 1.0+ agents, agent specific settings
            agentNode.parameters.options = {
                systemMessage: "당신은 릴리맥의 수석 디렉터 고다리입니다. 우아하고 인문학적인 어조를 사용하여 프리미엄 마케팅 콘텐츠를 생성합니다."
            };
        }

        // Step 3: Precise Connection Reinforcement
        wf.connections = {
            "node-webhook": { "main": [[{ "node": "node-agent", "type": "main", "index": 0 }]] },
            "node-gemini": { "ai_languageModel": [[{ "node": "node-agent", "type": "ai_languageModel", "index": 0 }]] },
            "node-memory": { "ai_memory": [[{ "node": "node-agent", "type": "ai_memory", "index": 0 }]] },
            "node-agent": { "main": [[{ "node": "node-respond", "type": "main", "index": 0 }]] }
        };

        console.log('--- Step 4: Pushing Expert Configuration ---');
        await axios.put(`${n8n_url}/api/v1/workflows/${wf_id}`, {
            name: "Lilymag Creative Studio [Expert Engine]",
            nodes: wf.nodes,
            connections: wf.connections,
            settings: wf.settings
        }, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });

        console.log('SUCCESS: 고다리 부장 페르소나 주입 및 선 연결 완료.');
    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

upgradeWorkflowEngine();
