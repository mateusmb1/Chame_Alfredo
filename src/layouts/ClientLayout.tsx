import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Receipt, BarChart3, MessageSquare, LogOut, Menu, X, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useResponsive } from '../src/hooks';

interface ClientLayoutProps {
    children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setOnNewMessage } = useApp();
    const { isMobile, isDesktop } = useResponsive();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
        setOnNewMessage((message) => {
            // Client hears messages from admin or technician
            if (message.senderType !== 'client') {
                try {
                    const audio = new Audio('/notification.mp3');
                    audio.play().catch(() => { });
                } catch (e) { }
            }
        });
    }, [setOnNewMessage]);

    const navItems = [
        { label: 'Dashboard', path: '/client/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Meus Pedidos', path: '/client/requests', icon: <FileText size={20} /> }, // Changed from Orçamentos to fit Reqs better or stay strict
        { label: 'Minhas Faturas', path: '/client/invoices', icon: <Receipt size={20} /> },
        { label: 'Chat Suporte', path: '/client/chat', icon: <MessageSquare size={20} /> },
        { label: 'Meu Perfil', path: '/client/profile', icon: <User size={20} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        navigate('/landing');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full text-white">
            <div className="p-6 flex items-center gap-3 border-b border-slate-700">
                <img src="/alfredo.webp" alt="Alfredo" className="w-10 h-10 rounded-full bg-white p-0.5" />
                <div>
                    <h2 className="font-bold text-sm">Portal do Cliente</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Chame Alfredo</p>
                </div>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className={`
                hidden md:flex flex-col w-64 bg-[#1e293b] 
                fixed inset-y-0 left-0 z-50
            `}>
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1e293b] text-white p-4 flex justify-between items-center z-50 shadow-md">
                <div className="flex items-center gap-2">
                    <img src="/alfredo.webp" alt="Alfredo" className="w-8 h-8 rounded-full bg-white p-0.5" />
                    <span className="font-bold text-sm">Portal Cliente</span>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 -mr-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#1e293b] shadow-2xl pt-20">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className={`
                flex-1 overflow-auto 
                md:ml-64 
                pt-20 md:pt-0
                transition-all duration-300
            `}>
                <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
                    <div className="animate-fade-in-up">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientLayout;
