import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    Quote,
    Calendar,
    Users,
    HardDrive,
    MessageSquare,
    Settings
} from 'lucide-react';
import { useDashboardTheme } from '../../contexts/DashboardThemeContext';

const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/orders', label: 'Serviços', icon: Receipt },
    { path: '/quotes', label: 'Propostas', icon: Quote },
    { path: '/agenda', label: 'Agenda', icon: Calendar },
    { path: '/clients', label: 'Clientes', icon: Users },
    { path: '/inventory', label: 'Estoque', icon: HardDrive },
    { path: '/communication', label: 'Chat', icon: MessageSquare },
];

const SidebarNav: React.FC = () => {
    const location = useLocation();
    const { theme } = useDashboardTheme();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav className="h-full w-20 flex flex-col items-center py-6 bg-slate-900 text-white gap-6">
            {/* Mini Logo */}
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <span className="font-black italic text-xl">A</span>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
                ${active ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
                            title={item.label}
                        >
                            <item.icon size={22} strokeWidth={active ? 2.5 : 2} />

                            {/* Tooltip emulation for now - could be a separate component */}
                            <div className="absolute left-16 px-2 py-1 rounded bg-slate-800 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ml-2 z-[100] border border-slate-700 shadow-xl">
                                {item.label}
                            </div>

                            {active && (
                                <div className="absolute left-0 w-1 h-6 bg-white rounded-full -translate-x-4" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 mt-auto">
                <Link
                    to="/settings"
                    className={`
            group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all
            ${isActive('/settings') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
          `}
                    title="Ajustes"
                >
                    <Settings size={22} />
                    <div className="absolute left-16 px-2 py-1 rounded bg-slate-800 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ml-2 z-[100] border border-slate-700 shadow-xl">
                        Ajustes
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default SidebarNav;
