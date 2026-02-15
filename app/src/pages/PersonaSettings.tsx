import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import {
    Settings,
    Save,
    RefreshCw,
    Sparkles,
    PenTool,
    BookOpen,
    Plus,
    X,
    CheckCircle2,
    AlertCircle,
    Type,
    AlignLeft,
    ListChecks,
    Ban,
    FileText,
    Palette
} from 'lucide-react';
import { getActivePersona, savePersonaSettings, PersonaSettings as PersonaType } from '../lib/supabaseClient';

// ============ OPTIONS ============

const TONE_OPTIONS = [
    { value: 'literary_elegant', label: '문학적 우아함', desc: '격조 높은 문학적 표현과 은유를 사용' },
    { value: 'warm_friendly', label: '따뜻하고 친근', desc: '독자와 대화하듯 포근한 톤' },
    { value: 'professional_authority', label: '전문 권위적', desc: '업계 전문가로서 신뢰감 있는 톤' },
    { value: 'poetic_lyrical', label: '시적 서정', desc: '시처럼 아름답고 감성적인 글' },
    { value: 'storytelling', label: '스토리텔링', desc: '이야기를 풀어가듯 몰입감 있는 서사' },
];

const WRITING_STYLE_OPTIONS = [
    { value: 'magazine', label: '매거진 에세이', desc: '고급 잡지에 실릴 수준의 기사체' },
    { value: 'column', label: '전문 칼럼', desc: '전문가 칼럼 형식의 깊이 있는 글' },
    { value: 'essay', label: '개인 에세이', desc: '개인적 성찰이 담긴 에세이' },
    { value: 'narrative', label: '서사적 논픽션', desc: '사실에 기반한 이야기 형식' },
    { value: 'editorial', label: '에디토리얼', desc: '패션/라이프스타일 잡지 에디토리얼' },
];

const LANGUAGE_LEVEL_OPTIONS = [
    { value: 'professional', label: '전문가 수준', desc: '풍부한 어휘와 정교한 문장 구사' },
    { value: 'educated', label: '교양 수준', desc: '지적이지만 읽기 쉬운 문체' },
    { value: 'accessible', label: '대중적', desc: '누구나 쉽게 읽을 수 있는 문체' },
];

const OPENING_STYLE_OPTIONS = [
    { value: 'poetic', label: '시적 도입', desc: '감각적인 장면 묘사로 시작' },
    { value: 'question', label: '질문형 도입', desc: '독자의 호기심을 자극하는 질문' },
    { value: 'anecdote', label: '일화 도입', desc: '인상적인 에피소드로 시작' },
    { value: 'quotation', label: '인용 도입', desc: '명언이나 명구로 시작' },
    { value: 'scene', label: '장면 묘사', desc: '영화의 첫 장면처럼 생생하게' },
];

const CLOSING_STYLE_OPTIONS = [
    { value: 'reflective', label: '성찰적 마무리', desc: '깊은 여운을 남기는 성찰' },
    { value: 'call_to_action', label: '행동 촉구', desc: '독자에게 무언가를 제안하며 마무리' },
    { value: 'circular', label: '원형 구조', desc: '도입부와 연결되는 원형 마무리' },
    { value: 'hopeful', label: '희망적 마무리', desc: '긍정적 전망으로 마무리' },
    { value: 'open_ended', label: '열린 결말', desc: '독자의 상상에 맡기는 마무리' },
];

const SUGGESTED_TOPICS = ['추억', '미술', '음악', '영화', '여행', '꽃', '공간', '예술', '문학', '건축', '철학', '역사', '사진', '디자인', '패션', '요리', '자연', '계절', '빛', '색채', '향기', '시간'];
const SUGGESTED_FORBIDDEN = ['이모지', '과도한 영어', '광고성 문구', '클릭베이트', '~입니다 체', '구어체', '은어/속어', '과도한 감탄사', '반복 표현'];

// ============ COMPONENT ============

const PersonaSettings: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [settings, setSettings] = useState<PersonaType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [newTopic, setNewTopic] = useState('');
    const [newForbidden, setNewForbidden] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        const data = await getActivePersona();
        if (data) {
            setSettings(data);
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!settings?.id) return;
        setIsSaving(true);
        const result = await savePersonaSettings({ ...settings, id: settings.id });
        if (result) {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        setIsSaving(false);
    };

    const addTopic = (topic: string) => {
        if (!settings || !topic.trim()) return;
        if (settings.must_include_topics.includes(topic.trim())) return;
        setSettings({ ...settings, must_include_topics: [...settings.must_include_topics, topic.trim()] });
        setNewTopic('');
    };

    const removeTopic = (topic: string) => {
        if (!settings) return;
        setSettings({ ...settings, must_include_topics: settings.must_include_topics.filter(t => t !== topic) });
    };

    const addForbidden = (item: string) => {
        if (!settings || !item.trim()) return;
        if (settings.forbidden_elements.includes(item.trim())) return;
        setSettings({ ...settings, forbidden_elements: [...settings.forbidden_elements, item.trim()] });
        setNewForbidden('');
    };

    const removeForbidden = (item: string) => {
        if (!settings) return;
        setSettings({ ...settings, forbidden_elements: settings.forbidden_elements.filter(f => f !== item) });
    };

    if (isLoading) {
        return (
            <Layout onNavigate={onNavigate} currentPage="persona">
                <div className="flex items-center justify-center min-h-screen">
                    <RefreshCw className="w-8 h-8 text-momentum-blue animate-spin" />
                </div>
            </Layout>
        );
    }

    if (!settings) {
        return (
            <Layout onNavigate={onNavigate} currentPage="persona">
                <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-white/40">
                    <AlertCircle className="w-12 h-12" />
                    <p>페르소나 설정을 불러올 수 없습니다.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout onNavigate={onNavigate} currentPage="persona">
            <div className="p-10 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <PenTool className="w-5 h-5 text-momentum-blue" />
                            <span className="text-[10px] font-black text-momentum-blue uppercase tracking-[0.3em]">AI WRITER PERSONA</span>
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight font-outfit">작가 페르소나 설정</h2>
                        <p className="text-white/40 text-lg mt-1 font-medium italic">"일관된 톤, 일관된 품격 — 전문 작가의 목소리를 설정합니다"</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${saveSuccess
                            ? 'bg-green-500 text-white shadow-green-500/30'
                            : 'bg-gradient-to-r from-momentum-blue to-blue-600 text-white hover:scale-[1.02] shadow-blue-500/20'
                            } disabled:opacity-50`}
                    >
                        {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {isSaving ? '저장 중...' : saveSuccess ? '저장 완료!' : '설정 저장'}
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* LEFT COLUMN - Core Settings */}
                    <div className="col-span-8 flex flex-col gap-8">
                        {/* Persona Name */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-momentum-blue/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-momentum-blue" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">페르소나 이름</h3>
                                    <p className="text-xs text-white/40 mt-0.5">이 작가 캐릭터의 이름을 지어주세요</p>
                                </div>
                            </div>
                            <input
                                value={settings.persona_name}
                                onChange={(e) => setSettings({ ...settings, persona_name: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-lg font-bold focus:border-momentum-blue outline-none transition-all placeholder:text-white/20"
                                placeholder="예: LILYMAG 전문 작가"
                            />
                        </div>

                        {/* Tone Selection */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">글의 톤 (Tone)</h3>
                                    <p className="text-xs text-white/40 mt-0.5">전체적인 글의 분위기를 결정합니다</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {TONE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSettings({ ...settings, tone: opt.value })}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${settings.tone === opt.value
                                            ? 'bg-purple-500/15 border-purple-500/50 text-white'
                                            : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${settings.tone === opt.value ? 'border-purple-400 bg-purple-400' : 'border-white/20'}`}>
                                            {settings.tone === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{opt.label}</p>
                                            <p className="text-[11px] text-white/40 mt-0.5">{opt.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Writing Style */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">글쓰기 형식</h3>
                                    <p className="text-xs text-white/40 mt-0.5">글의 형식과 포맷을 선택합니다</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {WRITING_STYLE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSettings({ ...settings, writing_style: opt.value })}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${settings.writing_style === opt.value
                                            ? 'bg-blue-500/15 border-blue-500/50 text-white'
                                            : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${settings.writing_style === opt.value ? 'border-blue-400 bg-blue-400' : 'border-white/20'}`}>
                                            {settings.writing_style === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{opt.label}</p>
                                            <p className="text-[11px] text-white/40 mt-0.5">{opt.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Level */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <Type className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">어휘 수준</h3>
                                    <p className="text-xs text-white/40 mt-0.5">사용하는 어휘와 문장 복잡도를 결정합니다</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {LANGUAGE_LEVEL_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSettings({ ...settings, language_level: opt.value })}
                                        className={`flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all text-center ${settings.language_level === opt.value
                                            ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                                            : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5'
                                            }`}
                                    >
                                        <p className="text-sm font-bold">{opt.label}</p>
                                        <p className="text-[10px] text-white/40">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Opening & Closing Style */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                                <h3 className="text-lg font-bold mb-2">도입부 스타일</h3>
                                <p className="text-xs text-white/40 mb-5">글의 시작 방식</p>
                                <div className="flex flex-col gap-2">
                                    {OPENING_STYLE_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setSettings({ ...settings, opening_style: opt.value })}
                                            className={`p-3 rounded-xl border text-left text-xs transition-all ${settings.opening_style === opt.value
                                                ? 'bg-amber-500/15 border-amber-500/50 text-white font-bold'
                                                : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5'
                                                }`}
                                        >
                                            {opt.label}
                                            <span className="block text-[10px] text-white/30 mt-0.5">{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                                <h3 className="text-lg font-bold mb-2">마무리 스타일</h3>
                                <p className="text-xs text-white/40 mb-5">글의 끝맺음 방식</p>
                                <div className="flex flex-col gap-2">
                                    {CLOSING_STYLE_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setSettings({ ...settings, closing_style: opt.value })}
                                            className={`p-3 rounded-xl border text-left text-xs transition-all ${settings.closing_style === opt.value
                                                ? 'bg-rose-500/15 border-rose-500/50 text-white font-bold'
                                                : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5'
                                                }`}
                                        >
                                            {opt.label}
                                            <span className="block text-[10px] text-white/30 mt-0.5">{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Custom Instructions */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">자유 지시문 (Custom Instructions)</h3>
                                    <p className="text-xs text-white/40 mt-0.5">위 설정 외에 AI에게 추가로 전달할 세부 지시사항을 자유롭게 작성하세요</p>
                                </div>
                            </div>
                            <textarea
                                value={settings.custom_instructions}
                                onChange={(e) => setSettings({ ...settings, custom_instructions: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm h-48 focus:border-cyan-400 outline-none transition-all placeholder:text-white/15 resize-none leading-relaxed"
                                placeholder="예: 전문 플로리스트가 전문 작가를 초빙하여 작성하는 수준의 격조 높은 글을 작성합니다. 키워드와 관련된 인문학적 배경, 예술 작품, 추억, 음악, 영화, 여행지를 자연스럽게 연결하여 깊이 있는 매거진 에세이를 완성합니다."
                            />
                        </div>

                        {/* Sample Text */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                    <AlignLeft className="w-5 h-5 text-pink-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">레퍼런스 글 (Sample Text)</h3>
                                    <p className="text-xs text-white/40 mt-0.5">마음에 드셨던 글을 붙여넣으시면, AI가 그 문체를 학습합니다 (선택)</p>
                                </div>
                            </div>
                            <textarea
                                value={settings.sample_text}
                                onChange={(e) => setSettings({ ...settings, sample_text: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm h-60 focus:border-pink-400 outline-none transition-all placeholder:text-white/15 resize-none leading-relaxed"
                                placeholder="과거에 생성되었던 글 중 마음에 드는 글을 여기에 붙여넣으세요. AI가 이 글의 문체, 톤, 구조를 분석하여 유사한 스타일로 새로운 글을 작성합니다."
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Tags & Length */}
                    <div className="col-span-4 flex flex-col gap-8">
                        {/* Character Length */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                    <AlignLeft className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">글 분량</h3>
                                    <p className="text-xs text-white/40 mt-0.5">글자 수와 문단 수를 설정합니다</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="text-xs text-white/50 font-bold mb-2 block">최소 글자 수</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={500}
                                            max={5000}
                                            step={100}
                                            value={settings.min_length}
                                            onChange={(e) => setSettings({ ...settings, min_length: parseInt(e.target.value) })}
                                            className="flex-1 accent-orange-400"
                                        />
                                        <span className="text-lg font-bold text-orange-400 w-16 text-right">{settings.min_length}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-white/50 font-bold mb-2 block">최대 글자 수</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={1000}
                                            max={8000}
                                            step={100}
                                            value={settings.max_length}
                                            onChange={(e) => setSettings({ ...settings, max_length: parseInt(e.target.value) })}
                                            className="flex-1 accent-orange-400"
                                        />
                                        <span className="text-lg font-bold text-orange-400 w-16 text-right">{settings.max_length}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-white/50 font-bold mb-2 block">문단 수</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={3}
                                            max={12}
                                            step={1}
                                            value={settings.paragraph_count}
                                            onChange={(e) => setSettings({ ...settings, paragraph_count: parseInt(e.target.value) })}
                                            className="flex-1 accent-orange-400"
                                        />
                                        <span className="text-lg font-bold text-orange-400 w-16 text-right">{settings.paragraph_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Must Include Topics */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <ListChecks className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">필수 연결 주제</h3>
                                    <p className="text-xs text-white/40 mt-0.5">글에 반드시 등장해야 할 주제 영역</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {settings.must_include_topics.map(topic => (
                                    <span key={topic} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/15 border border-green-500/30 text-sm text-green-300 font-medium">
                                        {topic}
                                        <button onClick={() => removeTopic(topic)} className="hover:text-red-400 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mb-4">
                                <input
                                    value={newTopic}
                                    onChange={(e) => setNewTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTopic(newTopic)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-green-400 outline-none transition-all placeholder:text-white/20"
                                    placeholder="주제 추가..."
                                />
                                <button onClick={() => addTopic(newTopic)} className="px-4 py-2.5 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-xs font-bold hover:bg-green-500/30 transition-all">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {SUGGESTED_TOPICS.filter(t => !settings.must_include_topics.includes(t)).map(topic => (
                                    <button
                                        key={topic}
                                        onClick={() => addTopic(topic)}
                                        className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] text-white/30 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                                    >
                                        + {topic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Forbidden Elements */}
                        <div className="glass-card p-8 bg-white/[0.02] border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <Ban className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">금지 요소</h3>
                                    <p className="text-xs text-white/40 mt-0.5">글에서 절대 사용하지 말아야 할 것들</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {settings.forbidden_elements.map(item => (
                                    <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-sm text-red-300 font-medium">
                                        {item}
                                        <button onClick={() => removeForbidden(item)} className="hover:text-white transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mb-4">
                                <input
                                    value={newForbidden}
                                    onChange={(e) => setNewForbidden(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addForbidden(newForbidden)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 outline-none transition-all placeholder:text-white/20"
                                    placeholder="금지 요소 추가..."
                                />
                                <button onClick={() => addForbidden(newForbidden)} className="px-4 py-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs font-bold hover:bg-red-500/30 transition-all">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {SUGGESTED_FORBIDDEN.filter(f => !settings.forbidden_elements.includes(f)).map(item => (
                                    <button
                                        key={item}
                                        onClick={() => addForbidden(item)}
                                        className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] text-white/30 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                                    >
                                        + {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preview Card */}
                        <div className="glass-card p-8 bg-gradient-to-br from-momentum-blue/10 via-transparent to-purple-500/5 border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-momentum-blue mb-4">현재 설정 요약</h3>
                            <div className="flex flex-col gap-2 text-xs text-white/50">
                                <div className="flex justify-between"><span>페르소나</span><span className="font-bold text-white">{settings.persona_name}</span></div>
                                <div className="flex justify-between"><span>톤</span><span className="font-bold text-purple-300">{TONE_OPTIONS.find(t => t.value === settings.tone)?.label}</span></div>
                                <div className="flex justify-between"><span>형식</span><span className="font-bold text-blue-300">{WRITING_STYLE_OPTIONS.find(s => s.value === settings.writing_style)?.label}</span></div>
                                <div className="flex justify-between"><span>어휘</span><span className="font-bold text-emerald-300">{LANGUAGE_LEVEL_OPTIONS.find(l => l.value === settings.language_level)?.label}</span></div>
                                <div className="flex justify-between"><span>분량</span><span className="font-bold text-orange-300">{settings.min_length}~{settings.max_length}자 / {settings.paragraph_count}문단</span></div>
                                <div className="flex justify-between"><span>필수 주제</span><span className="font-bold text-green-300">{settings.must_include_topics.length}개</span></div>
                                <div className="flex justify-between"><span>금지 요소</span><span className="font-bold text-red-300">{settings.forbidden_elements.length}개</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PersonaSettings;
