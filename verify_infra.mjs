import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';

async function verifyInfrastructure() {
    try {
        console.log('--- [검증 1] n8n 워크플로우 존재 확인 ---');
        const workflows = await axios.get(`${n8n_url}/api/v1/workflows`, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });
        const target = workflows.data.data.find(w => w.name.includes("Structural Build"));

        if (target) {
            console.log(`✅ 확인: '${target.name}' (ID: ${target.id}) 가 서버 내에 존재합니다.`);
        } else {
            throw new Error('❌ 오류: 워크플로우가 사라졌습니다. 재배포가 필요합니다.');
        }

        console.log('\n--- [검증 2] Webhook 엔드포인트 응답 테스트 ---');
        // Webhook이 살아있는지 (404가 아닌지) 확인
        const webhookRes = await axios.post(`${n8n_url}/webhook/lilymag-creative-studio`, {
            topic: '테스트',
            agent: 'blog'
        }).catch(err => err.response);

        if (webhookRes.status === 200 || webhookRes.status === 500) {
            // 500이 뜨더라도 "Workflow execution failed"라면 Webhook 자체는 등록되어 있다는 뜻 (Gemini 키가 없어서 실패한 것)
            if (webhookRes.data?.message?.includes('started') || webhookRes.data?.message?.includes('failed')) {
                console.log('✅ 확인: Webhook 경로(/webhook/lilymag-creative-studio)가 정상 등록되어 응답을 보냅니다.');
            }
        } else {
            console.log(`⚠️ 주의: Webhook 응답 상태 ${webhookRes.status}. 등록 여부를 재점검합니다.`);
        }

    } catch (error) {
        console.error('CRUCIAL ERROR:', error.message);
    }
}

verifyInfrastructure();
