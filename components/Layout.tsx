import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
      ? "bg-primary/20 text-primary dark:text-white"
      : "text-[#666666] hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10";
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-dvh overflow-hidden">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)}></div>
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101622] transform transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAr6hbQIjxMfVKphOpZv9bsg46bbiurjREWUtG7g1EI8DgFGD1bhyDdPDjW5s42VebUqWouLbSlsxVDkBamc2408dRbiYRPaE0IjCrnmM98-sW0pj-rCdrTTNuZmxKhLIp1uXo1X-UWUlNVKt_1d9FH3fjzvse2hZKeZY5R3fGfkZjQ0pgZb4G1cVaUKmAbpMx8c7zbAxynqREUM10U8WFFkE7PqsjJuQX2CbVubbj9NQfV4Nly4Ti8tMV-qXqYaQvHU1GbVijf6oj1")' }}></div>
              <div className="flex flex-col">
                <h1 className="text-[#0d121b] dark:text-white text-base font-medium leading-normal">Plataforma</h1>
                <p className="text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal">Operações</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/dashboard')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link to="/orders" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/orders')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">receipt_long</span>
                <p className="text-sm font-medium leading-normal">Ordens de Serviço</p>
              </Link>
              <Link to="/quotes" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/quotes')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">request_quote</span>
                <p className="text-sm font-medium leading-normal">Orçamentos</p>
              </Link>
              <Link to="/invoices" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/invoices')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">receipt</span>
                <p className="text-sm font-medium leading-normal">Faturas</p>
              </Link>
              <Link to="/contracts" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/contracts')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">contract</span>
                <p className="text-sm font-medium leading-normal">Contratos</p>
              </Link>
              <Link to="/products" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/products')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">inventory_2</span>
                <p className="text-sm font-medium leading-normal">Produtos</p>
              </Link>
              <Link to="/clients" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/clients')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">group</span>
                <p className="text-sm font-medium leading-normal">Clientes</p>
              </Link>
              <Link to="/agenda" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/agenda')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">calendar_month</span>
                <p className="text-sm font-medium leading-normal">Agenda</p>
              </Link>
              <Link to="/team" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/team')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">groups</span>
                <p className="text-sm font-medium leading-normal">Equipe</p>
              </Link>
              <Link to="/projects" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/projects')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">work</span>
                <p className="text-sm font-medium leading-normal">Projetos</p>
              </Link>
              <Link to="/inventory" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/inventory')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">inventory_2</span>
                <p className="text-sm font-medium leading-normal">Estoque</p>
              </Link>
              <Link to="/reports" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/reports')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">bar_chart</span>
                <p className="text-sm font-medium leading-normal">Relatórios</p>
              </Link>
              <Link to="/communication" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/communication')}`} onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined text-xl">chat</span>
                <p className="text-sm font-medium leading-normal">Comunicação</p>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-1">
            <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/settings')}`} onClick={() => setMobileOpen(false)}>
              <span className="material-symbols-outlined text-xl">settings</span>
              <p className="text-sm font-medium leading-normal">Configurações</p>
            </Link>
            <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#666666] hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10 w-full text-left">
              <span className="material-symbols-outlined text-xl">logout</span>
              <p className="text-sm font-medium leading-normal">Sair</p>
            </button>
          </div>
        </div>
      </aside>
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101622] hidden md:flex">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAr6hbQIjxMfVKphOpZv9bsg46bbiurjREWUtG7g1EI8DgFGD1bhyDdPDjW5s42VebUqWouLbSlsxVDkBamc2408dRbiYRPaE0IjCrnmM98-sW0pj-rCdrTTNuZmxKhLIp1uXo1X-UWUlNVKt_1d9FH3fjzvse2hZKeZY5R3fGfkZjQ0pgZb4G1cVaUKmAbpMx8c7zbAxynqREUM10U8WFFkE7PqsjJuQX2CbVubbj9NQfV4Nly4Ti8tMV-qXqYaQvHU1GbVijf6oj1")' }}></div>
              <div className="flex flex-col">
                <h1 className="text-[#0d121b] dark:text-white text-base font-medium leading-normal">Plataforma</h1>
                <p className="text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal">Operações</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 mt-4">
              <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/dashboard')}`}>
                <span className="material-symbols-outlined text-xl">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link to="/orders" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/orders')}`}>
                <span className="material-symbols-outlined text-xl">receipt_long</span>
                <p className="text-sm font-medium leading-normal">Ordens de Serviço</p>
              </Link>
              <Link to="/quotes" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/quotes')}`}>
                <span className="material-symbols-outlined text-xl">request_quote</span>
                <p className="text-sm font-medium leading-normal">Orçamentos</p>
              </Link>
              <Link to="/invoices" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/invoices')}`}>
                <span className="material-symbols-outlined text-xl">receipt</span>
                <p className="text-sm font-medium leading-normal">Faturas</p>
              </Link>
              <Link to="/contracts" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/contracts')}`}>
                <span className="material-symbols-outlined text-xl">contract</span>
                <p className="text-sm font-medium leading-normal">Contratos</p>
              </Link>
              <Link to="/products" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/products')}`}>
                <span className="material-symbols-outlined text-xl">inventory_2</span>
                <p className="text-sm font-medium leading-normal">Produtos</p>
              </Link>
              <Link to="/clients" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/clients')}`}>
                <span className="material-symbols-outlined text-xl">group</span>
                <p className="text-sm font-medium leading-normal">Clientes</p>
              </Link>
              <Link to="/agenda" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/agenda')}`}>
                <span className="material-symbols-outlined text-xl">calendar_month</span>
                <p className="text-sm font-medium leading-normal">Agenda</p>
              </Link>
              <Link to="/team" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/team')}`}>
                <span className="material-symbols-outlined text-xl">groups</span>
                <p className="text-sm font-medium leading-normal">Equipe</p>
              </Link>
              <Link to="/projects" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/projects')}`}>
                <span className="material-symbols-outlined text-xl">work</span>
                <p className="text-sm font-medium leading-normal">Projetos</p>
              </Link>
              <Link to="/inventory" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/inventory')}`}>
                <span className="material-symbols-outlined text-xl">inventory_2</span>
                <p className="text-sm font-medium leading-normal">Estoque</p>
              </Link>
              <Link to="/reports" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/reports')}`}>
                <span className="material-symbols-outlined text-xl">bar_chart</span>
                <p className="text-sm font-medium leading-normal">Relatórios</p>
              </Link>
              <Link to="/communication" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/communication')}`}>
                <span className="material-symbols-outlined text-xl">chat</span>
                <p className="text-sm font-medium leading-normal">Comunicação</p>
              </Link>
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-1">
            <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/settings')}`}>
              <span className="material-symbols-outlined text-xl">settings</span>
              <p className="text-sm font-medium leading-normal">Configurações</p>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#666666] hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10 w-full text-left">
              <span className="material-symbols-outlined text-xl">logout</span>
              <p className="text-sm font-medium leading-normal">Sair</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101622] px-4 py-3 md:hidden">
          <button className="flex items-center gap-2" onClick={() => setMobileOpen(true)}>
            <span className="material-symbols-outlined text-2xl">menu</span>
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
