import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    label: string;
    value: string;
    trend: string;
    isPositive: boolean;
    icon: LucideIcon;
    color: 'green' | 'blue' | 'purple' | 'gold';
}

const colorMap = {
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    gold: 'text-momentum-gold bg-momentum-gold/10 border-momentum-gold/20',
};

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, isPositive, icon: Icon, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col gap-4 group"
        >
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-white/40 mb-1">{label}</p>
                <p className="text-3xl font-bold font-outfit premium-gradient-text tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;
