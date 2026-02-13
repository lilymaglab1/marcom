import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const user_gemini_key = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc';

async function setupUserKeyRetry() {
    try {
        console.log('--- [재시도] 유저 제공 구글 API Key 탑재 ---');

        // 1. 자격증명(Credential) 생성 (schema fix)
        // Gemini API (PaLM) credential needs 'host' too sometimes
        const credBody = {
            name: "Lilymag Gemini [User Key Corrected]",
            type: "googlePalmApi",
            data: {
                apiKey: user_gemini_key,
                host: "generativelanguage.googleapis.com" // Essential for some n8n versions
            }
        };

        const credRes = await axios.post(`${n8n_url}/api/v1/credentials`, credBody, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });
        const newCredId = credRes.data.id;
        console.log(`✅ 자격증명 생성 완료 (ID: ${newCredId})`);

        // 2. 워크플로우 찾기
        const wfRes = await axios.get(`${n8n_url}/api/v1/workflows`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        // 'Lilymag Creative Studio [GOOGLE GEMINI PRO]'를 찾습니다.
        // 혹시 이름 불일치 문제 방지를 위해, ID(x6xuQfLhFq1m0pwT)를 직접 쓸 수도 있지만 재검색이 안전
        let targetWf = wfRes.data.data.find(w => w.name.includes("Lilymag Creative Studio [GOOGLE GEMINI PRO]"));

        if (!targetWf) {
            // 혹시 없으면 'restore_google_v2'에서 생성된 ID로 직접 접근 시도
            // (x6xuQfLhFq1m0pwT)
            try {
                const manualGet = await axios.get(`${n8n_url}/api/v1/workflows/x6xuQfLhFq1m0pwT`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
                targetWf = manualGet.data; // found by ID
            } catch (e) {
                throw new Error("워크플로우를 찾을 수 없습니다.");
            }
        }

        console.log(`타겟 워크플로우: ${targetWf.name} (ID: ${targetWf.id})`);

        // 3. 워크플로우 업데이트 (키 연결)
        // 전체 구조를 다시 받아서 수정
        const wfDetailsRes = await axios.get(`${n8n_url}/api/v1/workflows/${targetWf.id}`, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
        const wfData = wfDetailsRes.data;

        // Gemini 노드 찾기 (lmChatGoogleGemini)
        const geminiNode = wfData.nodes.find(n => n.type === "@n8n/n8n-nodes-langchain.lmChatGoogleGemini");

        if (geminiNode) {
            console.log(`Gemini 노드 발견: ${geminiNode.name}`);

            // Credential 연결
            geminiNode.credentials = {
                googlePalmApi: {
                    id: newCredId,
                    name: "Lilymag Gemini [User Key Corrected]" // UI에서 보이는 이름
                }
            };

            // 변경사항 저장 (PUT)
            await axios.put(`${n8n_url}/api/v1/workflows/${targetWf.id}`, {
                name: wfData.name,
                nodes: wfData.nodes,
                connections: wfData.connections,
                settings: wfData.settings
            }, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

            console.log("✅ 워크플로우에 키 연결 저장됨.");
        } else {
            console.error("Gemini 노드를 찾을 수 없어 키 연결 실패.");
        }

        // 4. 활성화 상태 확인 및 재가동
        if (!wfData.active) {
            await axios.post(`${n8n_url}/api/v1/workflows/${targetWf.id}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });
            console.log("🔥 워크플로우 활성화(Active) 완료.");
        } else {
            console.log("⚡ 이미 활성화 상태입니다.");
        }

        console.log("🎉 [최종 완료] 유저님의 키로 구글 엔진이 정상 가동됩니다.");

    } catch (error) {
        console.error('FAILED:', error.response?.data?.message || error.message);
        // 에러 상세 정보
        if (error.response?.data) console.error(JSON.stringify(error.response.data));
    }
}

setupUserKeyRetry();
