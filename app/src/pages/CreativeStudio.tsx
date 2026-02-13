import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import {
    PenTool,
    MessageSquare,
    Sparkles,
    Send,
    Copy,
    RefreshCw,
    ArrowRight,
    FileText,
    Instagram,
    Youtube,
    CheckCircle2,
    History,
    Languages,
    Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LILYMAG_BRAIN_CONTEXT } from '../data/aiBrainContext';

const agents = [
    { id: 'blog', name: '블로그 에디터', icon: FileText, desc: 'SEO 최적화 및 설득형 칼럼 작성', color: 'blue' },
    { id: 'social', name: '소셜 미디어 PD', icon: Instagram, desc: '인스타그램/페이스북 맞춤형 카드뉴스 및 캡션', color: 'purple' },
    { id: 'video', name: '쇼츠/릴스 디렉터', icon: Youtube, desc: '15초 바이럴 대본 및 영상 구성안', color: 'red' },
    { id: 'ad', name: '퍼포먼스 마케터', icon: Send, desc: '구글/메타 광고 카피 및 후킹 문구', color: 'momentum-gold' },
];

interface CreativeStudioProps {
    onNavigate: (page: string) => void;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ onNavigate }) => {
    const [selectedAgent, setSelectedAgent] = useState('blog');
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setResult(null);

        try {
            // Updated to use Local Proxy to avoid CORS issues
            const response = await fetch('/api/n8n/webhook/lilymag-creative-studio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    agent: selectedAgent,
                    context: LILYMAG_BRAIN_CONTEXT
                }),
            });

            if (!response.ok) {
                throw new Error('워크플로우 호출에 실패했습니다.');
            }

            const data = await response.json();

            // Assuming n8n returns { content: "..." } or similar
            // If the response structure differs, we adjust here
            const generatedContent = data.output || data.content || (typeof data === 'string' ? data : JSON.stringify(data, null, 2));

            setResult(generatedContent);
        } catch (error) {
            console.error('Generation Error:', error);
            setResult('콘텐츠 생성 중 오류가 발생했습니다. n8n 워크플로우 활성화 상태를 확인해 주세요.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Layout onNavigate={onNavigate} currentPage="studio">
            <div className="p-10 flex flex-col gap-10 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="w-5 h-5 text-momentum-blue" />
                        <span className="text-xs font-black text-momentum-blue uppercase tracking-[0.2em]">Momentum Creative Studio</span>
                    </motion.div>
                    <h2 className="text-5xl font-bold font-outfit tracking-tight leading-tight">AI 크리에이티브 스튜디오</h2>
                    <p className="text-white/40 text-lg mt-1">당신의 지식 브레인을 기반으로 클릭을 부르는 고성능 콘텐츠를 무한 생성합니다.</p>
                </div>

                <div className="grid grid-cols-12 gap-10">
                    {/* Left: Configuration */}
                    <div className="col-span-4 flex flex-col gap-8">
                        <div className="glass-card p-8 flex flex-col gap-8">
                            <div className="flex flex-col gap-6">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">AI 마케팅 에이전트</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {agents.map((agent) => (
                                        <button
                                            key={agent.id}
                                            onClick={() => setSelectedAgent(agent.id)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${selectedAgent === agent.id
                                                ? 'bg-momentum-blue/20 border-momentum-blue text-white'
                                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedAgent === agent.id ? 'bg-momentum-blue text-white' : 'bg-white/5 text-white/40'}`}>
                                                <agent.icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold">{agent.name}</p>
                                                <p className="text-[10px] opacity-60 mt-0.5">{agent.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">마케팅 테마 및 주제</label>
                                <div className="relative">
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="어떤 마케팅 콘텐츠를 만들고 싶으신가요? (예: 봄맞이 호텔 로비 스타일링 프로모션)"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm h-40 focus:border-momentum-blue outline-none transition-all placeholder:text-white/10 resize-none"
                                    />
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <button className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-momentum-blue transition-colors">
                                            <Languages className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-momentum-blue transition-colors">
                                            <Type className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex items-center justify-between text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">
                                    <span>창의성 및 브랜드 일관성</span>
                                    <span className="text-momentum-blue">High Fidelity</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        className="h-full bg-momentum-blue"
                                    ></motion.div>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !topic}
                                className="w-full py-5 bg-gradient-to-r from-momentum-blue via-blue-500 to-momentum-accent rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                {isGenerating ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        브레인 동기화 중...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        콘텐츠 큐레이션 시작
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-momentum-gold bg-momentum-gold/5 flex gap-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <History className="w-12 h-12" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-momentum-gold/20 flex items-center justify-center text-momentum-gold shrink-0">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[11px] font-black text-momentum-gold uppercase mb-1 tracking-widest">실시간 지식 연동</p>
                                <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                                    <strong>'AI Brain Context'</strong>에 기반하여 릴리맥 특유의 정체성을 유지한 카피를 도출합니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Preview & Result */}
                    <div className="col-span-8 flex flex-col gap-6 h-full">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-6 h-full"
                                >
                                    <div className="glass-card p-10 flex flex-col gap-8 bg-white/[0.02] border-white/10 h-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                                                <h3 className="text-2xl font-bold font-outfit uppercase tracking-tight">AI Generated Masterpiece</h3>
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
                                                    <Copy className="w-5 h-5" />
                                                </button>
                                                <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-momentum-blue hover:text-white transition-all shadow-xl active:scale-95 group">
                                                    즉시 발행하기
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-[#050B18] rounded-[2.5rem] p-10 border border-white/5 min-h-[500px] shadow-inner relative group/content">
                                            <div className="absolute top-6 right-6 opacity-0 group-hover/content:opacity-40 transition-opacity">
                                                <PenTool className="w-6 h-6 text-white" />
                                            </div>
                                            <pre className="whitespace-pre-wrap font-sans text-lg leading-[1.8] text-white/80 font-medium">
                                                {result}
                                            </pre>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="glass-card p-8 flex flex-col gap-5 border-green-500/20 bg-green-500/5">
                                            <h4 className="text-[10px] font-black text-green-500/60 uppercase tracking-widest">Readability Score</h4>
                                            <div className="flex items-end justify-between">
                                                <span className="text-4xl font-bold font-outfit">98%</span>
                                                <div className="text-[10px] font-black text-green-500 uppercase">Optimal</div>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-[98%] h-full bg-green-500"></div>
                                            </div>
                                        </div>
                                        <div className="glass-card p-8 flex flex-col gap-5 border-momentum-gold/20 bg-momentum-gold/5">
                                            <h4 className="text-[10px] font-black text-momentum-gold/60 uppercase tracking-widest">Conversion Hook</h4>
                                            <div className="flex items-end justify-between">
                                                <span className="text-4xl font-bold font-outfit">92%</span>
                                                <div className="text-[10px] font-black text-momentum-gold uppercase">High Impact</div>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-[92%] h-full bg-momentum-gold"></div>
                                            </div>
                                        </div>
                                        <div className="glass-card p-8 flex flex-col gap-5 border-momentum-blue/20 bg-momentum-blue/5 justify-center items-center text-center">
                                            <CheckCircle2 className="w-10 h-10 text-momentum-blue mb-1" />
                                            <p className="text-xs font-black uppercase tracking-widest">SEO Optimized</p>
                                            <p className="text-[10px] text-white/30 leading-tight">검색 엔진 최적화 및 브랜드 톤앤매너 검수 완료</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 flex flex-col items-center justify-center glass-card border-dashed border-white/5 bg-transparent p-20 text-center rounded-[3rem]"
                                >
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-10 border border-white/5 relative group">
                                        <div className="absolute inset-0 bg-momentum-blue/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <PenTool className="w-12 h-12 text-white/5 relative z-10" />
                                    </div>
                                    <h3 className="text-3xl font-bold font-outfit text-white/20 tracking-tight">당신의 비즈니스 테마를 입력하세요</h3>
                                    <p className="text-white/10 mt-4 max-w-sm text-lg leading-relaxed">릴리맥 마케팅 브레인이 당신의 지식을 학습하여 완벽한 크리에이티브를 즉시 생성합니다.</p>
                                    <div className="mt-12 flex gap-3">
                                        {['프로모션 카피', '브랜드 칼럼', '광고 캠페인'].map(tag => (
                                            <span key={tag} className="px-5 py-2 rounded-full border border-white/5 text-[10px] font-black text-white/10 uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
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
