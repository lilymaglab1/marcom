import { LILYMAG_BRAIN_CONTEXT } from '../data/aiBrainContext';

// 🔑 USER PROVIDED KEY (Verified Access: Future Beta Key)
const GEMINI_API_KEY = 'AIzaSyCTjKTCqoYinpmoVGEdTuISz-Mfu_J3Rzg';

export interface GeminiContent {
    blog: { title: string; content: string; tags: string[] };
    instagram: { caption: string; hashtags: string[] };
    shorts: { script: string; overlay_text: string };
    images: { id: number; recommended_prompt: string }[];
}

// 🔄 Validated Models from User Key Scan:
// 1. gemini-2.5-flash (Fastests & Smartest)
// 2. gemini-2.5-pro (Most Capable)
// 3. gemini-2.0-flash (Alternative)

const PRIMARY_MODEL = 'gemini-2.5-flash';

async function callGeminiAPI(model: string, systemPrompt: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    console.log(`🤖 Generate with Verified Model: ${model}...`);

    // Safety Settings (Block None)
    const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ];

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            safetySettings: safetySettings
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || `API Error ${response.status}`);
    }

    return await response.json();
}

export async function generateContentDirect(keyword: string): Promise<GeminiContent> {

    // System Prompt construction
    const systemPrompt = `
    당신은 릴리맥(Lilymag)의 유니버설 크리에이티브 디렉터입니다.
    키워드 [${keyword}]를 활용해 다학제적 매거진 기사를 작성하세요.
    ${LILYMAG_BRAIN_CONTEXT}
    
    [출력 - JSON만 출력. 마크다운 없이 순수 JSON만]
    {
      "blog": { "title": "...", "content": "...", "tags": [] },
      "instagram": { "caption": "...", "hashtags": [] },
      "shorts": { "script": "...", "overlay_text": "..." },
      "images": [
        { "id": 1, "recommended_prompt": "..." },
        { "id": 2, "recommended_prompt": "..." },
        { "id": 3, "recommended_prompt": "..." },
        { "id": 4, "recommended_prompt": "..." }
      ]
    }`;

    try {
        const data = await callGeminiAPI(PRIMARY_MODEL, systemPrompt);
        const rawText = data.candidates[0].content.parts[0].text;

        // Clean Markdown (```json ... ```)
        const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);

        console.log(`✅ SUCCESS with ${PRIMARY_MODEL}!`);
        return parsed;

    } catch (error: any) {
        console.error(`❌ Failed with ${PRIMARY_MODEL}:`, error.message);
        throw error;
    }
}
