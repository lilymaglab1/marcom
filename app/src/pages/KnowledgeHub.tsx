import React from 'react';
import Layout from '../components/layout/Layout';
import PersonaSettings from '../components/knowledge/PersonaSettings';
import {
    Globe,
    FileText,
    Cloud,
    RefreshCw,
    ShieldCheck,
    ExternalLink,
    ChevronRight,
    Database,
    Sparkles,
    Search,
    Plus,
    BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LILYMAG_BRAIN_CONTEXT } from '../data/aiBrainContext';

interface KnowledgeHubProps {
    onNavigate: (page: string) => void;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ onNavigate }) => {
    const [isSyncing, setIsSyncing] = React.useState(false);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    return (
        <Layout onNavigate={onNavigate} currentPage="knowledge">
            <div className="p-10 flex flex-col gap-10 max-w-[1600px] mx-auto">
                {/* 헤더 섹션 */}
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Database className="w-5 h-5 text-momentum-blue" />
                            <span className="text-xs font-black text-momentum-blue uppercase tracking-[0.2em]">Momentum Intelligence Brain</span>
                        </motion.div>
                        <h2 className="text-5xl font-bold font-outfit tracking-tight leading-tight">지식 허브</h2>
                        <p className="text-white/40 text-lg mt-1">당신의 비즈니스 데이터를 모멘텀 브레인에 입력하여 특화된 AI 에이전트를 학습시키세요.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSync}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all text-white/60 hover:text-white"
                        >
                            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                            지식 그래프 시각화
                        </button>
                        <button className="flex items-center gap-2 bg-gradient-to-r from-momentum-blue to-blue-500 px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all text-white">
                            <Plus className="w-5 h-5" />
                            새로운 지식 추가
                        </button>
                    </div>
                </div>

                {/* 핵심 데이터 관리 카드 */}
                <div className="grid grid-cols-3 gap-8">
                    <div className="glass-card p-10 flex flex-col gap-6 group hover:border-momentum-blue/50 transition-all">
                        <div className="w-16 h-16 bg-momentum-blue/20 rounded-2xl flex items-center justify-center text-momentum-blue group-hover:scale-110 transition-transform">
                            <Globe className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold font-outfit">웹사이트 크롤링</h3>
                            <p className="text-white/40 leading-relaxed font-medium">웹사이트 또는 블로그 전체를 실시간으로 동기화합니다.</p>
                        </div>
                        <button className="text-xs font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 group-hover:text-momentum-blue transition-colors mt-2">
                            Get Started <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="glass-card p-10 flex flex-col gap-6 group hover:border-momentum-accent/50 transition-all">
                        <div className="w-16 h-16 bg-momentum-accent/20 rounded-2xl flex items-center justify-center text-momentum-accent group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold font-outfit">파일 업로드</h3>
                            <p className="text-white/40 leading-relaxed font-medium">PDF, DOCX 또는 텍스트 문서를 직접 학습시킵니다.</p>
                        </div>
                        <button className="text-xs font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 group-hover:text-momentum-accent transition-colors mt-2">
                            Get Started <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="glass-card p-10 flex flex-col gap-6 group hover:border-purple-500/50 transition-all">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <Cloud className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold font-outfit">클라우드 연동</h3>
                            <p className="text-white/40 leading-relaxed font-medium">구글 드라이브 또는 드롭박스의 폴더를 구독합니다.</p>
                        </div>
                        <button className="text-xs font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 group-hover:text-purple-500 transition-colors mt-2">
                            Get Started <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-8 flex flex-col gap-10">
                        {/* 활성 소스 테이블 */}
                        <div className="glass-card p-0 overflow-hidden flex flex-col bg-[#050B18]/40 border-white/5 shadow-inner">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-bold font-outfit">활성 지식 소스</h3>
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest">4 Total</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2" />
                                        <input type="text" placeholder="소스 검색..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-6 text-sm focus:outline-none focus:border-momentum-blue/50 transition-all w-64" />
                                    </div>
                                    <button className="p-2.5 bg-momentum-blue/10 text-momentum-blue rounded-xl flex items-center gap-2 font-bold text-xs">
                                        <RefreshCw className="w-3.5 h-3.5" /> 전체 동기화
                                    </button>
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] text-[11px] font-black text-white/20 uppercase tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-5">Source Name</th>
                                        <th className="px-8 py-5">Type</th>
                                        <th className="px-8 py-5">Date Added</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium">
                                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-momentum-blue/10 rounded-xl flex items-center justify-center text-momentum-blue">
                                                    <Globe className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">공식 웹사이트 (lilymag.com)</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white/40">URL</td>
                                        <td className="px-8 py-6 text-white/40 font-outfit">2026-02-12</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-momentum-gold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">동기화됨</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-momentum-accent/10 rounded-xl flex items-center justify-center text-momentum-accent">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">브랜드 전략_2026.pdf</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white/40">PDF</td>
                                        <td className="px-8 py-6 text-white/40 font-outfit">2026-02-12</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-momentum-gold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">동기화됨</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-momentum-blue/10 rounded-xl flex items-center justify-center text-momentum-blue">
                                                    <Globe className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">전문가 칼럼 모음집</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white/40">URL</td>
                                        <td className="px-8 py-6 text-white/40 font-outfit">2026-02-11</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-momentum-gold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">동기화됨</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-momentum-accent/10 rounded-xl flex items-center justify-center text-momentum-accent">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">제품_카탈로그_봄시즌.pdf</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white/40">PDF</td>
                                        <td className="px-8 py-6 text-white/40 font-outfit">2026-02-10</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-momentum-blue animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">인덱싱 중</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 페르소나 설정 섹션 추가 */}
                        <PersonaSettings />
                    </div>

                    {/* AI 인사이트 카드 */}
                    <div className="col-span-4 flex flex-col gap-8">
                        <div className="glass-card p-10 flex flex-col gap-8 border-momentum-blue/20 bg-momentum-blue/5">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-7 h-7 text-momentum-blue" />
                                <h3 className="text-2xl font-bold font-outfit uppercase tracking-tight">AI 전략 제언</h3>
                            </div>

                            <div className="flex flex-col gap-10">
                                <div className="p-8 bg-[#050B18] rounded-[2rem] border border-white/5 relative group hover:border-momentum-blue/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-momentum-blue uppercase tracking-widest">핵심 슬로건 제안</span>
                                        <div className="w-2 h-2 rounded-full bg-momentum-blue animate-ping"></div>
                                    </div>
                                    <p className="text-lg font-bold text-white/90 leading-relaxed mb-4">
                                        "{LILYMAG_BRAIN_CONTEXT.usps[0].description.split('.')[0]}을 위한 마케팅 키워드 도출"
                                    </p>
                                    <p className="text-sm text-white/40 leading-relaxed italic">
                                        "{LILYMAG_BRAIN_CONTEXT.philosophy}" 철학을 반영한 고관여 카피라이팅이 필요합니다.
                                    </p>
                                </div>

                                <div className="p-8 bg-[#050B18] rounded-[2rem] border border-white/5 group hover:border-momentum-accent/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-momentum-accent uppercase tracking-widest">데이터 기반 소구점</span>
                                        <BarChart3 className="w-4 h-4 text-momentum-accent" />
                                    </div>
                                    <p className="text-sm text-white/80 leading-relaxed">
                                        {LILYMAG_BRAIN_CONTEXT.usps[1].title}: 30년 B2B 경험{LILYMAG_BRAIN_CONTEXT.usps[1].description.split('30년 노하우')[1]}
                                    </p>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-white text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-momentum-blue hover:text-white transition-all transform active:scale-95">
                                고다리 부장에게 리포트 받기
                            </button>
                        </div>

                        {/* 전문가 분석 카드 추가 */}
                        <div className="glass-card p-8 border-momentum-gold/20 bg-momentum-gold/5 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ShieldCheck className="w-20 h-20" />
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-6 h-6 text-momentum-gold" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-momentum-gold">Momentum Expert Insight</span>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed font-medium">
                                업로드된 릴리맥 마케팅 자동화 기획안을 바탕으로 분석된 데이터입니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default KnowledgeHub;
