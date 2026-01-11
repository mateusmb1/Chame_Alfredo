import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Users, 
  Package, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Ordens de Serviço', href: '/orders', icon: FileText },
    { name: 'Faturas', href: '/invoices', icon: Receipt },
    { name: 'Contratos', href: '/contracts', icon: FileText },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Produtos & Serviços', href: '/products', icon: Package },
  ];

  const secondaryNavigation = [
    { name: 'Configurações', href: '/settings', icon: Settings },
    { name: 'Ajuda', href: '/help', icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen bg-[#f6f6f8]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-slate-900">GestãoPro</h1>
                <p className="text-xs text-slate-500">Gestão de Operações</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0`} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-1 border-t border-gray-100 pt-4">
            {secondaryNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <item.icon className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500" />
                {item.name}
              </NavLink>
            ))}
            
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-100 p-3 shadow-sm">
              <img
                className="h-9 w-9 rounded-full bg-gray-300"
                src="https://picsum.photos/100/100"
                alt="User"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-900">Ana Costa</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
          <button
            className="text-gray-500 hover:text-gray-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-end items-center gap-4">
            <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <Search className="h-5 w-5" />
            </button>
            <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}