import axios from 'axios';

const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';
const KEEP_ID = 'xGoI8eWhSA2HVS6R';

async function cleanup() {
    try {
        const res = await axios.get(`${N8N_URL}/api/v1/workflows`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        for (const wf of res.data.data) {
            if (wf.id !== KEEP_ID && wf.id !== 'XPqsEYJz2kf0MvXa') {
                console.log(`Deleting duplicate workflow: ${wf.id} (${wf.name})`);
                await axios.delete(`${N8N_URL}/api/v1/workflows/${wf.id}`, {
                    headers: { 'X-N8N-API-KEY': N8N_API_KEY }
                });
            }
        }
        console.log('Cleanup finished.');
    } catch (e) {
        console.error(e.message);
    }
}

cleanup();
