import axios from 'axios';

const n8n_url = 'https://primary-production-89e96.up.railway.app';
const n8n_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWY1NGRjMi0yNDU0LTRmZDgtOWRmNy1lM2YwZmY1MzY2MmYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZGM5NzZmZTEtOWNiYi00YWFhLTkzZjAtMGYxYTI2YzU2NDFkIiwiaWF0IjoxNzcwOTU4NjEzfQ.HYAr5wrdoOHor8vuRIbZevorrMo_B4-lQ0ICQ9Ri6z4';
const wf_id = 'SUd6bHQ6AJWYfbZh';

async function reconnectWorkflow() {
    try {
        console.log('--- Fetching Workflow to Analyze Ports ---');
        const res = await axios.get(`${n8n_url}/api/v1/workflows/${wf_id}`, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });
        const wf = res.data;

        // Force connections based on EXACT names from n8n 1.x spec
        wf.connections = {
            "Webhook": {
                "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
            },
            "Google Gemini Chat Model": {
                "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
            },
            "Window Buffer Memory": {
                "ai_memory": [[{ "node": "AI Agent", "type": "ai_memory", "index": 0 }]]
            },
            "AI Agent": {
                "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]]
            }
        };

        // Ensure IDs match for connections
        wf.nodes.forEach(node => {
            if (node.name === 'Webhook') node.id = 'node-webhook';
            if (node.name === 'AI Agent') node.id = 'node-agent';
            if (node.name === 'Google Gemini Chat Model') node.id = 'node-gemini';
            if (node.name === 'Window Buffer Memory') node.id = 'node-memory';
            if (node.name === 'Respond to Webhook') node.id = 'node-respond';
        });

        // Map connections to IDs
        wf.connections = {
            "node-webhook": { "main": [[{ "node": "node-agent", "type": "main", "index": 0 }]] },
            "node-gemini": { "ai_languageModel": [[{ "node": "node-agent", "type": "ai_languageModel", "index": 0 }]] },
            "node-memory": { "ai_memory": [[{ "node": "node-agent", "type": "ai_memory", "index": 0 }]] },
            "node-agent": { "main": [[{ "node": "node-respond", "type": "main", "index": 0 }]] }
        };

        console.log('--- Applying Corrected Connections ---');
        await axios.put(`${n8n_url}/api/v1/workflows/${wf_id}`, {
            name: wf.name,
            nodes: wf.nodes,
            connections: wf.connections,
            settings: wf.settings
        }, {
            headers: { 'X-N8N-API-KEY': n8n_api_key }
        });

        console.log('SUCCESS: All internal connections established.');
    } catch (error) {
        console.error('FAILED:', error.response?.data.message || error.message);
    }
}

reconnectWorkflow();
