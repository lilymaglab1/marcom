import axios from 'axios';

const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';
const DEBUG_WORKFLOW_ID = 'EmA0nfxCqfyPV0Mu';
const DUPLICATE_ID = 'IiTvkJWlISuUo6qr'; // From previous list output
const GEMINI_API_KEY = 'AIzaSyBkMoSRT3ntho9BEiE5iX7v4h3ZSN63Lcc';

const workflowJson = {
    "name": "Lilymag Creative Studio [LOCAL] - FIXED",
    "nodes": [
        {
            "parameters": {
                "httpMethod": "POST",
                "path": "lilymag-studio-v2",
                "responseMode": "responseNode",
                "options": {}
            },
            "id": "webhook-node",
            "name": "Webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [460, 460],
            "webhookId": "7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f7f" // Restoring fixed ID
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
                "respondWith": "allIncomingItems", // Keep debug mode
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

async function fixWorkflow() {
    try {
        // 1. Delete Duplicate
        console.log(`🗑️ Deleting duplicate workflow ${DUPLICATE_ID}...`);
        try {
            await axios.delete(`${N8N_URL}/api/v1/workflows/${DUPLICATE_ID}`, {
                headers: { 'X-N8N-API-KEY': N8N_API_KEY }
            });
            console.log('✅ Duplicate deleted.');
        } catch (e) {
            console.log('⚠️ Could not delete duplicate (maybe already gone):', e.message);
        }

        // 2. Update Active Workflow
        console.log(`🔧 Updating active workflow ${DEBUG_WORKFLOW_ID}...`);
        await axios.put(`${N8N_URL}/api/v1/workflows/${DEBUG_WORKFLOW_ID}`, workflowJson, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log('✅ Workflow Updated with WebhookID.');

        // 3. Reactivate
        await axios.post(`${N8N_URL}/api/v1/workflows/${DEBUG_WORKFLOW_ID}/activate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log('🔥 Workflow Reactivated.');

    } catch (error) {
        if (error.response) {
            console.error('FAILED:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('ERROR:', error.message);
        }
    }
}

fixWorkflow();
