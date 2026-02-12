import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-20 border-b border-momentum-border bg-momentum-deep/20 backdrop-blur-lg flex items-center justify-between px-10 sticky top-0 z-40">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-96">
                <Search className="w-4 h-4 text-white/40" />
                <input
                    type="text"
                    placeholder="AI 에이전트, 캠페인 또는 지식 검색..."
                    className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/20 w-full"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
                    <Bell className="w-5 h-5 text-white/60" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-momentum-gold rounded-full border border-momentum-deep"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-momentum-border">
                    <div className="text-right">
                        <p className="text-xs font-bold font-outfit">릴리맥 오야님</p>
                        <p className="text-[10px] text-momentum-gold font-medium">Momentum Pro 회원</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-momentum-blue to-momentum-accent p-[1px]">
                        <div className="w-full h-full rounded-full bg-momentum-deep flex items-center justify-center">
                            <User className="w-5 h-5 text-white/80" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
