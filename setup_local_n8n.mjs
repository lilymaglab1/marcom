import axios from 'axios';

// Configuration
const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk'; // User provided
const GEMINI_API_KEY = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc'; // From previous context
const WEBHOOK_PATH = 'lilymag-studio-v2';

const workflowJson = {
    "name": "Lilymag Creative Studio [LOCAL]",
    "nodes": [
        {
            "parameters": {
                "httpMethod": "POST",
                "path": WEBHOOK_PATH,
                "responseMode": "responseNode",
                "options": {}
            },
            "id": "webhook-node",
            "name": "Webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [460, 460],
            "webhookId": "7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f7f" // Fixed ID for stability
        },
        {
            "parameters": {
                "method": "POST",
                "url": `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                "sendBody": true,
                "contentType": "json",
                "bodyParameters": {
                    "parameters": [
                        {
                            "name": "contents",
                            "value": "={{ [{\n  \"parts\": [{\n    \"text\": $json.body.prompt || \"Hello\"\n  }]\n}] }}"
                        }
                    ]
                },
                "options": {}
            },
            "id": "gemini-node",
            "name": "Gemini API",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.1,
            "position": [680, 460]
        },
        {
            "parameters": {
                "respondWith": "json",
                "responseBody": "={\n  \"text\": {{ $json.candidates[0].content.parts[0].text.replace(/\"/g, '\\\"') }}\n}",
                "options": {}
            },
            "id": "respond-node",
            "name": "Respond to Webhook",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [900, 460]
        }
    ],
    "connections": {
        "Webhook": {
            "main": [
                [
                    {
                        "node": "Gemini API",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Gemini API": {
            "main": [
                [
                    {
                        "node": "Respond to Webhook",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        }
    },
    "settings": {
        "executionOrder": "v1"
    }
};

async function deployLocalWorkflow() {
    console.log('🚀 Deploying verified workflow to LOCAL n8n...');

    try {
        // 1. Create Workflow
        const createRes = await axios.post(`${N8N_URL}/api/v1/workflows`, workflowJson, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        const wfId = createRes.data.id;
        console.log(`✅ Workflow Created! ID: ${wfId}`);

        // 2. Activate Workflow
        await axios.post(`${N8N_URL}/api/v1/workflows/${wfId}/activate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log(`🔥 Workflow Activated!`);
        console.log(`📡 Endpoint ready: ${N8N_URL}/webhook/${WEBHOOK_PATH}`);

    } catch (error) {
        if (error.response) {
            console.error('FAILED:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('ERROR:', error.message);
        }
    }
}

deployLocalWorkflow();
