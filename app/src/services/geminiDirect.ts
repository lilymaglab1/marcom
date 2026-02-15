import { LILYMAG_BRAIN_CONTEXT } from '../data/aiBrainContext';
import { PersonaSettings } from '../lib/supabaseClient';

// 🔑 USER PROVIDED KEY
const GEMINI_API_KEY = 'AIzaSyCTjKTCqoYinpmoVGEdTuISz-Mfu_J3Rzg';

export interface GeminiContent {
    blog: { title: string; content: string; tags: string[] };
    instagram: { caption: string; hashtags: string[] };
    shorts: { script: string; overlay_text: string };
    images: { id: number; recommended_prompt: string }[];
}

const PRIMARY_MODEL = 'gemini-2.5-flash';

async function callGeminiAPI(model: string, systemPrompt: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    console.log(`🤖 Generate with Verified Model: ${model}...`);

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

// Tone mapping for prompt
const TONE_MAP: Record<string, string> = {
    literary_elegant: '격조 높은 문학적 표현과 은유, 비유를 사용하여 품격 있게 서술합니다. 문장에 깊이와 아름다움이 있어야 합니다.',
    warm_friendly: '독자와 조용히 대화하듯 따뜻하고 포근한 톤으로 서술합니다. 친밀하지만 교양 있는 어조를 유지합니다.',
    professional_authority: '업계 최고 전문가로서 깊은 식견과 신뢰감을 주는 권위 있는 톤으로 서술합니다.',
    poetic_lyrical: '시적이고 서정적인 표현으로, 감각적인 이미지와 리듬감 있는 문장을 사용합니다.',
    storytelling: '이야기를 풀어가듯 몰입감 있는 서사로 독자를 끌어들이며, 에피소드와 장면을 생생하게 묘사합니다.',
};

const STYLE_MAP: Record<string, string> = {
    magazine: '고급 라이프스타일 매거진에 실릴 수준의 기사로, 세련되고 깊이 있는 논조를 유지합니다.',
    column: '전문가 칼럼 형식으로, 주제에 대한 깊은 통찰과 독자적인 관점을 제시합니다.',
    essay: '개인적인 성찰과 경험이 녹아든 에세이로, 주관적이면서도 보편적 공감을 이끌어냅니다.',
    narrative: '사실에 기반한 서사적 논픽션으로, 현장감과 디테일이 살아있는 글을 작성합니다.',
    editorial: '패션·라이프스타일 잡지 에디토리얼처럼 트렌디하면서도 품격 있는 글을 작성합니다.',
};

const OPENING_MAP: Record<string, string> = {
    poetic: '감각적인 장면 묘사, 자연의 소리나 빛, 계절의 변화를 섬세하게 포착하며 시작하세요.',
    question: '독자의 호기심과 사유를 자극하는 철학적 질문으로 시작하세요.',
    anecdote: '기억에 남는 인상적인 에피소드나 인물의 이야기로 몰입감 있게 시작하세요.',
    quotation: '주제와 관련된 명언, 시의 한 구절, 또는 유명 작가의 문장을 인용하며 시작하세요.',
    scene: '영화의 첫 장면처럼 생생하고 구체적인 시공간을 그려내며 시작하세요.',
};

const CLOSING_MAP: Record<string, string> = {
    reflective: '깊은 여운을 남기는 성찰적 문장으로 독자에게 오래도록 생각할 거리를 남기며 마무리하세요.',
    call_to_action: '독자에게 행동이나 경험을 부드럽게 제안하며 마무리하세요.',
    circular: '도입부의 이미지나 키워드와 연결되는 원형 구조로 아름답게 마무리하세요.',
    hopeful: '긍정적인 전망과 기대감을 제시하며 희망찬 톤으로 마무리하세요.',
    open_ended: '독자의 상상과 해석에 맡기는 열린 결말로 여백을 남기며 마무리하세요.',
};

export async function generateContentDirect(keyword: string, persona?: PersonaSettings | null): Promise<GeminiContent> {

    // Build persona-enriched prompt
    let personaBlock = '';
    if (persona) {
        const toneDesc = TONE_MAP[persona.tone] || TONE_MAP['literary_elegant'];
        const styleDesc = STYLE_MAP[persona.writing_style] || STYLE_MAP['magazine'];
        const openingDesc = OPENING_MAP[persona.opening_style] || OPENING_MAP['poetic'];
        const closingDesc = CLOSING_MAP[persona.closing_style] || CLOSING_MAP['reflective'];

        personaBlock = `
    ──── 작가 페르소나: ${persona.persona_name} ────

    [톤 & 분위기]
    ${toneDesc}

    [글쓰기 형식]
    ${styleDesc}

    [도입부 규칙]
    ${openingDesc}

    [마무리 규칙]
    ${closingDesc}

    [분량 규칙]
    - 블로그 본문(blog.content)은 반드시 ${persona.min_length}자 ~ ${persona.max_length}자 사이로 작성하세요.
    - ${persona.paragraph_count}개 이상의 문단으로 구성하세요.
    - 각 문단 사이에 빈 줄(\\n\\n)을 넣어 가독성을 높이세요.

    [필수 연결 주제 - 아래 주제들을 키워드와 자연스럽게 연결하세요]
    ${persona.must_include_topics.map(t => `• ${t}`).join('\n    ')}

    [금지 요소 - 절대 사용하지 마세요]
    ${persona.forbidden_elements.map(f => `✕ ${f}`).join('\n    ')}

    ${persona.custom_instructions ? `[추가 지시]\n    ${persona.custom_instructions}` : ''}

    ${persona.sample_text ? `[레퍼런스 문체 - 아래 글의 문체, 톤, 호흡을 분석하고 유사하게 작성하세요]\n    "${persona.sample_text.substring(0, 1500)}"` : ''}
    `;
    } else {
        personaBlock = `
    ──── 기본 페르소나 ────
    당신은 격조 높은 전문 작가입니다.
    블로그 본문은 최소 2000자 ~ 최대 3000자로 작성하세요.
    6개 이상의 문단으로 구성하고, 추억/미술/음악/영화/여행과 자연스럽게 연결하세요.
    `;
    }

    const systemPrompt = `
    당신은 릴리맥(Lilymag)의 전문 크리에이티브 작가입니다.
    전문 플로리스트가 초빙한 최고 수준의 전문 작가로서, 키워드 [${keyword}]를 중심으로
    인문학적 깊이와 예술적 감성이 결합된 고품격 매거진 에세이를 작성합니다.

    ──── 브랜드 컨텍스트 ────
    ${JSON.stringify(LILYMAG_BRAIN_CONTEXT)}

    ${personaBlock}

    ──── 글의 구조 가이드 ────
    1. 도입부: 감각적이고 몰입감 있는 첫 문단
    2. 전개 1: 키워드의 본질을 탐구하며 예술/문화와 연결
    3. 전개 2: 개인적 추억이나 일화를 통한 감성적 확장
    4. 전개 3: 여행/장소/시간과의 연결
    5. 전환: 꽃과 공간이라는 릴리맥의 세계관으로 자연스럽게 이동
    6. 결말: 깊은 여운을 남기는 성찰적 마무리

    ──── 중요 규칙 ────
    • blog.content는 반드시 긴 분량의 완성된 글이어야 합니다. 짧은 요약이 아닙니다.
    • 한 번의 호흡으로 읽히는 유려한 문장을 구사하세요.
    • 구체적인 예술 작품, 영화, 음악, 장소의 이름을 포함하세요.
    • Instagram과 Shorts는 블로그와 동일한 톤이되, 플랫폼에 맞게 변환하세요.
    • 이미지 프롬프트는 반드시 영어로 작성하고, 글의 분위기를 시각적으로 구현하세요.

    [출력 - JSON만 출력. 마크다운 없이 순수 JSON만]
    {
      "blog": { "title": "...", "content": "반드시 ${persona?.min_length || 2000}자 이상의 완성된 본문...", "tags": [] },
      "instagram": { "caption": "...", "hashtags": [] },
      "shorts": { "script": "...", "overlay_text": "..." },
      "images": [
        { "id": 1, "recommended_prompt": "English prompt for atmospheric, editorial image..." },
        { "id": 2, "recommended_prompt": "English prompt..." },
        { "id": 3, "recommended_prompt": "English prompt..." },
        { "id": 4, "recommended_prompt": "English prompt..." }
      ]
    }`;

    try {
        const data = await callGeminiAPI(PRIMARY_MODEL, systemPrompt);
        const rawText = data.candidates[0].content.parts[0].text;

        // Clean Markdown (```json ... ```)
        const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);

        console.log(`✅ SUCCESS with ${PRIMARY_MODEL}! (Persona: ${persona?.persona_name || 'Default'})`);
        return parsed;

    } catch (error: any) {
        console.error(`❌ Failed with ${PRIMARY_MODEL}:`, error.message);
        throw error;
    }
}

export interface InsightReport {
    title: string;
    intro: string;
    sections: { title: string; content: string }[];
    godariNote: string;
}

export async function generateInsightReport(input: string, type: 'youtube' | 'web' | 'brain'): Promise<InsightReport> {
    const isUrl = type === 'youtube' || type === 'web';

    // Construct Prompt for Review/Study Material
    const promptDetails = isUrl
        ? `다음 콘텐츠를 심층 분석하시오: ${input}`
        : `다음 주제에 대해 깊이 있게 탐구하시오: ${input}`;

    const systemPrompt = `
    당신은 마케팅 교육 전문가입니다.
    ${promptDetails}

    **목표:** 상세한 학습 리포트를 작성하세요.
    **언어:** 반드시 한국어(Korean)로 출력할 것.

    **출력 형식 (JSON Only - NO MARKDOWN, NO \`\`\`json):**
    {
        "title": "...",
        "intro": "핵심 요약 (3-4 문장).",
        "sections": [
            { "title": "1. [핵심 개념]", "content": "상세 설명 (2-3 문단)." },
            { "title": "2. [전략]", "content": "상세 설명 (2-3 문단)." },
            { "title": "3. [실행 계획]", "content": "상세 설명 (2-3 문단)." }
        ],
        "godariNote": "기억에 남는 통찰 한 마디."
    }
    `;

    try {
        // Using 'gemini-flash-latest' based on available models list
        const response: any = await callGeminiAPI(PRIMARY_MODEL, systemPrompt);

        let text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        // Clean JSON
        if (text.startsWith('```json')) {
            text = text.replace(/```json/g, '').replace(/```/g, '');
        }
        return JSON.parse(text);

    } catch (error: any) {
        console.error("Gemini Report Gen Failed:", error);
        return {
            title: isUrl ? "분석 리포트 (Fallback)" : input,
            intro: "AI 분석에 실패하여 기본 템플릿을 제공합니다.",
            sections: [
                { title: "시스템 알림", content: "현재 AI 서비스 연결 상태를 확인해주세요." },
                { title: "수동 분석 권장", content: "잠시 후 다시 시도해주시기 바랍니다." }
            ],
            godariNote: "인내심은 최고의 미덕입니다."
        };
    }
}
