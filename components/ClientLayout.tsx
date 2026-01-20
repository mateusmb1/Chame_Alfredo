import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Receipt, BarChart3, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ClientLayoutProps {
    children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setOnNewMessage } = useApp();
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
        { label: 'Meus Orçamentos', path: '/client/quotes', icon: <FileText size={20} /> },
        { label: 'Minhas Faturas', path: '/client/invoices', icon: <Receipt size={20} /> },
        { label: 'Relatórios', path: '/client/reports', icon: <BarChart3 size={20} /> },
        { label: 'Chat com Alfredo', path: '/client/chat', icon: <MessageSquare size={20} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        navigate('/landing');
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-[#1e293b] text-white">
                <div className="p-6 flex items-center gap-3 border-b border-slate-700">
                    <img src="/alfredo.webp" alt="Alfredo" className="w-10 h-10 rounded-full" />
                    <div>
                        <h2 className="font-bold text-sm">Portal do Cliente</h2>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Chame Alfredo</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                ? 'bg-[#F97316] text-white shadow-lg'
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
            </aside>

            {/* Mobile Header & Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1e293b] text-white p-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <img src="/alfredo.webp" alt="Alfredo" className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-sm">Portal Alfredo</span>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {mobileOpen && (
                <div className="md:hidden fixed inset-0 bg-[#1e293b] z-40 pt-20 px-4">
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-4 rounded-xl ${isActive(item.path) ? 'bg-[#F97316] text-white' : 'text-slate-300'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-bold">{item.label}</span>
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-4 text-slate-400"
                        >
                            <LogOut size={20} />
                            <span className="font-bold">Sair</span>
                        </button>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto pt-20 md:pt-0">
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ClientLayout;
