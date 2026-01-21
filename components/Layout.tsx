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
  X,
  ChevronRight
} from 'lucide-react';

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
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/orders', label: 'Ordens de Serviço', icon: Receipt },
    { path: '/quotes', label: 'Orçamentos', icon: Quote },
    { path: '/invoices', label: 'Faturas', icon: FileText },
    { path: '/contracts', label: 'Contratos', icon: FileText },
    { path: '/products', label: 'Produtos', icon: Package },
    { path: '/clients', label: 'Clientes', icon: Users },
    { path: '/agenda', label: 'Agenda', icon: Calendar },
    { path: '/team', label: 'Equipe', icon: Users },
    { path: '/projects', label: 'Projetos', icon: Briefcase },
    { path: '/inventory', label: 'Estoque', icon: HardDrive },
    { path: '/reports', label: 'Relatórios', icon: BarChart3 },
    { path: '/communication', label: 'Comunicação', icon: MessageSquare },
  ];

  const currentPathLabel = menuItems.find(item =>
    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  )?.label || 'Alfredo';

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-[#101622]">
      {/* Brand Header */}
      <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <div
            className={`
              flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300
              ${isDesktop ? 'w-10 h-10 rounded-xl' : 'w-8 h-8 rounded-lg'}
              ${!companyProfile?.logo_url ? 'bg-gradient-to-br from-primary to-primary/60 shadow-primary/20' : ''}
            `}
          >
            {companyProfile?.logo_url ? (
              <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-contain bg-white" />
            ) : (
              <span className={`text-white font-bold ${isDesktop ? 'text-xl' : 'text-sm'}`}>A</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-[#0d121b] dark:text-white text-lg font-bold leading-tight tracking-tight truncate">
              {companyProfile?.company_name || 'Alfredo'}
            </h1>
            <p className="text-[#4c669a] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 md:py-6 custom-scrollbar">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                  ${active
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  <span className={`text-[14px] font-semibold truncate ${(breakpoint === 'xs' || breakpoint === 'sm') ? 'hidden md:block' : ''}`}>
                    {item.label}
                  </span>
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 space-y-1">
        <Link
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
            ${isActive('/settings')
              ? 'bg-primary/10 text-primary'
              : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'
            }
          `}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className={`text-[14px] font-semibold ${(breakpoint === 'xs' || breakpoint === 'sm') ? 'hidden md:block' : ''}`}>
            Configurações
          </span>
        </Link>
        <button
          onClick={() => {
            setMobileOpen(false);
            handleLogout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`text-[14px] font-semibold ${(breakpoint === 'xs' || breakpoint === 'sm') ? 'hidden md:block' : ''}`}>
            Sair
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#090E1A]">
      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-[#090E1A]/60 backdrop-blur-sm z-[60] md:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-[280px] bg-white dark:bg-[#101622] 
          border-r border-gray-100 dark:border-gray-800 transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-[50]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${!companyProfile?.logo_url ? 'bg-primary' : ''}`}>
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-contain bg-white" />
              ) : (
                <span className="text-white font-bold text-sm">A</span>
              )}
            </div>
            <span className="text-[#0d121b] dark:text-white font-bold text-sm tracking-tight truncate">
              {currentPathLabel}
            </span>
          </div>

          <div className="flex items-center justify-end w-10">
            {/* Empty space or notification badge could go here */}
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className={`
          flex-1 w-full max-w-[1600px] mx-auto overflow-y-auto overflow-x-hidden
          transition-all duration-300
          p-3 sm:p-4 md:p-8
        `}>
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.2);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.4);
        }
      `}} />
    </div>
  );
};

export default Layout;
