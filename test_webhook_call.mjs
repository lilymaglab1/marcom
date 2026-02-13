import axios from 'axios';

async function testV29() {
    console.log('🧪 V29 Test: "해바라기, 심리학, 컬러학" 키워드 전송 중...');
    try {
        const res = await axios.post('http://localhost:5678/webhook/lilymag-studio-v4', {
            keyword: '해바라기, 심리학, 컬러학'
        }, { timeout: 120000 }); // 2분 타임아웃

        const data = res.data;
        console.log('\n📊 STATUS:', data.status);
        console.log('📝 BLOG TITLE:', data.blog?.title);
        console.log('📏 BLOG LENGTH:', data.blog?.content?.length, '자');
        console.log('🖼️ IMAGES COUNT:', data.images?.length);

        if (data.images?.length > 0) {
            data.images.forEach((img, i) => {
                console.log(`  Image ${img.id}: ${img.recommended_prompt?.substring(0, 60)}...`);
            });
        }

        console.log('\n🏷️ TAGS:', data.blog?.tags?.join(', '));
        console.log('📸 INSTAGRAM HASHTAGS:', data.instagram?.hashtags?.join(', '));
        console.log('\n✅ BLOG PREVIEW (첫 300자):\n', data.blog?.content?.substring(0, 300));
    } catch (e) {
        console.error('❌ FAILED:', e.response?.data || e.message);
    }
}
testV29();
