import React from 'react';
import Layout from '../components/layout/Layout';
import {
    BarChart3,
    TrendingUp,
    Target,
    Users,
    Download,
    Calendar,
    Filter,
    ArrowUpRight,
    PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';

const metrics = [
    { label: '총 노출수', value: '458.2k', trend: '+12.5%', isPos: true },
    { label: '전환율', value: '4.82%', trend: '+0.5%', isPos: true },
    { label: '신규 고객', value: '1,245명', trend: '-2.1%', isPos: false },
    { label: '광고 수익률(ROAS)', value: '820%', trend: '+45%', isPos: true },
];

interface AnalyticsProps {
    onNavigate: (page: string) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
    return (
        <Layout onNavigate={onNavigate} currentPage="analytics">
            <div className="p-10 flex flex-col gap-10 max-w-[1600px] mx-auto">
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <BarChart3 className="w-5 h-5 text-momentum-blue" />
                            <span className="text-xs font-black text-momentum-blue uppercase tracking-[0.2em]">Momentum Performance Analytics</span>
                        </motion.div>
                        <h2 className="text-5xl font-bold font-outfit tracking-tight leading-tight">성과 분석</h2>
                        <p className="text-white/40 text-lg mt-1">AI 에이전트들이 벌어들인 데이터 수익을 실시간으로 추적합니다.</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all text-white/60">
                            <Calendar className="w-4 h-4" />
                            최근 30일
                        </button>
                        <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl hover:bg-momentum-blue hover:text-white transition-all">
                            <Download className="w-4 h-4" />
                            보고서 다운로드
                        </button>
                    </div>
                </div>

                {/* Top Metrics */}
                <div className="grid grid-cols-4 gap-6">
                    {metrics.map((m, idx) => (
                        <motion.div
                            key={m.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-8 flex flex-col gap-4 group"
                        >
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                                {m.label}
                                <div className={`flex items-center gap-1 ${m.isPos ? 'text-green-500' : 'text-red-500'}`}>
                                    {m.trend}
                                    <ArrowUpRight className={`w-3 h-3 ${m.isPos ? '' : 'rotate-90'}`} />
                                </div>
                            </div>
                            <div className="text-4xl font-black font-outfit premium-gradient-text">{m.value}</div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                                <div className={`h-full bg-momentum-blue ${m.isPos ? 'w-full' : 'w-2/3'}`}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Detailed Chart Area */}
                    <div className="col-span-8 glass-card p-10 flex flex-col gap-10 min-h-[500px] relative overflow-hidden">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <h3 className="text-2xl font-bold font-outfit text-white">채널별 도달률</h3>
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-white/40"><div className="w-2 h-2 rounded-full bg-momentum-blue"></div> 블로그</span>
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-white/40"><div className="w-2 h-2 rounded-full bg-momentum-gold"></div> 인스타그램</span>
                                </div>
                            </div>
                            <button className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                                <Filter className="w-5 h-5 text-white/40" />
                            </button>
                        </div>

                        <div className="flex-1 flex items-end gap-2 relative">
                            {/* Mock Chart Visualization */}
                            {[30, 50, 45, 80, 65, 90, 75, 40, 60, 85, 95, 70].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col gap-1">
                                    <div className="flex-1 flex flex-col justify-end gap-1">
                                        <div className="w-full bg-momentum-blue/40 rounded-t-md hover:bg-momentum-blue transition-all" style={{ height: `${h}%` }}></div>
                                        <div className="w-full bg-momentum-gold/40 rounded-t-md hover:bg-momentum-gold transition-all" style={{ height: `${h / 2}%` }}></div>
                                    </div>
                                    <span className="text-[8px] font-bold text-white/10 text-center uppercase tracking-tighter">{i + 1}월</span>
                                </div>
                            ))}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-10">
                                {[100, 75, 50, 25, 0].map(v => (
                                    <div key={v} className="flex items-center gap-4 w-full">
                                        <span className="text-[9px] font-bold text-white/10 w-8">{v}k</span>
                                        <div className="flex-1 h-px bg-white/5"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Insights and Distributions */}
                    <div className="col-span-4 flex flex-col gap-8">
                        <div className="glass-card p-8 flex flex-col gap-8">
                            <div className="flex items-center gap-3">
                                <PieChart className="w-6 h-6 text-momentum-blue" />
                                <h3 className="text-xl font-bold font-outfit">콘텐츠 효율 분포</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                {[
                                    { l: '교육형 칼럼', v: 45, c: 'bg-momentum-blue' },
                                    { l: '이벤트 홍보', v: 30, c: 'bg-momentum-gold' },
                                    { l: '고객 성공 사례', v: 15, c: 'bg-purple-500' },
                                    { l: '기타', v: 10, c: 'bg-white/20' },
                                ].map(item => (
                                    <div key={item.l} className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-white/60">{item.l}</span>
                                            <span>{item.v}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.v}%` }}
                                                className={`h-full ${item.c}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-8 bg-gradient-to-br from-momentum-blue/20 to-transparent border-momentum-blue/30 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="w-8 h-8 text-momentum-blue" />
                                <h4 className="text-xl font-black font-outfit tracking-tighter">AI 전략 제언</h4>
                            </div>
                            <p className="text-base font-bold text-white/90 leading-relaxed">
                                "현재 <strong>'교육형 칼럼'</strong>의 참여율이 '이벤트'보다 3배 이상 높습니다. 다음 주 광고 예산의 20%를 칼럼형 콘텐츠로 전용하여 CPA를 15% 낮출 것을 추천합니다."
                            </p>
                            <button className="mt-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-momentum-blue hover:text-white transition-all shadow-2xl">
                                에이전트에게 전략 적용 지시
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Analytics;
