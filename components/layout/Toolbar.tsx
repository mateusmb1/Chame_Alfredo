import React, { ReactNode } from 'react';
import { Filter, LayoutGrid, List } from 'lucide-react';

interface FilterConfig {
    id: string;
    label: string;
    type: 'select' | 'date' | 'search';
    options?: { value: string; label: string }[];
}

interface ActionButton {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'outline' | 'danger';
    icon?: ReactNode;
}

interface ToolbarProps {
    primaryAction?: ActionButton;
    secondaryActions?: ActionButton[];
    filters?: FilterConfig[];
    views?: Array<{ id: string; label: string; active?: boolean; onClick?: () => void }>;
    children?: ReactNode;
}

const Toolbar: React.FC<ToolbarProps> = ({
    primaryAction,
    secondaryActions,
    filters,
    views,
    children
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm transition-all">
            <div className="flex flex-wrap items-center gap-2">
                {/* View Switcher */}
                {views && (
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        {views.map(view => (
                            <button
                                key={view.id}
                                onClick={view.onClick}
                                className={`
                  px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all
                  ${view.active
                                        ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                `}
                            >
                                {view.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                {/* Filters Trigger - Placeholder for now */}
                <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                    <Filter size={14} />
                    Filtrar Resumo
                </button>

                {children}
            </div>

            <div className="flex items-center gap-2">
                {secondaryActions?.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={action.onClick}
                        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                    >
                        {action.icon}
                        {action.label}
                    </button>
                ))}

                {primaryAction && (
                    <button
                        onClick={primaryAction.onClick}
                        className={`
              flex items-center gap-2 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] rounded-lg transition-all shadow-lg shadow-primary/20
              ${primaryAction.variant === 'danger'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-primary hover:bg-primary/90 text-white'}
            `}
                    >
                        {primaryAction.icon}
                        {primaryAction.label}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Toolbar;
