import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { format, subDays, startOfMonth, startOfWeek, subMonths, isAfter, eachDayOfInterval, isSameDay } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Reports: React.FC = () => {
  const { orders, clients, technicians } = useApp();

  // States
  const [period, setPeriod] = useState<'Dia' | 'Semana' | 'Mês' | 'Ano'>('Mês');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [serviceType, setServiceType] = useState<string>('all');

  // Filtered Data
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.scheduledDate);
      let isInPeriod = true;

      const now = new Date();
      if (period === 'Dia') isInPeriod = isAfter(orderDate, subDays(now, 1));
      else if (period === 'Semana') isInPeriod = isAfter(orderDate, startOfWeek(now));
      else if (period === 'Mês') isInPeriod = isAfter(orderDate, startOfMonth(now));
      else if (period === 'Ano') isInPeriod = isAfter(orderDate, subMonths(now, 12));

      const techMatches = selectedTech === 'all' || order.technicianId === selectedTech;
      const clientMatches = selectedClient === 'all' || order.clientId === selectedClient;
      const typeMatches = serviceType === 'all' || order.serviceType === serviceType;

      return isInPeriod && techMatches && clientMatches && typeMatches;
    });
  }, [orders, period, selectedTech, selectedClient, serviceType]);

  // Statistics
  const stats = useMemo(() => {
    const completed = filteredOrders.filter(o => o.status === 'concluida');
    const revenue = completed.reduce((acc, curr) => acc + (curr.value || 0), 0);
    return {
      total: filteredOrders.length,
      completedCount: completed.length,
      revenue: revenue,
      avgRevenue: completed.length > 0 ? revenue / completed.length : 0
    };
  }, [filteredOrders]);

  // Chart Data Generation
  const chartData = useMemo(() => {
    const now = new Date();
    const start = period === 'Dia' ? subDays(now, 1) :
      period === 'Semana' ? startOfWeek(now) :
        period === 'Mês' ? startOfMonth(now) : subMonths(now, 12);

    const days = eachDayOfInterval({ start, end: now });
    return days.map(dI => {
      const dayOrders = filteredOrders.filter(o => isSameDay(new Date(o.scheduledDate), dI));
      return {
        name: format(dI, 'dd/MM'),
        volume: dayOrders.length,
        revenue: dayOrders.reduce((acc, curr) => acc + (curr.value || 0), 0)
      };
    });
  }, [filteredOrders, period]);

  const exportCSV = () => {
    const headers = ['ID', 'Cliente', 'Serviço', 'Status', 'Valor', 'Data', 'Técnico'];
    const rows = filteredOrders.map(o => [
      o.id.substring(0, 8),
      o.clientName,
      o.serviceType,
      o.status,
      o.value || 0,
      format(new Date(o.scheduledDate), 'dd/MM/yyyy'),
      o.technicianName
    ]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(',') + "\n"
      + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_alfredo_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div className="flex min-w-72 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
              <h1 className="text-[#0d121b] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Relatórios</h1>
            </div>
            <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-normal">Insights detalhados sobre suas operações e produtividade.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold leading-normal hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span className="truncate">Exportar Dados</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          {/* Filters Panel */}
          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="bg-white dark:bg-[#18202F] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm sticky top-8">
              <h3 className="text-[#0d121b] dark:text-white text-sm font-bold uppercase tracking-wider pb-4 border-b border-gray-100 dark:border-gray-800">Filtros Avançados</h3>
              <div className="space-y-6 mt-6">
                {/* Period Filter */}
                <div>
                  <p className="text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-tight pb-3">Período de Análise</p>
                  <div className="flex h-10 w-full items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                    {(['Dia', 'Semana', 'Mês', 'Ano'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`flex grow items-center justify-center rounded-lg px-2 py-1.5 text-xs font-bold transition-all ${period === p
                          ? 'bg-white dark:bg-gray-700 shadow-md text-primary dark:text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-tight">Segmentação</p>
                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        value={selectedTech}
                        onChange={(e) => setSelectedTech(e.target.value)}
                        className="w-full appearance-none h-11 px-4 pr-10 bg-gray-50 dark:bg-gray-900/50 text-[#0d121b] dark:text-white rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                      >
                        <option value="all">👨‍🔧 Todos os técnicos</option>
                        {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">expand_more</span>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full appearance-none h-11 px-4 pr-10 bg-gray-50 dark:bg-gray-900/50 text-[#0d121b] dark:text-white rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                      >
                        <option value="all">🏢 Todos os clientes</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Report Display Area */}
          <div className="flex-1 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Volume de OS', val: stats.total, color: 'text-primary', icon: 'list_alt' },
                { label: 'Concluídas', val: stats.completedCount, color: 'text-green-600', icon: 'task_alt' },
                { label: 'Faturamento', val: `R$ ${stats.revenue.toLocaleString()}`, color: 'text-blue-600', icon: 'payments' },
                { label: 'Ticket Médio', val: `R$ ${Math.round(stats.avgRevenue).toLocaleString()}`, color: 'text-purple-600', icon: 'trending_up' }
              ].map((s, idx) => (
                <div key={idx} className="bg-white dark:bg-[#18202F] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-800 ${s.color}`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{s.label}</p>
                    <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="bg-white dark:bg-[#18202F] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary"></span>
                  Visão Temporal de Ordens
                </h3>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary/20"></span> Volume</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary"></span> Tendência</span>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="volume" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detail Table */}
            <div className="bg-white dark:bg-[#18202F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex justify-between items-center">
                <h3 className="font-bold text-sm">Detalvamento por Ordem</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black uppercase">{filteredOrders.length} Resultados</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Serviço</th>
                      <th className="px-6 py-4">Técnico</th>
                      <th className="px-6 py-4 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {filteredOrders.length > 0 ? filteredOrders.map(order => (
                      <tr key={order.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{format(new Date(order.scheduledDate), 'dd/MM/yy')}</td>
                        <td className="px-6 py-4">{order.clientName}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold text-gray-500 uppercase">{order.serviceType}</span>
                        </td>
                        <td className="px-6 py-4">{order.technicianName}</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">R$ {order.value.toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">Nenhuma ordem encontrada nos filtros selecionados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
