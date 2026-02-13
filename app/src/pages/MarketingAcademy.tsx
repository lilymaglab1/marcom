import React, { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    Lightbulb,
    ChevronDown,
    MessageCircle,
    BrainCircuit,
    Zap,
    Bookmark,
    Search,
    Sparkles,
    Hash
} from 'lucide-react';
import { MARKETING_CURRICULUM, CurriculumItem } from '../data/marketingCurriculum';

interface MarketingAcademyProps {
    onNavigate: (page: string) => void;
}

const MarketingAcademy: React.FC<MarketingAcademyProps> = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'hack' | 'advanced'>('all');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [newTopic, setNewTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateContent = () => {
        setIsGenerating(true);
        // Simulate AI generation delay with NotebookLM context
        setTimeout(() => {
            setIsGenerating(false);
            setIsGeneratorOpen(false);
            setNewTopic('');
            alert('Momentum AI가 NotebookLM의 릴리맥 30년 데이터를 분석하여 새로운 비법서를 생성하고 지식 커리큘럼에 등록했습니다: ' + newTopic);
        }, 2500);
    };

    // Filter Logic
    const filteredCurriculum = useMemo(() => {
        return MARKETING_CURRICULUM.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;

            return matchesCategory && matchesSearch && matchesTag;
        });
    }, [selectedCategory, searchQuery, selectedTag]);

    // Gather all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        MARKETING_CURRICULUM.forEach(item => item.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags);
    }, []);

    // Random Daily Pick (Simulated)
    const dailyPick = useMemo(() => {
        // Use date to pick a consistent item for the day, or just random for now
        const randomIndex = Math.floor(Math.random() * MARKETING_CURRICULUM.length);
        return MARKETING_CURRICULUM[randomIndex];
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedItem(expandedItem === id ? null : id);
    };

    return (
        <Layout onNavigate={onNavigate} currentPage="academy">
            <div className="p-10 flex flex-col gap-10 max-w-[1600px] mx-auto min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col gap-3">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2"
                            >
                                <GraduationCap className="w-5 h-5 text-momentum-gold" />
                                <span className="text-xs font-black text-momentum-gold uppercase tracking-[0.2em]">Momentum Marketing Academy</span>
                            </motion.div>
                            <h2 className="text-5xl font-bold font-outfit tracking-tight leading-tight">
                                마케팅 <span className="premium-gradient-text">비법서</span>
                            </h2>
                            <p className="text-white/40 text-lg mt-1">
                                "마케팅을 몰라도 괜찮습니다. 이 앱과 함께 성장하세요." - <span className="text-white/80 font-bold">고다리 부장의 비밀 노트</span>
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Momentum AI Grounded (NotebookLM Active)</span>
                            </div>
                        </div>
                    </div>

                    {/* Today's Pick Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 border-momentum-blue/30 bg-gradient-to-r from-momentum-blue/10 to-transparent relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <Sparkles className="w-40 h-40" />
                        </div>
                        <div className="flex items-start gap-6 relative z-10">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-momentum-blue">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-momentum-blue uppercase tracking-widest">Today's Pick</span>
                                    <span className="text-white/20 text-xs">|</span>
                                    <span className="text-xs text-white/60">오늘 이건 꼭 읽어보세요!</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">{dailyPick.title}</h3>
                                <p className="text-sm text-white/50 max-w-2xl">{dailyPick.description}</p>
                                <button
                                    onClick={() => setExpandedItem(dailyPick.id)}
                                    className="mt-2 text-xs font-bold text-momentum-blue hover:text-white transition-colors flex items-center gap-1"
                                >
                                    바로 읽기 <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col gap-4 sticky top-4 z-40 bg-[#050B18]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="무엇을 배우고 싶으신가요? (예: 카피라이팅, 전략, 심리...)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#0A1225] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-momentum-blue/50 transition-all font-medium"
                                />
                            </div>
                            <div className="flex gap-2 bg-[#0A1225] p-1.5 rounded-xl border border-white/10">
                                {['all', 'basic', 'hack'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat as any)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                            ? 'bg-momentum-blue text-white shadow-lg shadow-blue-500/30'
                                            : 'text-white/30 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {cat === 'all' ? 'All' : cat === 'basic' ? '기초' : '해킹'}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setIsGeneratorOpen(true)}
                                    className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all bg-momentum-gold text-black hover:bg-white flex items-center gap-1 ml-2 shadow-lg shadow-gold-500/20"
                                >
                                    <Sparkles className="w-3 h-3" /> 지식 브레인 연동 생성
                                </button>
                            </div>
                        </div>

                        {/* Tag Cloud */}
                        <div className="flex flex-wrap gap-2">
                            {allTags.slice(0, 8).map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                    className={`px-3 py-1 rounded-full text-[10px] border transition-all flex items-center gap-1 ${selectedTag === tag
                                        ? 'bg-white text-black border-white font-bold'
                                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Hash className="w-2.5 h-2.5" />
                                    {tag.replace('#', '')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Curriculum Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                    <AnimatePresence mode="popLayout">
                        {filteredCurriculum.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`glass-card flex flex-col overflow-hidden group hover:border-momentum-blue/50 transition-all ${expandedItem === item.id ? 'col-span-full md:col-span-full xl:col-span-full bg-[#050B18] border-momentum-blue' : ''}`}
                            >
                                <div className="p-8 flex flex-col h-full gap-6 relative cursor-pointer" onClick={() => toggleExpand(item.id)}>
                                    <div className="flex items-start justify-between">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${expandedItem === item.id ? 'bg-momentum-blue text-white' : 'bg-white/5 text-white/40 group-hover:bg-momentum-blue/20 group-hover:text-momentum-blue'}`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.category === 'hack' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
                                                {item.category === 'hack' ? 'Growth Hack' : 'Basic'}
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/30 flex items-center gap-1">
                                                <Bookmark className="w-3 h-3" /> {item.readTime}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className={`font-bold font-outfit mb-2 transition-colors ${expandedItem === item.id ? 'text-3xl text-white' : 'text-xl text-white/90 group-hover:text-momentum-blue'}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-white/40 text-sm leading-relaxed line-clamp-2 group-hover:text-white/60 transition-colors">
                                            {item.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {item.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[10px] text-momentum-blue/80 opacity-60">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.author}</span>
                                        <button className={`p-2 rounded-full transition-all ${expandedItem === item.id ? 'bg-white text-black rotate-180' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedItem === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-8 pb-10 bg-[#050B18] border-t border-white/5"
                                        >
                                            <div className="pt-8 grid grid-cols-12 gap-10">
                                                <div className="col-span-8 flex flex-col gap-8">
                                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                                        <p className="text-lg text-white/90 leading-relaxed font-medium">
                                                            "{item.content.intro}"
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        {item.content.keyPoints.map((point, i) => (
                                                            <div key={i} className="flex gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors">
                                                                <div className="w-8 h-8 rounded-full bg-momentum-blue/10 flex items-center justify-center text-momentum-blue font-bold text-sm shrink-0">
                                                                    {i + 1}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-white mb-1">{point.title}</h4>
                                                                    <p className="text-sm text-white/60 leading-relaxed">{point.desc}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="col-span-4">
                                                    <div className="sticky top-8 glass-card p-6 border-momentum-gold/30 bg-momentum-gold/5 flex flex-col gap-4 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                                            <Lightbulb className="w-20 h-20" />
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-8 h-8 rounded-full bg-momentum-gold flex items-center justify-center shadow-lg">
                                                                <MessageCircle className="w-4 h-4 text-black fill-current" />
                                                            </div>
                                                            <span className="text-xs font-black text-momentum-gold uppercase tracking-widest">고다리 부장의 실전 Tip</span>
                                                        </div>
                                                        <div className="relative z-10">
                                                            <p className="text-sm font-bold text-white/90 leading-relaxed italic">
                                                                "{item.content.godariNote}"
                                                            </p>
                                                        </div>
                                                        <button className="mt-4 w-full py-3 bg-momentum-gold/10 hover:bg-momentum-gold/20 text-momentum-gold rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                            이 이론 적용해서 글쓰기
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* AI Generator Modal */}
            <AnimatePresence>
                {isGeneratorOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsGeneratorOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-2xl bg-[#050B18] border-momentum-gold/30 p-8 flex flex-col gap-6 relative overflow-hidden"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <BrainCircuit className="w-64 h-64 text-momentum-gold" />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-momentum-gold flex items-center justify-center shadow-lg shadow-gold-500/20">
                                    <Zap className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold font-outfit text-white">AI 지식 생성기</h3>
                                    <p className="text-white/40 text-sm">유튜브 링크나 주제만 입력하세요. AI가 비법서를 작성합니다.</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 relative z-10">
                                <div>
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Source / Topic</label>
                                    <input
                                        type="text"
                                        placeholder="예: https://youtube.com/watch?v=... 또는 '바이럴 마케팅의 법칙'"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-momentum-gold transition-all font-medium"
                                        value={newTopic}
                                        onChange={(e) => setNewTopic(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={handleGenerateContent}
                                    disabled={isGenerating || !newTopic}
                                    className="w-full py-4 bg-momentum-gold text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Sparkles className="w-4 h-4 animate-spin" />
                                            분석 및 생성 중...
                                        </>
                                    ) : (
                                        <>
                                            <BrainCircuit className="w-4 h-4" />
                                            비법서 생성 시작
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default MarketingAcademy;
