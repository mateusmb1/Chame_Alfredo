import React, { useMemo, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Receipt,
  Clock,
  AlertCircle,
  Calendar,
  Package,
  ArrowUpRight,
  TrendingDown,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, clients, contracts, inventory, setOnNewOrder } = useApp();
  const { showToast } = useToast();

  useEffect(() => {
    setOnNewOrder((newOrder) => {
      showToast('success', `🔔 Nova Ordem: ${newOrder.clientName} - ${newOrder.serviceType}`, 5000);
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => { });
      } catch (e) { }
    });
  }, [setOnNewOrder, showToast]);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'nova' || o.status === 'pendente').length;
    const inProgressOrders = orders.filter(o => o.status === 'em_andamento').length;
    const completedOrders = orders.filter(o => o.status === 'concluida').length;

    const overdueOrders = orders.filter(o => {
      const createdDate = new Date(o.createdAt);
      const daysDiff = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 7 && o.status !== 'concluida';
    }).length;

    const totalClients = clients.length;
    const condominiums = clients.filter(c => c.type === 'pj').length;
    const individuals = clients.filter(c => c.type === 'pf').length;
    const activeContracts = contracts.filter(c => c.status === 'ativo').length;
    const totalContractValue = contracts.filter(c => c.status === 'ativo').reduce((sum, c) => sum + c.value, 0);
    const lowStockItems = inventory.filter(i => i.status === 'estoque_baixo' || i.status === 'esgotado').length;

    return {
      totalOrders, pendingOrders, inProgressOrders, completedOrders, overdueOrders,
      totalClients, condominiums, individuals, activeContracts, totalContractValue, lowStockItems
    };
  }, [orders, clients, contracts, inventory]);

  const weeklyOrdersData = [
    { name: 'Seg', value: 12 }, { name: 'Ter', value: 19 }, { name: 'Qua', value: 15 },
    { name: 'Qui', value: 22 }, { name: 'Sex', value: 18 }, { name: 'Sáb', value: 8 }, { name: 'Dom', value: 5 },
  ];

  const orderStatusData = [
    { name: 'Pendente', value: metrics.pendingOrders, color: '#F59E0B' },
    { name: 'Em Curso', value: metrics.inProgressOrders, color: '#3B82F6' },
    { name: 'Concluído', value: metrics.completedOrders, color: '#10B981' },
    { name: 'Atrasado', value: metrics.overdueOrders, color: '#EF4444' },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick }: any) => (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#101622] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="flex items-center gap-1 text-emerald-500 font-medium text-xs">
          <TrendingUp className="w-3 h-3" />
          <span>+12%</span>
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-[#0d121b] dark:text-white leading-none mb-2">{value}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] dark:text-white tracking-tight leading-none mb-2">
            Overview
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-medium tracking-wide">
            Bom dia! Veja como estão as operações hoje.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar ordens, clientes..."
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#101622] border border-gray-200 dark:border-gray-800 rounded-[1.25rem] text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
            />
          </div>
          <button className="p-3.5 bg-white dark:bg-[#101622] border border-gray-200 dark:border-gray-800 rounded-[1.25rem] text-gray-400 hover:text-primary hover:border-primary/50 transition-all shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total de Ordens"
          value={metrics.totalOrders}
          subtitle="Geral na plataforma"
          icon={Receipt}
          color="bg-blue-500"
          onClick={() => navigate('/orders')}
        />
        <StatCard
          title="Pendentes"
          value={metrics.pendingOrders}
          subtitle="Aguardando atribuição"
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          title="Em Atraso"
          value={metrics.overdueOrders}
          subtitle="Críticas no sistema"
          icon={AlertCircle}
          color="bg-red-500"
        />
        <StatCard
          title="Faturamento"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 1 }).format((metrics.totalContractValue + orders.filter(o => o.status === 'concluida').reduce((sum, o) => sum + (o.value || 0), 0)))}
          subtitle="Mensal projetado + concluídos"
          icon={TrendingUp}
          color="bg-emerald-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#101622] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Clientes</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-500">Condomínios</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{metrics.condominiums}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-gray-500">Pessoas Físicas</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{metrics.individuals}</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800">
            <button
              onClick={() => navigate('/clients')}
              className="w-full py-2 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Ver Todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#101622] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Produtividade Semanal</h3>
            <div className="flex items-center gap-1 text-primary text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+8.4% de média</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyOrdersData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#135bec" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#135bec" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    padding: '8px 12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#135bec"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status & Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status Pie */}
        <div className="bg-white dark:bg-[#101622] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6">Status Operacional</h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{metrics.totalOrders}</span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-gray-500 font-medium truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#101622] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Últimas Atividades</h3>
            <button
              onClick={() => navigate('/orders')}
              className="text-primary text-xs font-semibold hover:underline"
            >
              Ver histórico
            </button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                    ${order.status === 'concluida' ? 'bg-emerald-100 text-emerald-600' :
                      order.status === 'em_andamento' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                    {order.status === 'concluida' ? <TrendingUp className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">OS #{order.id}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-none">
                      {order.clientName} • {order.serviceType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${order.status === 'concluida' ? 'bg-emerald-500/10 text-emerald-600' :
                      order.status === 'em_andamento' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {order.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
