import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
    label: string;
    value: string | number;
    delta?: { value: number; direction: 'up' | 'down' };
    tone?: 'default' | 'success' | 'warning' | 'danger';
    icon?: LucideIcon;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, delta, tone = 'default', icon: Icon }) => {
    const toneClasses = {
        default: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800',
        success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
        warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
        danger: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20',
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between min-h-[90px] shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center justify-between gap-2 overflow-hidden">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 truncate leading-none">
                    {label}
                </span>
                {Icon && (
                    <div className={`p-1.5 rounded-lg transition-colors ${toneClasses[tone]}`}>
                        <Icon size={14} strokeWidth={2.5} />
                    </div>
                )}
            </div>

            <div className="flex items-end justify-between mt-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tighter truncate">
                    {value}
                </h3>

                {delta && (
                    <div className={`flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${delta.direction === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                        }`}>
                        {delta.direction === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {delta.value}%
                    </div>
                )}
            </div>
        </div>
    );
};

export default KpiCard;
