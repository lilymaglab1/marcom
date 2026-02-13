import axios from 'axios';

async function diagnoseWebhookDual() {
    try {
        console.log('--- 🔍 Webhook 정문/뒷문 동시 진단 ---');

        const path = 'lilymag-studio-v2';
        const prodUrl = `https://primary-production-89e96.up.railway.app/webhook/${path}`;
        const testUrl = `https://primary-production-89e96.up.railway.app/webhook-test/${path}`;

        const payload = { body: { topic: "Door Check", agent: "Tester" } };

        console.log(`\n🚪 [1] 정문 (Production) 확인: ${prodUrl}`);
        try {
            const resProd = await axios.post(prodUrl, payload, { validateStatus: () => true });
            console.log(`   👉 응답: ${resProd.status} ${resProd.statusText}`);
            if (resProd.status === 404) console.log(`   ❌ 닫힘 (Not Registered)`);
            else if (resProd.status === 200) console.log(`   ✅ 열림!`);
        } catch (e) {
            console.log(`   ❌ 접속 불가: ${e.message}`);
        }

        console.log(`\n🚪 [2] 뒷문 (Test Mode) 확인: ${testUrl}`);
        try {
            // Test URL requires the UI to be waiting for execution, OR basic authentication often
            // But let's see if we get a 404 (Not Registered) or a different error.
            const resTest = await axios.post(testUrl, payload, { validateStatus: () => true });
            console.log(`   👉 응답: ${resTest.status} ${resTest.statusText}`);

            // 404 means "No such workflow exists even in test mode"
            if (resTest.status === 404) {
                console.log(`   ❌ 뒷문도 닫힘 (워크플로우 자체가 메모리에 없음)`);
            } else {
                console.log(`   ✅ 뒷문 반응 있음 (로직은 존재함)`);
            }
        } catch (e) {
            console.log(`   ⚠️ 뒷문 에러: ${e.message}`);
        }

    } catch (error) {
        console.error('진단 스크립트 에러:', error.message);
    }
}

diagnoseWebhookDual();
