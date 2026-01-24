import React from 'react';
import { useDashboardTheme, DashboardTheme } from '../../contexts/DashboardThemeContext';
import { Layout, Monitor } from 'lucide-react';

interface ThemeOption {
    id: DashboardTheme;
    label: string;
    description: string;
}

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useDashboardTheme();

    const options: ThemeOption[] = [
        {
            id: 'classic',
            label: 'Tema Clássico',
            description: 'Interface tradicional, focada em legibilidade e espaços amplos.'
        },
        {
            id: 'commandCenter',
            label: 'Command Center',
            description: 'Visão densa e minimalista, otimizada para centros de comando.'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => setTheme(option.id)}
                    className={`
            flex flex-col text-left p-4 rounded-2xl border-2 transition-all group
            ${theme === option.id
                            ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm'}
          `}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-xl ${theme === option.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            {option.id === 'classic' ? <Layout size={20} /> : <Monitor size={20} />}
                        </div>
                        {theme === option.id && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        )}
                    </div>
                    <h4 className={`text-sm font-black uppercase tracking-tight ${theme === option.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                        {option.label}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                        {option.description}
                    </p>

                    {/* Visual Preview Emulation */}
                    <div className="mt-4 h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex">
                        <div className="w-6 h-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                        <div className="flex-1 p-2 space-y-2">
                            <div className="h-2 w-1/3 bg-slate-300 dark:bg-slate-600 rounded" />
                            <div className="grid grid-cols-3 gap-1">
                                <div className="h-8 bg-slate-300/50 dark:bg-slate-600/50 rounded" />
                                <div className="h-8 bg-slate-300/50 dark:bg-slate-600/50 rounded" />
                                <div className="h-8 bg-slate-300/50 dark:bg-slate-600/50 rounded" />
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
