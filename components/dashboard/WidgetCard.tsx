import React, { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

interface WidgetCardProps {
    id: string;
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    scroll?: boolean;
    span?: 4 | 6 | 12;
    children: ReactNode;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
    title,
    subtitle,
    actions,
    scroll = false,
    span = 6,
    children
}) => {
    const spanClasses = {
        4: 'lg:col-span-4',
        6: 'lg:col-span-6',
        12: 'lg:col-span-12',
    };

    return (
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col shadow-sm transition-all overflow-hidden ${spanClasses[span]}`}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 leading-none">
                        {title}
                    </h4>
                    {subtitle && (
                        <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {actions}
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className={`flex-1 p-4 ${scroll ? 'max-h-[300px] overflow-y-auto custom-scrollbar' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default WidgetCard;
