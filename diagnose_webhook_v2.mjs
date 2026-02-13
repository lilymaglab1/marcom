import axios from 'axios';

async function diagnoseWebhookV2() {
    try {
        console.log('--- 🔍 Webhook V2 정밀 진단 시작 ---');
        // NEW URL
        const url = 'https://primary-production-89e96.up.railway.app/webhook/lilymag-studio-v2';

        const payload = {
            body: {
                topic: "Hello Test V2",
                agent: "Tester"
            }
        };

        console.log(`Target URL: ${url}`);

        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true
        });

        console.log(`응답 코드: ${response.status}`);
        if (response.status === 200) {
            console.log('✅ 성공! API 호출 성공');
            console.log('응답 데이터:', JSON.stringify(response.data, null, 2));
        } else {
            console.log('❌ 실패 에러 메시지:');
            console.log(JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error('진단 스크립트 에러:', error.message);
    }
}

diagnoseWebhookV2();
