import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const wfId = 'x6xuQfLhFq1m0pwT'; // The one with Gemini Key

async function toggleActive() {
    try {
        console.log(`--- 🔄 워크플로우(${wfId}) 재활성화 (Webhook 링크 복구) ---`);

        // 1. 비활성화 (OFF)
        console.log('1. 비활성화 중...');
        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/deactivate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        // 2. 잠시 대기 (n8n 내부 처리 시간 확보)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. 재활성화 (ON) - 이때 Webhook 주소가 다시 등록됨
        console.log('2. 재활성화 중...');
        await axios.post(`${n8n_url}/api/v1/workflows/${wfId}/activate`, {}, { headers: { 'X-N8N-API-KEY': n8n_api_key } });

        console.log(`✅ [완료] Webhook 주소('lilymag-creative-studio')가 다시 살아났습니다.`);
        console.log(`이제 앱에서 버튼을 누르면 404가 뜨지 않아야 합니다.`);

    } catch (error) {
        console.error('FAILED:', error.response?.data?.message || error.message);
    }
}

toggleActive();
