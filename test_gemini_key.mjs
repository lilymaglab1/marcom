import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc';

async function testGemini() {
    try {
        const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: 'hi' }] }]
        });
        console.log('Gemini OK:', res.data.candidates[0].content.parts[0].text);
    } catch (e) {
        console.error('Gemini ERROR:', e.response?.data || e.message);
    }
}

testGemini();
