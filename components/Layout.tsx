import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setOnNewMessage((message) => {
      // Admin only hears messages that are NOT from admin
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

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-[#101622]">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg ${!companyProfile?.logo_url ? 'bg-gradient-to-br from-primary to-primary/60 shadow-primary/20' : ''}`}
          >
            {companyProfile?.logo_url ? (
              <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-contain bg-white" />
            ) : (
              <span className="text-white font-bold text-xl">A</span>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#0d121b] dark:text-white text-lg font-bold leading-tight tracking-tight">
              {companyProfile?.company_name || 'Alfredo'}
            </h1>
            <p className="text-[#4c669a] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
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
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  <span className="text-[14px] font-semibold">{item.label}</span>
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
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
          <Settings className="w-5 h-5" />
          <span className="text-[14px] font-semibold">Configurações</span>
        </Link>
        <button
          onClick={() => {
            setMobileOpen(false);
            handleLogout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[14px] font-semibold">Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#090E1A]">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#090E1A]/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Top Header - Mobile only */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden ${!companyProfile?.logo_url ? 'bg-primary' : ''}`}>
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-contain bg-white" />
              ) : (
                <span className="text-white font-bold text-sm">A</span>
              )}
            </div>
            <span className="text-[#0d121b] dark:text-white font-bold text-sm tracking-tight">
              {companyProfile?.company_name || 'Alfredo'} Admin
            </span>
          </div>

          <div className="w-10"></div> {/* Spacer for symmetry */}
        </header>

        {/* Page Container */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-6">
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
