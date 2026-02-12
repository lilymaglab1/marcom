import React from 'react';
import Layout from '../components/layout/Layout';
import {
    Zap,
    Settings,
    Play,
    Clock,
    ChevronRight,
    Plus,
    Share2,
    Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const workflows = [
    { id: 1, name: 'AI 콘텐츠 n8n 자동 배포 (인스타/블로그)', triggers: 'Webhook (Instant)', status: 'active', apps: ['n8n', 'Instagram', 'Naver'] },
    { id: 2, name: '월간 성과 리포트 자동 발신', triggers: '매월 1일', status: 'active', apps: ['Email', 'Slack'] },
    { id: 3, name: '기념일 고객 자동 혜택 발송', triggers: '고객 데이터 매칭', status: 'paused', apps: ['CRM', 'SMS'] },
];

interface AutomationProps {
    onNavigate: (page: string) => void;
}

const Automation: React.FC<AutomationProps> = ({ onNavigate }) => {
    return (
        <Layout onNavigate={onNavigate} currentPage="automation">
            <div className="p-10 flex flex-col gap-10 max-w-[1600px] mx-auto">
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Zap className="w-5 h-5 text-momentum-blue" />
                            <span className="text-xs font-black text-momentum-blue uppercase tracking-[0.2em]">Momentum Automation Engine (n8n Base)</span>
                        </motion.div>
                        <h2 className="text-5xl font-bold font-outfit tracking-tight leading-tight">자동화 흐름</h2>
                        <p className="text-white/40 text-lg mt-1">n8n 기반의 고성능 마케팅 파이프라인이 24시간 쉬지 않고 작동합니다.</p>
                    </div>

                    <button className="flex items-center gap-2 bg-gradient-to-r from-momentum-blue to-blue-500 px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all text-white">
                        <Plus className="w-5 h-5" />
                        새 워크플로우 만들기
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-8 flex flex-col gap-6">
                        {workflows.map((flow, idx) => (
                            <motion.div
                                key={flow.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card p-8 flex items-center justify-between group hover:border-momentum-blue/50"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${flow.status === 'active' ? 'bg-momentum-blue/20 text-momentum-blue animate-pulse' : 'bg-white/5 text-white/20'}`}>
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xl font-bold font-outfit">{flow.name}</h3>
                                        <div className="flex items-center gap-4 text-xs font-medium text-white/30">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {flow.triggers}</span>
                                            <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {flow.apps.join(' + ')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${flow.status === 'active' ? 'text-green-500' : 'text-white/20'}`}>
                                            {flow.status === 'active' ? 'Optimized' : 'Paused'}
                                        </span>
                                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full bg-current ${flow.status === 'active' ? 'w-full text-green-500' : 'w-0'}`}></div>
                                        </div>
                                    </div>
                                    <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 bg-white text-black rounded-xl hover:bg-momentum-blue hover:text-white transition-all shadow-lg">
                                        <Play className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {/* 상세 상태 보드 */}
                        <div className="glass-card p-8 flex flex-col gap-6 bg-white/[0.01]">
                            <h4 className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">Webhook Node Status</h4>
                            <div className="flex items-center gap-10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-white/30">Target URL</span>
                                    <code className="text-xs text-momentum-blue">https://n8n.lilymag.com/webhook/publish</code>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-white/30">Success Rate</span>
                                    <span className="text-sm font-bold text-green-500">99.8%</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-white/30">Last Sync</span>
                                    <span className="text-sm font-bold text-white/60">방금 전</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-4 flex flex-col gap-8">
                        <div className="glass-card p-8 flex flex-col gap-6">
                            <h3 className="text-xl font-bold font-outfit">커넥티드 리빙 허브</h3>
                            <p className="text-xs text-white/40 leading-relaxed">Momentum AI와 n8n으로 연결된 외부 채널입니다.</p>
                            <div className="flex flex-col gap-4">
                                {['n8n Engine', 'Instagram Biz', 'Naver Blog API', 'Slack HQ', 'Google Drive'].map(app => (
                                    <div key={app} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-momentum-blue/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-momentum-blue/10 flex items-center justify-center text-momentum-blue text-[10px] font-black">
                                                {app.split(' ')[0]}
                                            </div>
                                            <span className="text-sm font-bold text-white/80">{app}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Linked</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-4 mt-2 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                                API 설정 및 연동 관리
                            </button>
                        </div>

                        <div className="glass-card p-8 bg-gradient-to-br from-momentum-gold/10 to-transparent border-momentum-gold/20">
                            <div className="flex items-center gap-2 text-momentum-gold mb-4">
                                <Bell className="w-5 h-5" />
                                <h4 className="text-xs font-black uppercase tracking-widest">고다리 부장의 리포트</h4>
                            </div>
                            <p className="text-sm font-bold text-white/90 leading-normal">
                                "n8n 워크플로우를 통한 자동 발행 점유율이 85%를 달성했습니다. 이제 모든 SNS 채널이 릴리맥의 30년 전통 톤앤매너를 일관되게 유지하고 있습니다."
                            </p>
                            <button className="mt-6 text-[10px] font-black text-momentum-gold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                최적화 리포트 전문 보기 <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Automation;
