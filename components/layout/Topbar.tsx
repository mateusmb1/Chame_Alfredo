import React, { useState } from 'react';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Topbar: React.FC = () => {
    const { companyProfile } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 transition-colors">
            {/* Search Bar - Command Style */}
            <div className="flex-1 max-w-2xl relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Busca global (Clientes, OS, Contratos)..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 font-sans text-[10px] font-medium text-slate-400">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                {/* Quick Add Button */}
                <button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all group">
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    <span>Criar OS</span>
                </button>

                {/* Status indicator (Realtime visual feedback) */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Operacional</span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                </button>

                {/* User Info */}
                <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-700 mx-1" />
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-1 uppercase tracking-tight">João Alfredo</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">Admin Alpha</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                        {/* Profile avatar placeholder */}
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">A</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
