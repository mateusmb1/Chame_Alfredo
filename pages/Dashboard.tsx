import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, clients, contracts, inventory } = useApp();

  // Calculate metrics
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    // Orders metrics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'nova' || o.status === 'pendente').length;
    const inProgressOrders = orders.filter(o => o.status === 'em_andamento').length;
    const completedOrders = orders.filter(o => o.status === 'concluida').length;

    // Calculate overdue orders (simulated - orders created more than 7 days ago and not completed)
    const overdueOrders = orders.filter(o => {
      const createdDate = new Date(o.createdAt);
      const daysDiff = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 7 && o.status !== 'concluida';
    }).length;

    // Scheduled orders (simulated - pending orders)
    const scheduledOrders = pendingOrders;

    // Clients metrics
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const condominiums = clients.filter(c => c.type === 'pj').length;
    const individuals = clients.filter(c => c.type === 'pf').length;

    // Contracts metrics
    const activeContracts = contracts.filter(c => c.status === 'ativo').length;
    const totalContractValue = contracts
      .filter(c => c.status === 'ativo')
      .reduce((sum, c) => sum + c.value, 0);

    // Simulated overdue payments (30% of active contracts)
    const overduePayments = Math.floor(activeContracts * 0.3);
    const overdueAmount = Math.floor(totalContractValue * 0.15);

    // Inventory alerts
    const lowStockItems = inventory.filter(i => i.status === 'estoque_baixo' || i.status === 'esgotado').length;

    return {
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      overdueOrders,
      scheduledOrders,
      totalClients,
      activeClients,
      condominiums,
      individuals,
      activeContracts,
      totalContractValue,
      overduePayments,
      overdueAmount,
      lowStockItems
    };
  }, [orders, clients, contracts, inventory]);

  // Chart data for orders by week
  const weeklyOrdersData = [
    { name: 'Seg', value: 12 },
    { name: 'Ter', value: 19 },
    { name: 'Qua', value: 15 },
    { name: 'Qui', value: 22 },
    { name: 'Sex', value: 18 },
    { name: 'Sáb', value: 8 },
    { name: 'Dom', value: 5 },
  ];

  // Chart data for order status
  const orderStatusData = [
    { name: 'Pendentes', value: metrics.pendingOrders, color: '#FFC107' },
    { name: 'Em Andamento', value: metrics.inProgressOrders, color: '#007BFF' },
    { name: 'Concluídas', value: metrics.completedOrders, color: '#28A745' },
    { name: 'Atrasadas', value: metrics.overdueOrders, color: '#DC3545' },
  ];

  // Pie chart data for client types
  const clientTypeData = [
    { name: 'Condomínios', value: metrics.condominiums, color: '#4A90E2' },
    { name: 'Pessoas Físicas', value: metrics.individuals, color: '#50C878' },
  ];

  // Simulated overdue clients
  const overdueClients = [
    { name: 'Condomínio Residencial Jardim das Flores', amount: 2500, days: 15, type: 'Contrato' },
    { name: 'Condomínio Empresarial Torre Sul', amount: 8000, days: 5, type: 'Contrato' },
    { name: 'Paula Lima', amount: 1200, days: 22, type: 'Serviço' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Geral</h2>
          <p className="text-gray-600 mt-1">Visão completa do seu negócio</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <span className="material-symbols-outlined text-gray-500">search</span>
            <input type="text" placeholder="Busca global..." className="bg-transparent border-none outline-none text-sm w-48" />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/orders')}>
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-4xl opacity-80">assignment</span>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-xs font-semibold">Total</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{metrics.totalOrders}</p>
          <p className="text-blue-100 text-sm">Ordens de Serviço</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-4xl opacity-80">pending_actions</span>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-xs font-semibold">Pendentes</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{metrics.pendingOrders}</p>
          <p className="text-orange-100 text-sm">Aguardando Início</p>
        </div>

        {/* Overdue Orders */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-4xl opacity-80">schedule</span>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-xs font-semibold">Atrasadas</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{metrics.overdueOrders}</p>
          <p className="text-red-100 text-sm">Ordens em Atraso</p>
        </div>

        {/* Scheduled Orders */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-4xl opacity-80">event</span>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-xs font-semibold">Agendadas</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{metrics.scheduledOrders}</p>
          <p className="text-purple-100 text-sm">Ordens Agendadas</p>
        </div>
      </div>

      {/* Clients & Contracts Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Clients */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/clients')}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-2xl">groups</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalClients}</p>
              <p className="text-sm text-gray-600">Total de Clientes</p>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">{metrics.condominiums} Condomínios</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">{metrics.individuals} PF</span>
            </div>
          </div>
        </div>

        {/* Active Contracts */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contracts')}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-2xl">description</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeContracts}</p>
              <p className="text-sm text-gray-600">Contratos Ativos</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Valor Total: R$ {metrics.totalContractValue.toLocaleString('pt-BR')}/mês</p>
        </div>

        {/* Overdue Payments */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-md border-2 border-red-200 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-red-700 text-2xl">payments</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{metrics.overduePayments}</p>
              <p className="text-sm text-red-600">Faturas em Atraso</p>
            </div>
          </div>
          <p className="text-xs text-red-600 font-semibold">R$ {metrics.overdueAmount.toLocaleString('pt-BR')} a receber</p>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/inventory')}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-600 text-2xl">inventory_2</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.lowStockItems}</p>
              <p className="text-sm text-gray-600">Alertas de Estoque</p>
            </div>
          </div>
          <p className="text-xs text-orange-600">Itens com estoque baixo</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Orders Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ordens de Serviço por Dia da Semana</h3>
          <div className="h-48 sm:h-56 md:h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyOrdersData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#333' }}
                />
                <Area type="monotone" dataKey="value" stroke="#4A90E2" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status das Ordens</h3>
          <div className="h-48 sm:h-56 md:h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={80} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Overdue Payments & Client Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overdue Payments List */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Clientes com Pagamentos em Atraso</h3>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">{overdueClients.length} clientes</span>
          </div>
          <div className="space-y-4">
            {overdueClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{client.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-600">Tipo: {client.type}</span>
                    <span className="text-xs text-red-600 font-semibold">{client.days} dias de atraso</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-700">R$ {client.amount.toLocaleString('pt-BR')}</p>
                  <button className="mt-2 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors">
                    Cobrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Type Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição de Clientes</h3>
          <div className="h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {clientTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Condomínios</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{metrics.condominiums}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pessoas Físicas</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{metrics.individuals}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${order.status === 'concluida' ? 'bg-green-100' :
                    order.status === 'em_andamento' ? 'bg-blue-100' :
                      'bg-yellow-100'
                  }`}>
                  <span className={`material-symbols-outlined ${order.status === 'concluida' ? 'text-green-600' :
                      order.status === 'em_andamento' ? 'text-blue-600' :
                        'text-yellow-600'
                    }`}>
                    {order.status === 'concluida' ? 'check_circle' : 'pending'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">OS #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.clientName} - {order.serviceType}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'concluida' ? 'bg-green-100 text-green-700' :
                    order.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                  }`}>
                  {order.status === 'concluida' ? 'Concluída' :
                    order.status === 'em_andamento' ? 'Em Andamento' :
                      'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
