import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

const user_gemini_key = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc';

async function setupUserKey() {
    try {
        console.log('--- [설정] 유저 제공 구글 API Key 탑재 시작 ---');

        // 1. 자격증명(Credential) 생성
        // n8n에서 Gemini API Key는 'googlePalmApi' 타입을 사용합니다.
        const credBody = {
            name: "Lilymag Gemini [User Key]",
            type: "googlePalmApi",
            data: {
                apiKey: user_gemini_key
            }
        };

        const credRes = await axios.post(`${n8n_url}/api/v1/credentials`, credBody, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });
        const newCredId = credRes.data.id;
        console.log(`✅ 자격증명 생성 완료 (ID: ${newCredId})`);

        // 2. 워크플로우 찾기
        const wfRes = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        // 가장 최근에 만든 구글 팩토리를 찾습니다.
        const targetWf = wfRes.data.data.find(w => w.name.includes("Lilymag Creative Studio [GOOGLE GEMINI PRO]"));

        if (!targetWf) {
            throw new Error("워크플로우를 찾을 수 없습니다. (이전 단계에서 생성된 WF 없음)");
        }

        // 3. 워크플로우 업데이트 (키 연결)
        const wfDetails = await axios.get(`${n8n_url}/api/v1/workflows/${targetWf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const updateWf = wfDetails.data;

        // Gemini 노드 찾아서 Credential 연결
        const geminiNode = updateWf.nodes.find(n => n.type.includes("googleGemini") || n.name.includes("Gemini"));
        if (geminiNode) {
            console.log(`타겟 노드 발견: ${geminiNode.name}`);
            geminiNode.credentials = {
                googlePalmApi: {
                    id: newCredId,
                    name: "Lilymag Gemini [User Key]"
                }
            };
        } else {
            throw new Error("Gemini 노드를 찾을 수 없습니다.");
        }

        await axios.put(`${n8n_url}/api/v1/workflows/${targetWf.id}`, {
            name: updateWf.name,
            nodes: updateWf.nodes,
            connections: updateWf.connections,
            settings: updateWf.settings
        }, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        console.log("✅ 워크플로우에 키 연결 완료");

        // 4. 활성화 (Active)
        // 이미 활성화되어 있을 수 있지만 확실하게 다시
        try {
            await axios.post(`${n8n_url}/api/v1/workflows/${targetWf.id}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            console.log("✅ 워크플로우 재가동 완료");
        } catch (e) {
            // 이미 활성화된 경우 에러가 날 수 있음
            console.log("ℹ️ 이미 활성화 상태입니다.");
        }

        console.log("🎉 [최종 완료] 구글 엔진 점화 성공!");
        console.log("이제 앱에서 버튼을 누르면 이 키로 작동합니다.");

    } catch (error) {
        console.error('FAILED:', error.response?.data?.message || error.message);
    }
}

setupUserKey();
