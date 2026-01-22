import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useResponsive } from '../src/hooks';
import {
  LayoutDashboard,
  Receipt,
  Quote,
  FileText,
  HardDrive,
  Users,
  Calendar,
  Briefcase,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Mascot from './Mascot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOnNewMessage, companyProfile } = useApp();
  const { isMobile, isDesktop, breakpoint } = useResponsive();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setOnNewMessage((message) => {
      if (message.senderType !== 'admin') {
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => { });
        } catch (e) { }
      }
    });
  }, [setOnNewMessage]);

  const menuItems = [
    { path: '/dashboard', label: 'Monitor', icon: LayoutDashboard },
    { path: '/orders', label: 'Serviços', icon: Receipt },
    { path: '/quotes', label: 'Propostas', icon: Quote },
    { path: '/contracts', label: 'Contratos', icon: FileText },
    { path: '/agenda', label: 'Planejamento', icon: Calendar },
    { path: '/clients', label: 'Parceiros', icon: Users },
    { path: '/team', label: 'Equipe', icon: Users },
    { path: '/projects', label: 'Projetos', icon: Briefcase },
    { path: '/inventory', label: 'Patrimônio', icon: HardDrive },
    { path: '/reports', label: 'Performance', icon: BarChart3 },
    { path: '/communication', label: 'Chat Central', icon: MessageSquare },
  ];

  const currentPathLabel = menuItems.find(item =>
    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  )?.label || 'Alfredo OS';

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem('alfredo_user');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#1e293b] text-white">
      {/* Premium Brand Header */}
      <div className="p-10  relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles className="w-20 h-20 rotate-12" />
        </div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-white text-[#1e293b] flex items-center justify-center p-2.5 shadow-2xl border border-white/20">
            <Mascot className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-black italic tracking-tighter leading-none">Alfredo</h1>
            <p className="text-[#F97316] text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-80">SaaS Command</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar lg:no-scrollbar space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-5 px-6 py-4 rounded-[1.8rem] transition-all duration-500 relative
                ${active
                  ? 'bg-white text-[#1e293b] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {active && <div className="absolute left-0 w-1.5 h-6 bg-primary rounded-full -translate-x-3"></div>}
              <div className={`
                p-2.5 rounded-xl transition-all duration-500
                ${active ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-white/20 group-hover:bg-white/10 group-hover:text-white'}
              `}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-black uppercase tracking-[0.2em] truncate ${active ? 'text-[#1e293b]' : ''}`}>
                {item.label}
              </span>
              {active && <ChevronRight className="ml-auto w-4 h-4 text-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-8 border-t border-white/5 space-y-3 bg-black/10">
        <Link
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={`
            flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300
            ${isActive('/settings')
              ? 'bg-primary text-white shadow-lg'
              : 'text-white/30 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest">Ajustes GERAIS</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Finalizar Sessão</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#090E1A]">
      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-[#090E1A]/80 backdrop-blur-md z-[60] md:hidden transition-all duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-[320px] bg-[#1e293b]
          transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          md:relative md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-20 px-6 bg-white/80 dark:bg-[#101622]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-[50]">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 text-[#1e293b] dark:text-white shadow-sm"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-[#F97316] uppercase tracking-[0.2em] leading-none mb-1">Membro Admin</span>
              <span className="text-[#1e293b] dark:text-white font-black text-sm uppercase italic tracking-tighter truncate">{currentPathLabel}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1e293b] flex items-center justify-center p-1.5 shadow-lg">
              <Mascot className="w-full h-full" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 w-full max-w-[1700px] mx-auto overflow-y-auto overflow-x-hidden p-6 sm:p-10 lg:p-14 custom-scrollbar">
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 20px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default Layout;
