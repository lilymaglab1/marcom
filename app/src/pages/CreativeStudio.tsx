import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import {
    Sparkles,
    RefreshCw,
    FileText,
    Instagram,
    Youtube,
    RotateCcw,
    Wand2,
    Edit3,
    Check,
    ImageOff,
    Pencil,
    Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LILYMAG_BRAIN_CONTEXT } from '../data/aiBrainContext';

// Found API Key from C:\startup_marketing com
const POLLINATIONS_API_KEY = 'sk_rF0EPX75yRV9mkuIxvBnuZ80LmdCOdXE';

// Direct Gemini Logic
import { generateContentDirect, GeminiContent } from '../services/geminiDirect';

const agents = [
    { id: 'blog', name: '인문학 에디터', icon: FileText, desc: '미술, 음악, 추억을 연결하는 스토리텔링 (LILYMAG)', color: 'blue' },
    { id: 'social', name: '소셜 미디어 PD', icon: Instagram, desc: '감성적인 릴리맥 인스타그램 캡션', color: 'purple' },
    { id: 'video', name: '쇼츠/릴스 디렉터', icon: Youtube, desc: '감각적인 영상 구성안 및 대본', color: 'red' },
];

const CreativeStudio: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [selectedAgent, setSelectedAgent] = useState('blog');
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'blog' | 'instagram' | 'shorts'>('blog');
    const [isPublishing, setIsPublishing] = useState(false);

    // Direct Generation Toggle
    const [isDirectMode, setIsDirectMode] = useState(true); // Default to App Direct (Faster/Safer)

    // Editor States
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [editedTitle, setEditedTitle] = useState('');

    // Image States
    const [customPrompts, setCustomPrompts] = useState<Record<number, string>>({});
    const [isRegeneratingImage, setIsRegeneratingImage] = useState<Record<number, boolean>>({});
    const [imageLoadErrors, setImageLoadErrors] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (result?.blog) {
            setEditedContent(result.blog.content);
            setEditedTitle(result.blog.title);
        }
        // Initialize custom prompts with recommended prompts when result loads
        if (result?.images) {
            const initialPrompts: Record<number, string> = {};
            // Handle both structure formats (direct vs n8n)
            const imgList = Array.isArray(result.images) ? result.images : [];
            imgList.forEach((img: any) => {
                initialPrompts[img.id] = img.recommended_prompt;
            });
            setCustomPrompts(initialPrompts);
        }
    }, [result]);

    // Helper: Generate High-Quality Flux Image URL with API Key (PREMIUM FAST)
    const getPollinationsUrl = (prompt: string, seed: number) => {
        const enhancedPrompt = prompt.includes('high quality') ? prompt : `${prompt}, high quality, cinematic lighting, 8k resolution, photorealistic, elegant style`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        // 💎 Use User's Premium Key for Speed & Quality
        return `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1280&model=flux&nologo=true&seed=${seed}&key=${POLLINATIONS_API_KEY}`;
    };

    const getFallbackUrl = (prompt: string, seed: number) => {
        // Fallback to Public/Free Endpoint if Premium fails
        console.log("⚠️ Premium Image Failed. Switching to Public Endpoint...");
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1280&model=flux&nologo=true&seed=${seed}`;
    };

    const handleImageError = (imgId: number, prompt: string, seed: number) => {
        if (!imageLoadErrors[imgId]) {
            setImageLoadErrors(prev => ({ ...prev, [imgId]: true }));
            setResult((prev: any) => ({
                ...prev,
                images: prev.images.map((img: any) =>
                    img.id === imgId ? { ...img, url: getFallbackUrl(prompt, seed) } : img
                )
            }));
        }
    };

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setResult(null);
        setIsEditing(false);
        setImageLoadErrors({});

        try {
            let finalData;

            if (isDirectMode) {
                // 🚀 APP DIRECT MODE (No Server Dependency)
                console.log("⚡ Generating via App Engine...");
                const directResult: GeminiContent = await generateContentDirect(topic); // Assuming import
                finalData = directResult;
            } else {
                // ☁️ RAILWAY SERVER MODE
                console.log("🌧️ Generating via Railway Server...");
                const response = await fetch('/api/n8n/webhook/lilymag-studio-v4', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keyword: topic, context: LILYMAG_BRAIN_CONTEXT }),
                });

                if (!response.ok) {
                    if (response.status === 500) throw new Error('AI 서비스 과부하 (잠시 후 다시 시도)');
                    throw new Error('네트워크 응답 오류');
                }
                finalData = await response.json();
            }

            // Apply Flux Model & API Key Logic (Unified)
            if (finalData.images) {
                finalData.images = finalData.images.map((img: any) => ({
                    ...img,
                    url: getPollinationsUrl(img.recommended_prompt, Math.floor(Math.random() * 1000))
                }));
            }

            setResult(finalData);
        } catch (e: any) {
            console.error(e);
            alert(`생성 중 오류가 발생했습니다: ${e.message}`);
        }
        finally { setIsGenerating(false); }
    };

    const handleRegenerateImage = async (imgId: number) => {
        setIsRegeneratingImage(prev => ({ ...prev, [imgId]: true }));
        setImageLoadErrors(prev => ({ ...prev, [imgId]: false }));
        try {
            // Use user input from customPrompts, or fallback to recommended
            const prompt = customPrompts[imgId] || result?.images?.find((img: any) => img.id === imgId)?.recommended_prompt;
            await new Promise(r => setTimeout(r, 500));

            setResult((prev: any) => ({
                ...prev,
                images: prev.images.map((img: any) =>
                    img.id === imgId ? {
                        ...img,
                        url: getPollinationsUrl(prompt, Math.floor(Math.random() * 10000))
                    } : img
                )
            }));
        } finally { setIsRegeneratingImage(prev => ({ ...prev, [imgId]: false })); }
    };

    const handlePublish = async () => {
        if (!result) return;
        setIsPublishing(true);
        try {
            await fetch('/api/n8n/webhook/lilymag-studio-approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: activeTab === 'blog' ? editedContent : result[activeTab].content || result[activeTab].caption,
                    title: activeTab === 'blog' ? editedTitle : '',
                    type: activeTab,
                    keyword: topic,
                    images: result.images
                }),
            });
            alert('블로그 및 소셜 매체로 발행 요청이 완료되었습니다!');
        } catch (e) { alert('발행 중 오류 발생'); }
        finally { setIsPublishing(false); }
    };

    return (
        <Layout onNavigate={onNavigate} currentPage="studio">
            <div className="p-10 flex flex-col gap-10 max-w-[1700px] mx-auto min-h-screen">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-momentum-blue" />
                                <span className="text-[10px] font-black text-momentum-blue uppercase tracking-[0.3em]">LILYMAG CREATIVE STUDIO</span>
                            </div>
                            <h2 className="text-5xl font-bold tracking-tight font-outfit">AI 스토리텔링 & 아트웍</h2>
                            <p className="text-white/40 text-lg mt-1 font-medium italic">"LILYMAG의 철학을 담은 글과 AI(Flux)가 그린 그림의 만남"</p>
                        </div>
                        {/* ⚡ ENGINE TOGGLE SWITCH */}
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                            <span className="text-[10px] uppercase font-bold text-white/40 pl-2">Engine Mode</span>
                            <button
                                onClick={() => setIsDirectMode(!isDirectMode)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isDirectMode ? 'bg-momentum-blue text-white shadow-lg shadow-blue-500/20' : 'bg-transparent text-white/40 hover:text-white'}`}
                            >
                                {isDirectMode ? <><Sparkles className="w-3 h-3" /> APP DIRECT (FAST)</> : <><RefreshCw className="w-3 h-3" /> RAILWAY SERVER</>}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-4 flex flex-col gap-8">
                        <div className="glass-card p-10 flex flex-col gap-8 bg-white/5 border-white/5">
                            <div className="flex flex-col gap-6">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">에디터 페르소나</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {agents.map((agent) => (
                                        <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={`flex items-center gap-5 p-4 rounded-2xl transition-all border ${selectedAgent === agent.id ? 'bg-momentum-blue/20 border-momentum-blue text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedAgent === agent.id ? 'bg-momentum-blue text-white' : 'bg-white/5'}`}><agent.icon className="w-6 h-6" /></div>
                                            <div className="text-left"><p className="text-sm font-bold">{agent.name}</p><p className="text-[10px] opacity-60 mt-0.5">{agent.desc}</p></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">오늘의 테마 (키워드 콤마 구분)</label>
                                <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="예: 해바라기, 심리학, 컬러학, 여름 추억..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm h-40 focus:border-momentum-blue outline-none transition-all placeholder:text-white/10 resize-none leading-relaxed" />
                            </div>
                            <button onClick={handleGenerate} disabled={isGenerating || !topic} className="w-full py-6 bg-gradient-to-r from-momentum-blue to-blue-600 rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl flex items-center justify-center gap-4 transition-all disabled:opacity-30">
                                {isGenerating ? <><RefreshCw className="w-5 h-5 animate-spin" />LILYMAG 스토리 생성 중...</> : <><Wand2 className="w-5 h-5" />작품 생성 시작 ({isDirectMode ? 'App' : 'Server'})</>}
                            </button>
                        </div>
                    </div>

                    <div className="col-span-8 flex flex-col gap-10">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-10">
                                    <div className="glass-card p-10 bg-white/[0.02] border-white/5">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                                                {['blog', 'instagram', 'shorts'].map((tab) => (
                                                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-white/40'}`}>{tab}</button>
                                                ))}
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-momentum-gold text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                                                    {isEditing ? <><Check className="w-4 h-4" /> 편집 완료</> : <><Edit3 className="w-4 h-4" /> 글 편집하기</>}
                                                </button>
                                                <button onClick={handlePublish} disabled={isPublishing} className="bg-white text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">최종 발행</button>
                                            </div>
                                        </div>
                                        <div className="mt-10 max-h-[700px] overflow-y-auto px-6">
                                            {activeTab === 'blog' && (
                                                <div className="flex flex-col gap-8 max-w-4xl mx-auto py-10">
                                                    {isEditing ? (
                                                        <>
                                                            <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="text-5xl font-bold bg-white/5 border-none text-white outline-none p-4 rounded-xl font-outfit w-full" />
                                                            <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="text-xl leading-[2.2] bg-white/5 border-none text-white/80 outline-none p-6 rounded-2xl min-h-[1000px] font-sans w-full" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <h4 className="text-5xl font-bold text-white leading-tight font-outfit">{editedTitle}</h4>
                                                            <div className="w-20 h-1 bg-momentum-blue/30 rounded-full" />
                                                            <div className="whitespace-pre-wrap font-sans text-xl leading-[2.2] text-white/80 font-normal">{editedContent}</div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6 p-10 glass-card bg-white/[0.01]">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xl font-bold font-outfit">LILYMAG Visual Arts (Flux Mode)</h4>
                                        </div>

                                        {/* Updated Image Grid with Visible Controls */}
                                        <div className="grid grid-cols-4 gap-8">
                                            {result.images?.map((img: any) => (
                                                <div key={img.id} className="flex flex-col gap-4 group">
                                                    {/* Image Card */}
                                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 relative bg-black/40 shadow-xl">
                                                        <img
                                                            src={img.url}
                                                            onError={() => handleImageError(img.id, customPrompts[img.id] || img.recommended_prompt, 123456)}
                                                            className={`w-full h-full object-cover transition-all duration-700 ${isRegeneratingImage[img.id] ? 'blur-xl scale-110 opacity-30' : 'group-hover:scale-105'} ${imageLoadErrors[img.id] ? 'opacity-50' : ''}`}
                                                            loading="lazy"
                                                        />
                                                        {isRegeneratingImage[img.id] && <div className="absolute inset-0 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-white animate-spin" /></div>}
                                                        {imageLoadErrors[img.id] && !isRegeneratingImage[img.id] && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                                                                <ImageOff className="w-8 h-8 mb-2" />
                                                                <span className="text-[10px]">로드 실패</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Prompt Editor */}
                                                    <div className="flex flex-col gap-2">
                                                        <div className="relative">
                                                            <div className="absolute top-3 left-3 opacity-50"><Languages className="w-3 h-3 text-white" /></div>
                                                            <textarea
                                                                value={customPrompts[img.id] || ''}
                                                                onChange={(e) => setCustomPrompts(prev => ({ ...prev, [img.id]: e.target.value }))}
                                                                placeholder="원하는 이미지를 묘사해보세요..."
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-xs text-white/80 focus:text-white focus:bg-white/10 outline-none transition-all placeholder:text-white/20 resize-none h-20 leading-relaxed custom-scrollbar"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => handleRegenerateImage(img.id)}
                                                            disabled={isRegeneratingImage[img.id]}
                                                            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-momentum-blue hover:text-white text-white/60 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                                        >
                                                            {isRegeneratingImage[img.id] ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                                                            이 내용으로 다시 그리기
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center glass-card border-dashed border-white/5 p-40 text-center rounded-[4rem]">
                                    <h3 className="text-4xl font-bold text-white/10 tracking-tight leading-snug">LILYMAG STORYTELLING<br />ARTIFICIAL INTELLIGENCE</h3>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreativeStudio;
