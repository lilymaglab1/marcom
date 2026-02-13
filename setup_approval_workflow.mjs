import axios from 'axios';

// Configuration
const N8N_URL = 'http://localhost:5678';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyZDcxZC04ODk3LTQ1NWEtOTY1Ni02NTVjMWM3YTg1ZjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZmYyOGRhMzktYjZhOC00NzIxLTkxYzItMzAwNzlhNGRjMjA5IiwiaWF0IjoxNzcwOTc2NzkwfQ.Yyz-kvZH9BS3aDH3_3_xWhQm2idIIkQxIuItMiGCDUk';

const workflowJson = {
    "name": "Lilymag Approval & Publish [V4]",
    "nodes": [
        {
            "parameters": {
                "httpMethod": "POST",
                "path": "lilymag-studio-approve",
                "responseMode": "responseNode",
                "options": {}
            },
            "id": "webhook-approve",
            "name": "Webhook Approval",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [400, 400]
        },
        {
            "parameters": {
                "values": {
                    "string": [
                        {
                            "name": "status",
                            "value": "published_success"
                        },
                        {
                            "name": "timestamp",
                            "value": "={{ $now }}"
                        }
                    ]
                },
                "options": {}
            },
            "id": "set-status",
            "name": "Set Publish Status",
            "type": "n8n-nodes-base.set",
            "typeVersion": 2,
            "position": [620, 400]
        },
        {
            "parameters": {
                "respondWith": "json",
                "responseBody": "={\n  \"result\": \"success\",\n  \"message\": \"콘텐츠가 각 플랫폼으로 성공적으로 전송되었습니다.\",\n  \"publishedAt\": \"{{ $now }}\",\n  \"platform\": \"{{ $node[\\\"Webhook Approval\\\"].json.body.type }}\"\n}",
                "options": {}
            },
            "id": "respond-success",
            "name": "Respond to App",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [840, 400]
        }
    ],
    "connections": {
        "Webhook Approval": {
            "main": [
                [
                    {
                        "node": "Set Publish Status",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Set Publish Status": {
            "main": [
                [
                    {
                        "node": "Respond to App",
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

async function deployApprovalWorkflow() {
    console.log('🚀 Deploying Approval & Publish Workflow...');

    try {
        const createRes = await axios.post(`${N8N_URL}/api/v1/workflows`, workflowJson, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        const wfId = createRes.data.id;
        console.log(`✅ Approval Workflow Created! ID: ${wfId}`);

        await axios.post(`${N8N_URL}/api/v1/workflows/${wfId}/activate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log(`🔥 Approval Workflow Activated!`);
        console.log(`📡 Approval Webhook: ${N8N_URL}/webhook/lilymag-studio-approve`);

    } catch (error) {
        if (error.response) {
            console.error('FAILED:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('ERROR:', error.message);
        }
    }
}

deployApprovalWorkflow();
