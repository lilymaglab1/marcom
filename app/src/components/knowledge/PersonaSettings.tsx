import React, { useState } from 'react';
import { UserCircle, Sliders, MessageSquare, Volume2, Save, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PersonaSettings = () => {
    const [tone, setTone] = useState(50);
    const [creativity, setCreativity] = useState(70);

    return (
        <div className="glass-card p-8 flex flex-col gap-8 bg-white/[0.01]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-momentum-blue/20 text-momentum-blue flex items-center justify-center">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-outfit">AI 페르소나 튜닝</h3>
                        <p className="text-xs text-white/30 uppercase tracking-widest mt-1">Agent Personality & Voice</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-2 bg-momentum-blue rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    <Save className="w-4 h-4" />
                    설정 저장
                </button>
            </div>

            <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">말투 톤 (Tone of Voice)</label>
                            <span className="text-xs font-bold text-momentum-blue">{tone < 40 ? '정중함' : tone < 70 ? '친근함' : '장난스러움'}</span>
                        </div>
                        <input
                            type="range" min="0" max="100" value={tone}
                            onChange={(e) => setTone(parseInt(e.target.value))}
                            className="w-full accent-momentum-blue bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                            <span>Formal</span>
                            <span>Neutral</span>
                            <span>Casual</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">창의성 수치 (Creativity)</label>
                            <span className="text-xs font-bold text-momentum-gold">{creativity}%</span>
                        </div>
                        <input
                            type="range" min="0" max="100" value={creativity}
                            onChange={(e) => setCreativity(parseInt(e.target.value))}
                            className="w-full accent-momentum-gold bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                            <span>Stable</span>
                            <span>Balanced</span>
                            <span>Innovative</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-white/40">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">응답 미리보기</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed italic text-white/80">
                            "{tone > 60 ? '안녕! 오늘 기분 최고인데? 이번 프로젝트 진짜 잘 될 것 같아!' : '안녕하십니까. 요청하신 프로젝트 분석 보고서를 전달해 드립니다.'}"
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">핵심 가치 키워드</label>
                        <div className="flex flex-wrap gap-2">
                            {['신뢰', '혁신', '사람 중심', '기술 선도', '프리미엄'].map(tag => (
                                <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-momentum-blue hover:border-momentum-blue transition-all cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                            <button className="px-3 py-1.5 rounded-lg bg-momentum-blue/10 border border-momentum-blue/20 text-[10px] font-bold text-momentum-blue">
                                + 추가
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonaSettings;
