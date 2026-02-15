import React from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import {
    TrendingUp,
    Layers,
    Users,
    Zap,
    Sparkles,
    ArrowRight,
    Plus,
    Activity,
    BrainCircuit,
    Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

import { LILYMAG_BRAIN_CONTEXT } from '../data/aiBrainContext';
import { getDashboardStats, getActivityLogs } from '../lib/supabaseClient';

const IconMap: Record<string, any> = {
    'TrendingUp': TrendingUp,
    'Layers': Layers,
    'Users': Users,
    'Zap': Zap,
    'Sparkles': Sparkles
};

const initialStats = [
    { label: '매출 성장률', value: '+24%', trend: '12%', isPositive: true, icon: TrendingUp, color: 'green' as const },
    { label: 'AI 생성 콘텐츠', value: '156개', trend: '8%', isPositive: true, icon: Layers, color: 'blue' as const },
    { label: '소셜 참여도', value: '5.2k', trend: '15%', isPositive: true, icon: Users, color: 'purple' as const },
    { label: '활성 워크플로우', value: '12개', trend: '2%', isPositive: false, icon: Zap, color: 'gold' as const },
];

const initialActivity = [
    { agent: '블로그 에디터', action: '새로운 전문가 칼럼 발행: "플로럴 아트 30년의 기록"', time: '2시간 전', status: 'done' },
    { agent: '비디오 PD', action: '인스타그램 발렌타인 캠페인용 릴스 5개 생성 완료', time: '4시간 전', status: 'done' },
    { agent: '공간 분석 AI', action: '고객 공간 사진 12건 스타일링 분석 진행 중', time: '6시간 전', status: 'processing' },
];

interface DashboardProps {
    onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [stats, setStats] = React.useState(initialStats);
    const [activity, setActivity] = React.useState(initialActivity);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const fetchedStats = await getDashboardStats();
                if (fetchedStats && fetchedStats.length > 0) {
                    const mappedStats = fetchedStats.map((s: any) => ({
                        label: s.label,
                        value: s.value,
                        trend: s.trend_value,
                        isPositive: s.is_positive,
                        icon: IconMap[s.icon_name] || Zap,
                        color: s.color as any
                    }));
                    setStats(mappedStats);
                }

                const fetchedLogs = await getActivityLogs();
                if (fetchedLogs && fetchedLogs.length > 0) {
                    const mappedLogs = fetchedLogs.map((l: any) => ({
                        agent: l.agent_name,
                        action: l.action_text,
                        time: new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: l.status
                    }));
                    setActivity(mappedLogs);
                }
            } catch (error) {
                console.error("Dashboard fetch error", error);
            }
        }
        fetchData();
    }, []);
    return (
        <Layout onNavigate={onNavigate} currentPage="dashboard">
            <div className="p-10 flex flex-col gap-10 max-w-[1600px] mx-auto">
                {/* Welcome Section */}
                <div className="flex items-end justify-between">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-3"
                        >
                            <div className="flex -space-x-1">
                                <div className="w-6 h-6 rounded-full bg-momentum-blue flex items-center justify-center border-2 border-[#050B18]">
                                    <Cpu className="w-3 h-3 text-white" />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-momentum-accent flex items-center justify-center border-2 border-[#050B18]">
                                    <BrainCircuit className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Momentum Neural Core v2.0</span>
                        </motion.div>
                        <h2 className="text-6xl font-bold font-outfit tracking-tight leading-tight">
                            어서 오세요, <span className="premium-gradient-text tracking-tighter">대표님</span>.
                        </h2>
                        <p className="text-white/40 mt-4 text-xl font-medium leading-relaxed max-w-2xl">
                            릴리맥의 <span className="text-white/80 font-bold">{LILYMAG_BRAIN_CONTEXT.philosophy.split(',')[1] || '30년 전통'}</span>의 가치를
                            AI 에이전트들이 오늘도 완벽하게 디지털로 전환하고 있습니다.
                        </p>
                    </div>

                    <button className="group flex items-center gap-3 bg-gradient-to-r from-momentum-blue via-blue-500 to-momentum-accent px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all text-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <Plus className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">캠페인 큐레이팅</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-10">
                    {/* Chart Section */}
                    <div className="col-span-8 glass-card p-10 flex flex-col gap-10 overflow-hidden relative min-h-[500px] border-white/5 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-momentum-blue" />
                                    <h3 className="text-3xl font-bold font-outfit tracking-tight">마케팅 모멘텀 인덱스</h3>
                                </div>
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black">Performance Tracking Node</p>
                            </div>
                            <div className="flex gap-2 bg-[#050B18] p-1.5 rounded-2xl border border-white/10 shadow-inner">
                                <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Monthly</button>
                                <button className="px-6 py-2.5 bg-momentum-blue/20 text-momentum-blue border border-momentum-blue/20 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Weekly</button>
                            </div>
                        </div>

                        <div className="flex-1 flex items-end justify-between px-6 pb-6 gap-3 relative">
                            {[45, 67, 43, 89, 56, 92, 78].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
                                    <div className="w-full relative flex flex-col items-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                                            className="w-full max-w-[80px] bg-gradient-to-t from-momentum-blue/20 via-momentum-blue to-momentum-accent/40 rounded-t-[1.5rem] relative shadow-lg shadow-blue-500/5 group-hover:brightness-125 group-hover:shadow-blue-500/20 transition-all cursor-pointer"
                                        >
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-momentum-deep text-[11px] font-black px-4 py-2 rounded-xl scale-0 group-hover:scale-100 transition-all shadow-2xl whitespace-nowrap z-20">
                                                INDEX {h}%
                                            </div>
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-[1.5rem]"></div>
                                        </motion.div>
                                    </div>
                                    <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                    </span>
                                </div>
                            ))}
                            {/* Background Grid Lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                                <div key={p} className="absolute inset-x-0 h-px bg-white/5 pointer-events-none" style={{ bottom: `${p * 100}%` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="col-span-4 glass-card p-10 flex flex-col gap-10 bg-[#050B18]/40 border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-2xl font-bold font-outfit uppercase tracking-tight">Neural Log</h3>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Live Activity</p>
                            </div>
                            <button className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-momentum-blue hover:bg-white/10 transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-10 relative">
                            <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-momentum-blue/50 via-white/5 to-transparent"></div>
                            {activity.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-6 group relative"
                                >
                                    <div className="relative z-10">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-[#050B18] ${item.status === 'done' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-momentum-gold animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.3)]'}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-momentum-blue uppercase tracking-widest">{item.agent}</span>
                                            <span className="text-[10px] font-bold text-white/20">{item.time}</span>
                                        </div>
                                        <p className="text-[15px] text-white/90 leading-snug font-medium group-hover:text-white transition-colors">{item.action}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto p-10 rounded-[2.5rem] bg-momentum-gold/5 border border-momentum-gold/20 relative overflow-hidden group hover:border-momentum-gold/40 transition-all">
                            <div className="absolute top-0 left-0 w-2 h-full bg-momentum-gold shadow-[0_0_20px_rgba(234,179,8,0.2)]"></div>
                            <div className="flex items-center gap-2 text-momentum-gold mb-4">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">AI 전략 비서 '고다리'</span>
                            </div>
                            <p className="text-sm font-bold text-white/80 leading-relaxed italic group-hover:text-white transition-colors">
                                "주말 지역별 꽃 소비 패턴을 분석한 결과, 선물용 미니 꽃다발의 수요가 12% 증가할 것으로 예측됩니다. 자동화 흐름에 관련 앱 푸시를 예약해두었습니다."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
