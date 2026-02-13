import axios from 'axios';
import fs from 'fs';

const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';
const WORKFLOW_ID = 'xGoI8eWhSA2HVS6R';

async function checkWorkflow() {
    try {
        const res = await axios.get(`${N8N_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        fs.writeFileSync('v2_debug.json', JSON.stringify(res.data, null, 2));
        console.log('Saved workflow to v2_debug.json');
    } catch (e) {
        console.error(e.message);
    }
}

checkWorkflow();
