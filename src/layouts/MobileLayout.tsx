import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    Home,
    Calendar,
    Receipt,
    MessageSquare,
    User,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useResponsive } from '../src/hooks';

interface MobileLayoutProps {
    children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
    const { setOnNewMessage, user } = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    useEffect(() => {
        setOnNewMessage((message) => {
            // Get current user role from localStorage
            const technician = localStorage.getItem('technician');
            const client = localStorage.getItem('client');

            let shouldPlayMatch = false;

            if (technician) {
                // Technician only hears messages from admin
                if (message.senderType === 'admin') shouldPlayMatch = true;
            } else if (client) {
                // Client hears messages from admin or technicians
                if (message.senderType !== 'client') shouldPlayMatch = true;
            } else {
                // Generic mobile user
                if (message.senderType !== 'admin') shouldPlayMatch = true;
            }

            if (shouldPlayMatch) {
                try {
                    const audio = new Audio('/notification.mp3');
                    audio.play().catch(() => { });
                } catch (e) { }
            }
        });
    }, [setOnNewMessage]);

    const navItems = [
        { label: 'Dashboard', path: '/app/dashboard', icon: <Home size={20} /> },
        { label: 'Agenda', path: '/app/schedule', icon: <Calendar size={20} /> },
        { label: 'Pedidos', path: '/app/orders', icon: <Receipt size={20} /> },
        { label: 'Chat', path: '/app/chat', icon: <MessageSquare size={20} /> },
        { label: 'Perfil', path: '/app/profile', icon: <User size={20} /> },
    ];

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    const handleLogout = () => {
        navigate('/login');
    };

    // Mobile Bottom Navigation
    const MobileNav = () => (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e293b] border-t border-gray-200 dark:border-gray-800 pb-safe z-50 md:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(item.path)
                            ? 'text-primary'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <div className={`p-1 rounded-lg ${isActive(item.path) ? 'bg-primary/10' : ''}`}>
                            {React.cloneElement(item.icon as React.ReactElement, {
                                size: 24,
                                strokeWidth: isActive(item.path) ? 2.5 : 2
                            })}
                        </div>
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );

    // Desktop Sidebar
    const Sidebar = () => (
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <img src="/alfredo.webp" alt="Alfredo" className="w-8 h-8 rounded-full" />
                    <div>
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Alfredo App</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Técnico</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2">
                    <img src="/alfredo.webp" alt="Alfredo" className="w-8 h-8 rounded-full" />
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white">Alfredo</h1>
                </div>
                {/* Optional: Add user avatar or notification bell here */}
            </header>

            <Sidebar />

            {/* Main Content */}
            <main className={`
                flex-1 
                transition-all duration-300
                pt-16 pb-20 md:pt-8 md:pb-8 md:pl-64
                min-h-screen
            `}>
                <div className="max-w-5xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>

            <MobileNav />
        </div>
    );
};

export default MobileLayout;
