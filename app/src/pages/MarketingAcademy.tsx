import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hash,
    BookOpen,
    TrendingUp,
    Target,
    Clock,
    Youtube,
    Link as LinkIcon,
    Globe,
    PlayCircle,
    ExternalLink,
    RefreshCw,
    BrainCircuit,
    Sparkles,
    Zap,
    Lightbulb,
    ChevronDown,
    Bookmark,
    Search,
    MessageCircle,
    GraduationCap,
    Trash2
} from 'lucide-react';
import { generateInsightReport } from '../services/geminiDirect';
import { MARKETING_CURRICULUM, CurriculumItem } from '../data/marketingCurriculum';
import { getMarketingPosts, createMarketingPost, deleteMarketingPost } from '../lib/supabaseClient';

const IconMap: Record<string, any> = {
    'BrainCircuit': BrainCircuit,
    'BookOpen': BookOpen,
    'TrendingUp': TrendingUp,
    'Lightbulb': Lightbulb,
    'Target': Target,
    'Sparkles': Sparkles,
    'Zap': Zap,
    'Youtube': Youtube,
    'Globe': Globe,
    'LinkIcon': LinkIcon
};

interface MarketingAcademyProps {
    onNavigate: (page: string) => void;
}

const MarketingAcademy: React.FC<MarketingAcademyProps> = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'hack' | 'advanced'>('all');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Insight Hub State
    const [activeTab, setActiveTab] = useState<'youtube' | 'web' | 'brain'>('youtube');
    const [inputValue, setInputValue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Supabase Data State
    const [curriculumData, setCurriculumData] = useState<CurriculumItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const posts = await getMarketingPosts();
                if (posts) {
                    const mapped = posts.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        description: p.description || p.content.intro,
                        author: p.author,
                        category: p.category as 'basic' | 'advanced' | 'hack',
                        icon: IconMap[p.icon_name] || Zap,
                        readTime: p.read_time,
                        tags: p.tags || [],
                        content: p.content,
                        created_at: p.created_at,
                        sourceType: p.source_type,
                        originalUrl: p.original_url,
                        metadata: p.metadata
                    }));
                    // Filter out fallback error items and set data
                    const validItems = mapped.filter((item: CurriculumItem) => item.title !== '분석 리포트 (Fallback)');
                    setCurriculumData(validItems.length > 0 ? validItems : MARKETING_CURRICULUM);
                }
            } catch (error) {
                console.error("Failed to fetch marketing posts", error);
                // Fallback to mock data if DB fails
                setCurriculumData(MARKETING_CURRICULUM);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const generateTagsFromTopic = (topic: string) => {
        const potentialTags = ['Marketing', 'Viral', 'Brand', 'Social', 'SEO', 'Data', 'Growth', 'Strategy', 'AI', 'Content', 'Trend', 'Sales', 'Copywriting', 'Insight', 'Psychology', 'Design'];
        const tags = ['AI Insight'];
        potentialTags.forEach(tag => {
            if (topic.toLowerCase().includes(tag.toLowerCase())) {
                tags.push(tag);
            }
        });
        if (tags.length === 1) tags.push('Trend Watch');
        return tags;
    };

    const extractYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2]?.length === 11) ? match[2] : null;
    };

    const handleAnalyze = async () => {
        if (!inputValue) return;
        setIsAnalyzing(true);

        // Process based on source
        let newItemPayload: any = {
            author: 'Momentum AI',
            category: 'hack',
            read_time: '5 min', // AI reports are detailed
            created_at: new Date().toISOString(),
            tags: [],
            status: 'published',
            content: {}
        };

        // 1. Generate Deep Insight Report via Gemini AI
        try {
            const report = await generateInsightReport(inputValue, activeTab);

            // Map AI Result to Payload
            newItemPayload.title = report.title;
            newItemPayload.description = report.intro.substring(0, 100) + "..."; // Brief preview
            newItemPayload.content = {
                intro: report.intro,
                keyPoints: report.sections.map(sec => ({ title: sec.title, desc: sec.content })),
                godariNote: report.godariNote
            };
        } catch (error) {
            console.error("AI Generation failed:", error);
            // Fallback content in case AI fails (Unlikely with fallback in service, but safety first)
            newItemPayload.title = "분석 실패";
            newItemPayload.content = {
                intro: "AI 서비스 연결에 실패했습니다.",
                keyPoints: [],
                godariNote: "잠시 후 다시 시도해주세요."
            };
        }

        // 2. Add Source Metadata
        if (activeTab === 'youtube') {
            const videoId = extractYoutubeId(inputValue);
            newItemPayload.source_type = 'youtube';
            newItemPayload.original_url = inputValue;
            newItemPayload.icon_name = 'Youtube';
            newItemPayload.metadata = { thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined };
            newItemPayload.tags = ['#YouTube분석', '#DeepDive', '#마케팅인사이트'];
        } else if (activeTab === 'web') {
            newItemPayload.source_type = 'web';
            newItemPayload.original_url = inputValue;
            newItemPayload.icon_name = 'Globe';
            newItemPayload.tags = ['#Web심층분석', '#트렌드리포트'];
        } else {
            // Brainstorming
            newItemPayload.source_type = 'brain';
            newItemPayload.icon_name = 'BrainCircuit';
            newItemPayload.tags = generateTagsFromTopic(inputValue);
        }

        // Save (Mock saving to DB via createMarketingPost)
        // Save (Mock saving to DB via createMarketingPost)
        let savedPost;
        try {
            savedPost = await createMarketingPost(newItemPayload);
        } catch (error) {
            console.error("Failed to save post:", error);
            // Default to local mock if DB fails
            savedPost = null;
        }

        setIsAnalyzing(false);
        setInputValue('');
        setSearchQuery('');
        setSelectedTag(null);

        // Fallback to local data if DB insert fails (for mock/demo purposes)
        const effectivePost = savedPost || {
            ...newItemPayload,
            id: `temp-${Date.now()}`,
            created_at: new Date().toISOString()
        };

        const mappedSavedPost: CurriculumItem = {
            id: effectivePost.id,
            title: effectivePost.title,
            description: effectivePost.description || effectivePost.content.intro,
            author: effectivePost.author,
            category: effectivePost.category as any,
            icon: activeTab === 'youtube' ? Youtube : activeTab === 'web' ? Globe : BrainCircuit,
            readTime: effectivePost.read_time,
            tags: effectivePost.tags || [],
            content: effectivePost.content,
            created_at: effectivePost.created_at,
            // Source Type mapping with fallback
            sourceType: effectivePost.source_type || activeTab as any,
            originalUrl: effectivePost.original_url,
            metadata: effectivePost.metadata
        };

        setCurriculumData(prev => [mappedSavedPost, ...prev]);
        setSelectedCategory('all');
        alert("인사이트 분석이 완료되었습니다!");
    };

    // Filter Logic
    const filteredCurriculum = useMemo(() => {
        return curriculumData.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;

            return matchesCategory && matchesSearch && matchesTag;
        });
    }, [curriculumData, selectedCategory, searchQuery, selectedTag]);

    // Gather all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        curriculumData.forEach(item => item.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags);
    }, [curriculumData]);

    // Random Daily Pick (Simulated)
    const dailyPick = useMemo(() => {
        if (curriculumData.length === 0) return MARKETING_CURRICULUM[0];
        // Use date to pick a consistent item for the day, or just random for now
        const randomIndex = Math.floor(Math.random() * curriculumData.length);
        return curriculumData[randomIndex];
    }, [curriculumData]);

    const toggleExpand = (id: string) => {
        setExpandedItem(expandedItem === id ? null : id);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('정말 이 인사이트를 삭제하시겠습니까?')) return;

        try {
            const success = await deleteMarketingPost(id);
            if (success) {
                setCurriculumData(prev => prev.filter(item => item.id !== id));
                alert('삭제되었습니다.');
            } else {
                // Fallback for local-only items (mock items)
                setCurriculumData(prev => prev.filter(item => item.id !== id));
            }
        } catch (e) {
            console.error(e);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <Layout onNavigate={onNavigate} currentPage="academy">
            <div className="flex flex-col min-h-screen bg-[#020617]">
                {/* Hero & Input Section */}
                <div className="bg-gradient-to-b from-[#0F172A] to-[#020617] pt-8 pb-32 px-4 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-20 pointer-events-none">
                        <Sparkles className="w-96 h-96 text-momentum-blue blur-3xl" />
                    </div>

                    <div className="max-w-3xl mx-auto flex flex-col gap-8 relative z-10">
                        <div className="text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-momentum-gold/10 border border-momentum-gold/20"
                            >
                                <Zap className="w-3 h-3 text-momentum-gold" />
                                <span className="text-[10px] font-black text-momentum-gold uppercase tracking-widest">Momentum AI Insight Hub</span>
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-2">마케팅 <span className="premium-gradient-text">인사이트 허브</span></h2>
                            <p className="text-white/40 text-sm md:text-base">유튜브 영상, 아티클 링크만 넣으세요. AI가 핵심만 요약해 드립니다.</p>
                        </div>

                        {/* INSIGHT GENERATOR */}
                        <div className="w-full bg-[#0A1225]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20">
                            {/* Tabs */}
                            <div className="flex border-b border-white/5 bg-black/20">
                                <button
                                    onClick={() => setActiveTab('youtube')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'youtube' ? 'bg-white/5 text-white border-b-2 border-red-500' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Youtube className={`w-4 h-4 ${activeTab === 'youtube' ? 'text-red-500' : ''}`} />
                                    YouTube
                                </button>
                                <button
                                    onClick={() => setActiveTab('web')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'web' ? 'bg-white/5 text-white border-b-2 border-blue-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <LinkIcon className={`w-4 h-4 ${activeTab === 'web' ? 'text-blue-400' : ''}`} />
                                    Article
                                </button>
                                <button
                                    onClick={() => setActiveTab('brain')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'brain' ? 'bg-white/5 text-white border-b-2 border-momentum-gold' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <BrainCircuit className={`w-4 h-4 ${activeTab === 'brain' ? 'text-momentum-gold' : ''}`} />
                                    Brainstorm
                                </button>
                            </div>

                            {/* Input Area */}
                            <div className="p-6 flex flex-col gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                        placeholder={
                                            activeTab === 'youtube' ? "https://youtube.com/watch?v=..." :
                                                activeTab === 'web' ? "https://example.com/marketing-article..." :
                                                    "지금 고민 중인 마케팅 주제를 입력하세요..."
                                        }
                                        className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-5 pr-32 text-white placeholder-white/20 focus:outline-none focus:border-momentum-blue/50 transition-all font-medium glow-input"
                                    />
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing || !inputValue}
                                        className="absolute right-2 top-2 bottom-2 px-6 bg-momentum-blue text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <span className="flex items-center justify-center w-4 h-4">
                                            {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        </span>
                                        <span>{isAnalyzing ? '분석 중...' : '분석하기'}</span>
                                    </button>
                                </div>
                                <div className="flex justify-center gap-4 text-[10px] text-white/30 font-medium">
                                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> 핵심 요약</span>
                                    <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> 액션 플랜</span>
                                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 트렌드 분석</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Feed */}
                <div className="max-w-3xl mx-auto w-full px-4 -mt-20 pb-20 relative z-20">
                    <div className="flex flex-col gap-6">
                        <AnimatePresence>
                            {isLoading ? (
                                <div className="text-center py-20 text-white/30">
                                    <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin opacity-50" />
                                    <p>인사이트를 불러오는 중입니다...</p>
                                </div>
                            ) : filteredCurriculum.length === 0 ? (
                                <div className="text-center py-20 text-white/30">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>아직 등록된 인사이트가 없습니다.</p>
                                </div>
                            ) : (
                                filteredCurriculum.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-[#0A1225] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group shadow-xl"
                                    >
                                        {/* Card Header: Source & Date */}
                                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${item.sourceType === 'youtube' ? 'bg-red-500/10 text-red-500' :
                                                    item.sourceType === 'web' ? 'bg-blue-400/10 text-blue-400' :
                                                        'bg-momentum-gold/10 text-momentum-gold'
                                                    }`}>
                                                    {item.sourceType === 'youtube' ? <Youtube className="w-4 h-4" /> :
                                                        item.sourceType === 'web' ? <Globe className="w-4 h-4" /> :
                                                            <BrainCircuit className="w-4 h-4" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                                                        {item.sourceType === 'youtube' ? 'YouTube Analysis' :
                                                            item.sourceType === 'web' ? 'Web Article' : 'Momentum Insight'}
                                                    </span>
                                                    {item.created_at && <span className="text-[10px] font-bold text-white/30">{formatDate(item.created_at)}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${item.category === 'hack' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
                                                    {item.category === 'hack' ? 'Growth Hack' : 'Basic'}
                                                </span>
                                                {item.originalUrl && (
                                                    <a href={item.originalUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors">
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(item.id);
                                                    }}
                                                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/30 hover:text-red-500 transition-colors"
                                                    title="삭제"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-0">
                                            {/* Youtube Thumbnail / Content Layout */}
                                            <div className="flex flex-col md:flex-row">
                                                {item.metadata?.thumbnail && (
                                                    <div className="relative w-full md:w-64 aspect-video md:aspect-auto flex-shrink-0 group-hover:opacity-90 transition-opacity bg-black">
                                                        <img src={item.metadata.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <PlayCircle className="w-10 h-10 text-white drop-shadow-lg" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="p-6 flex-1 flex flex-col gap-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-momentum-blue transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-white/60 line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    {/* Expanded Content (Always show 3 Key Points) */}
                                                    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                                        {item.content.keyPoints?.slice(0, 3).map((point, i) => (
                                                            <div key={i} className="flex gap-3 items-start">
                                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-momentum-gold flex-shrink-0" />
                                                                <div>
                                                                    <span className="text-xs font-bold text-momentum-gold block mb-0.5">{point.title}</span>
                                                                    <span className="text-xs text-white/50 leading-relaxed block">{point.desc}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <button
                                                        onClick={() => toggleExpand(item.id)}
                                                        className="self-start text-[10px] font-bold text-white/40 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors"
                                                    >
                                                        {expandedItem === item.id ? '접기 (Close)' : '전체 내용 보기 (Read Full)'} <ChevronDown className={`w-3 h-3 transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Full Content Expansion */}
                                            <AnimatePresence>
                                                {expandedItem === item.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="border-t border-white/5 bg-black/20"
                                                    >
                                                        <div className="p-8 flex flex-col gap-8">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <BookOpen className="w-4 h-4 text-momentum-blue" />
                                                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">상세 분석 (Detailed Analysis)</h4>
                                                                </div>
                                                                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line border-l-2 border-momentum-blue pl-4 py-1">
                                                                    {item.content.intro}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Lightbulb className="w-4 h-4 text-momentum-gold" />
                                                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">고다리 부장의 한마디</h4>
                                                                </div>
                                                                <div className="p-4 rounded-xl bg-momentum-gold/10 border border-momentum-gold/20 flex gap-4">
                                                                    <div className="w-10 h-10 rounded-full bg-momentum-gold flex items-center justify-center flex-shrink-0 font-black text-black">GO</div>
                                                                    <p className="text-sm text-momentum-gold font-medium italic leading-relaxed">
                                                                        "{item.content.godariNote}"
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MarketingAcademy;
