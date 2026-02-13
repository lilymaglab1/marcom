import axios from 'axios';

async function diagnoseWebhook() {
    try {
        console.log('--- 🔍 Webhook 정밀 진단 시작 ---');
        // 실제 n8n Webhook 주소
        const url = 'https://primary-production-89e96.up.railway.app/webhook/lilymag-creative-studio';

        // 실제 앱이 보내는 것과 동일한 데이터
        const payload = {
            topic: "Hello Test",
            agent: "Tester"
        };

        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true // 에러가 나도 catch로 빠지지 않게
        });

        console.log(`응답 코드: ${response.status}`);
        if (response.status === 200) {
            console.log('✅ 성공! (어라? 성공했는데요?)');
            console.log('응답 데이터:', JSON.stringify(response.data, null, 2));
        } else {
            console.log('❌ 실패 에러 메시지 (서버 로그):');
            // n8n이 보통 에러 메시지를 JSON으로 줍니다.
            console.log(JSON.stringify(response.data, null, 2));

            if (response.data.message) {
                console.log('👉 핵심 원인:', response.data.message);
            }
        }

    } catch (error) {
        console.error('진단 스크립트 자체 에러:', error.message);
    }
}

diagnoseWebhook();
