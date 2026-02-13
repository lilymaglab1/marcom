import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc';

async function listModels() {
    try {
        const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        console.log('Available Models:', res.data.models.map(m => m.name));
    } catch (e) {
        console.error('ListModels ERROR:', e.response?.data || e.message);
    }
}

listModels();
