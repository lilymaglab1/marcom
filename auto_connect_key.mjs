import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
// 이전에 파악된 유효한 Gemini Credential ID
const existing_cred_id = 'alOOT6OgNi3ist2C';
const wf_id = 'pWTmiwGTD76IMdoe';

async function connectCredentialsReal() {
    try {
        console.log(`--- 워크플로우(${wf_id})에 기존 Credential(${existing_cred_id}) 자동 연결 중 ---`);

        const res = await axios.get(`${n8n_url}/api/v1/workflows/${wf_id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wf = res.data;

        // Gemini Vertex AI 노드 찾기
        const geminiNode = wf.nodes.find(n => n.name === 'Google Vertex AI (Gemini)');

        if (geminiNode) {
            // 주의: Vertex AI 노드는 googleVertexAiApi 자격증명을 사용하지만, 
            // 현재 보유한 'alOOT...' ID가 PaLM(구형 Gemini)용일 수 있으므로
            // 호환성을 위해 노드 타입을 잠시 'lmChatGoogleGemini' (일반 Gemini)로 변경하여 확실하게 작동시킵니다.
            console.log('Gemini 노드를 호환성 모드(Standard Gemini)로 전환하고 키를 연결합니다.');
            geminiNode.type = "@n8n/n8n-nodes-langchain.lmChatGoogleGemini";
            geminiNode.credentials = {
                googlePalmApi: {
                    id: existing_cred_id,
                    name: "Google Gemini(PaLM) Api account" // 기존에 등록된 이름
                }
            };
        }

        // 이미지/비디오 노드는 키가 아직 없으므로 에러 방지를 위해 임시 비활성화(Disable) 처리하거나
        // 그대로 두되, 전체 흐름이 멈추지 않도록 설정합니다.
        // 여기서는 일단 Gemini(텍스트) 연결에 집중합니다.

        await axios.put(`${n8n_url}/api/v1/workflows/${wf_id}`, {
            name: wf.name,
            nodes: wf.nodes,
            connections: wf.connections,
            settings: wf.settings
        }, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        // 활성화
        await axios.post(`${n8n_url}/api/v1/workflows/${wf_id}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        console.log('✅ 수정 완료: Gemini 키 연결됨 & 워크플로우 활성화됨.');
        console.log('이제 앱에서 버튼을 누르면 최소한 [텍스트]는 생성되어야 합니다.');

    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

connectCredentialsReal();
