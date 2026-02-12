import React from 'react';
import {
    LayoutDashboard,
    Database,
    PenTool,
    Zap,
    BarChart3,
    Settings,
    HelpCircle,
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'knowledge', label: '지식 허브', icon: Database },
    { id: 'studio', label: 'AI 스튜디오', icon: PenTool },
    { id: 'automation', label: '자동화 흐름', icon: Zap },
    { id: 'analytics', label: '성과 분석', icon: BarChart3 },
    { id: 'academy', label: '마케팅 비법서', icon: HelpCircle },
];

interface SidebarProps {
    onNavigate: (page: string) => void;
    currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage }) => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-[#050B18]/60 border-r border-white/5 backdrop-blur-3xl flex flex-col p-8 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 mb-14 px-1 cursor-pointer group"
                onClick={() => onNavigate('dashboard')}
            >
                <div className="w-12 h-12 bg-gradient-to-br from-momentum-blue to-momentum-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:rotate-12 transition-transform duration-500">
                    <Sparkles className="text-white w-7 h-7" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black font-outfit premium-gradient-text tracking-tighter leading-none">MOMENTUM</h1>
                    <span className="text-[9px] font-bold text-white/30 tracking-[0.3em] mt-1 ml-0.5 uppercase">Intelligence</span>
                </div>
            </motion.div>

            <nav className="flex-1 flex flex-col gap-3">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-4 ml-4">Main Navigation</p>
                {menuItems.map((item, idx) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onNavigate(item.id)}
                        className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${currentPage === item.id
                            ? 'bg-momentum-blue text-white shadow-lg shadow-blue-500/20'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${currentPage === item.id ? 'text-white' : 'text-current'}`} />
                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            <div className="pt-8 border-t border-white/5 flex flex-col gap-3">
                <button className="flex items-center gap-4 px-5 py-3 text-white/30 hover:text-white transition-colors group" onClick={() => onNavigate('settings')}>
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-sm font-bold">설정</span>
                </button>
                <button className="flex items-center gap-4 px-5 py-3 text-white/30 hover:text-white transition-colors group">
                    <HelpCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-bold">고객 지원</span>
                </button>

                <div className="mt-10 p-5 rounded-[2rem] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-white/5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-momentum-blue/10 blur-3xl rounded-full"></div>
                    <p className="text-[11px] font-black text-momentum-blue mb-1 uppercase tracking-widest">Momentum Pro</p>
                    <p className="text-[10px] text-white/40 mb-5 leading-relaxed font-medium">AI 마케팅의 모든 권한을 잠금 해제하고 매출 한계를 넘으세요.</p>
                    <button className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-momentum-blue hover:text-white transition-all transform active:scale-95">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
