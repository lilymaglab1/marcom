# n8n MCP Server 배포 및 연동 프로토콜

이 문서는 Momentum AI와 n8n을 MCP(Model Context Protocol)를 통해 연동하는 절차를 설명합니다.

## 1. 사전 준비 (Prerequisites)
- **Node.js**: v18.x 이상 설치 필수.
- **n8n Instance**: `https://n8n.lilymag.com` (또는 로컬 인스턴스).
- **n8n API Key**: n8n 설정 > Personal API Keys에서 생성.

## 2. MCP 서버 설치 (Installation)
프로젝트 루트 디렉토리에서 아래 명령어를 실행하여 전용 MCP 서버 패키지를 설치합니다.
```bash
npm install @iflow-mcp/n8n-mcp
```

## 3. 설정 반영 (Configuration)
`.agent/mcp_config.json` 파일에 아래 설정을 추가합니다.

```json
"n8n": {
    "command": "node",
    "args": [
        "c:/marcom/node_modules/@iflow-mcp/n8n-mcp/dist/mcp/index.js"
    ],
    "env": {
        "N8N_API_URL": "https://n8n.lilymag.com",
        "N8N_API_KEY": "발급받은_API_KEY를_여기에_입력"
    }
}
```

## 4. 연동 확인 (Verification)
설정 후 안티그래비티(또는 Claude Desktop)를 재시작하면, AI 에이전트가 `n8n` 도구를 인식하게 됩니다.
- `list_workflows`: 연동된 n8n의 모든 워크플로우 리스트 확인 가능.
- `execute_workflow`: 특정 워크플로우를 AI가 직접 실행 가능.

## 5. 기대 효과
- **실시간 자동화**: AI가 생성한 콘텐츠를 즉시 n8n을 통해 인스타그램이나 블로그로 발행할 수 있습니다.
- **지식 기반 연동**: NotebookLM의 데이터와 n8n의 자동화 파이프라인이 결합되어 '초개인화 자동 마케팅'이 완성됩니다.
