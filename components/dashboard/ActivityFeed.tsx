import React from 'react';
import { Box, User, Clipboard, AlertCircle } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'os' | 'lead' | 'contract' | 'system';
    title: string;
    meta: string;
    timeAgo: string;
    status?: 'success' | 'warning' | 'danger' | 'info';
}

interface ActivityFeedProps {
    items: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => {
    const iconMap = {
        os: { icon: Clipboard, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
        lead: { icon: User, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
        contract: { icon: Box, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
        system: { icon: AlertCircle, bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
    };

    return (
        <div className="flex flex-col gap-3">
            {items.length === 0 ? (
                <div className="py-8 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nenhuma atividade recente</p>
                </div>
            ) : (
                items.map((item) => {
                    const config = iconMap[item.type] || iconMap.system;
                    const Icon = config.icon;

                    return (
                        <div key={item.id} className="flex gap-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                            <div className={`w-8 h-8 rounded-lg ${config.bg} ${config.text} flex items-center justify-center shrink-0`}>
                                <Icon size={16} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[11px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight italic">
                                        {item.title}
                                    </p>
                                    <span className="text-[9px] font-bold text-slate-400 shrink-0 uppercase tracking-tighter">
                                        {item.timeAgo}
                                    </span>
                                </div>
                                <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5 leading-none">
                                    {item.meta}
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ActivityFeed;
