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
  ChevronRight,
  Search,
  Bell,
  Plus,
  ArrowDownRight,
  Activity,
  User,
  Building
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
    { name: 'Pendente', value: metrics.pendingOrders, color: '#F97316' },
    { name: 'Em Curso', value: metrics.inProgressOrders, color: '#3B82F6' },
    { name: 'Concluído', value: metrics.completedOrders, color: '#10B981' },
    { name: 'Atrasado', value: metrics.overdueOrders, color: '#EF4444' },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, onClick }: any) => (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-[#101622] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800/50 hover:border-primary/20 transition-all cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Icon className="w-24 h-24 rotate-12 translate-x-4 -translate-y-4" />
      </div>

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center shadow-inner`}>
          <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
        <p className="text-4xl font-black text-[#1e293b] dark:text-white leading-none tracking-tighter mb-3">{value}</p>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide opacity-60">{subtitle}</p>
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 w-full opacity-50"></div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-gray-800/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] leading-none">Painel de Operações</p>
          </div>
          <h1 className="text-5xl font-black text-[#1e293b] dark:text-white tracking-tighter leading-none mb-3 italic">
            Overview<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest opacity-80">
            Acompanhe a pulsação da sua empresa em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="PESQUISAR OS, CLIENTES..."
              className="w-full sm:w-80 h-14 pl-12 pr-6 bg-white dark:bg-[#101622] border border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all dark:text-white shadow-sm"
            />
          </div>
          <button className="h-14 w-14 flex items-center justify-center bg-white dark:bg-[#101622] border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-primary hover:border-primary/50 transition-all shadow-sm">
            <Bell className="w-6 h-6" />
          </button>
          <button className="h-14 px-8 bg-[#1e293b] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-[#1e293b]/10 hover:shadow-primary/20 hover:-translate-y-1">
            <Plus className="w-5 h-5" />
            Criar OS
          </button>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Produtividade"
          value={metrics.totalOrders}
          subtitle="Ordens totais"
          icon={Activity}
          color="bg-blue-500"
          trend={12}
          onClick={() => navigate('/orders')}
        />
        <StatCard
          title="Em Espera"
          value={metrics.pendingOrders}
          subtitle="Aguardando início"
          icon={Clock}
          color="bg-[#F97316]"
          trend={-5}
        />
        <StatCard
          title="Critical Path"
          value={metrics.overdueOrders}
          subtitle="Atrasados > 7 dias"
          icon={AlertCircle}
          color="bg-red-500"
          trend={2}
        />
        <StatCard
          title="Revenue"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format((metrics.totalContractValue + orders.filter(o => o.status === 'concluida').reduce((sum, o) => sum + (o.value || 0), 0)))}
          subtitle="Faturamento corrente"
          icon={TrendingUp}
          color="bg-emerald-500"
          trend={18}
        />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#101622] rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800/50 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Desempenho Operacional</h3>
              <h2 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tighter italic uppercase">Tendência Semanal</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Data</span>
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyOrdersData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(200,200,200,0.1)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }}
                  dy={15}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: '#F97316', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '24px',
                    border: 'none',
                    padding: '16px 24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}
                  labelStyle={{ display: 'none' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F97316"
                  strokeWidth={6}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Pulse */}
        <div className="bg-[#1e293b] dark:bg-[#101622] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Users className="w-48 h-48 rotate-45 translate-x-12 -translate-y-12" />
          </div>

          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F97316] mb-8">Base de Clientes</h3>
            <div className="space-y-8">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-primary transition-colors">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-black italic tracking-tighter">Condomínios</p>
                    <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Market Share PJ</p>
                  </div>
                </div>
                <span className="text-3xl font-black italic">{metrics.condominiums}</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-primary transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-black italic tracking-tighter">Residenciais</p>
                    <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Market Share PF</p>
                  </div>
                </div>
                <span className="text-3xl font-black italic">{metrics.individuals}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/clients')}
            className="relative z-10 w-full py-6 mt-12 bg-white text-[#1e293b] font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all group"
          >
            Ver Carteira Completa
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Breakdown */}
        <div className="bg-white dark:bg-[#101622] rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800/50 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Status Operacional</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-[#1e293b] dark:text-white italic tracking-tighter">{metrics.totalOrders}</span>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Total OS</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 leading-none mb-1">{item.name}</p>
                  <p className="text-sm font-black text-[#1e293b] dark:text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-white dark:bg-[#101622] rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800/50 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Fluxo de Trabalho</h3>
              <h2 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tighter italic uppercase">Atividades Recentes</h2>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-2.5 bg-gray-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              Auditar Tudo
            </button>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-[#1e293b]/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg
                    ${order.status === 'concluida' ? 'bg-emerald-500 text-white' :
                      order.status === 'em_andamento' ? 'bg-blue-500 text-white' : 'bg-[#F97316] text-white'}`}>
                    {order.status === 'concluida' ? <TrendingUp className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#1e293b] dark:text-white tracking-tighter uppercase italic">OS #{order.id}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide truncate max-w-[200px] sm:max-w-none">
                      {order.clientName} • {order.serviceType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]
                    ${order.status === 'concluida' ? 'bg-emerald-500/10 text-emerald-600' :
                      order.status === 'em_andamento' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-[#F97316]'}`}>
                    {order.status}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-gray-200 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
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
