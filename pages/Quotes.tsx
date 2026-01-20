import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  MoreHorizontal,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Briefcase,
  DollarSign
} from 'lucide-react';

const Quotes: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['Todos', 'Rascunho', 'Enviado', 'Aprovado', 'Rejeitado'];

  const quotes = [
    { id: 'QT-2024-001', client: 'Inovatech Soluções', date: '15 de Jul, 2024', value: 1500.00, status: 'Aprovado', color: 'emerald' },
    { id: 'QT-2024-002', client: 'Construtora Alfa', date: '14 de Jul, 2024', value: 8750.00, status: 'Enviado', color: 'blue' },
    { id: 'QT-2024-003', client: 'Mercado Central', date: '12 de Jul, 2024', value: 3200.00, status: 'Rejeitado', color: 'red' },
    { id: 'QT-2024-004', client: 'Tech Logística', date: '11 de Jul, 2024', value: 500.00, status: 'Rascunho', color: 'gray' },
    { id: 'QT-2024-005', client: 'Condomínio Solar', date: '10 de Jul, 2024', value: 2450.00, status: 'Aprovado', color: 'emerald' },
  ];

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = q.client.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'Todos' || q.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAction = (action: string) => {
    showToast('info', `Ação "${action}" ainda não implementada.`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado': return CheckCircle2;
      case 'Rejeitado': return XCircle;
      case 'Enviado': return FileText;
      case 'Rascunho': return Clock;
      default: return AlertCircle;
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d121b] dark:text-white tracking-tight">Orçamentos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Controle e acompanhamento de propostas comerciais.</p>
        </div>
        <button
          onClick={() => navigate('/quotes/new')}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      {/* Stats Quick View (Integrated with Quotes list context) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Mês', value: 'R$ 16.4k', trend: '+12%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Conversão', value: '68%', trend: '+5%', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Pendentes', value: '14', trend: '-2', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Ticket Médio', value: 'R$ 2.1k', trend: '+8%', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#101622] p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-[#0d121b] dark:text-white leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white dark:bg-[#101622] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar orçamento ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
            <button onClick={() => handleAction('Exportar')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                ${activeTab === tab
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List / Grid of Quotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuotes.length === 0 ? (
          <div className="col-span-full py-20 bg-white dark:bg-[#101622] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-sm text-gray-500">Nenhum orçamento encontrado</p>
          </div>
        ) : (
          filteredQuotes.map(quote => {
            const StatusIcon = getStatusIcon(quote.status);
            return (
              <div
                key={quote.id}
                className="bg-white dark:bg-[#101622] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">#{quote.id}</span>
                    <h3 className="font-bold text-[#0d121b] dark:text-white leading-tight">{quote.client}</h3>
                  </div>
                  <div className={`p-2 rounded-xl bg-${quote.color}-500/10 text-${quote.color}-500`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-gray-50 dark:border-gray-800 mb-4">
                  <div className="flex-1">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Valor Proposta</span>
                    <p className="text-base font-black text-emerald-600 leading-none">{formatCurrency(quote.value)}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
                  <div className="flex-1">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Data Criação</span>
                    <p className="text-xs font-bold text-gray-500 leading-none">{quote.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-${quote.color}-500 shadow-[0_0_8px] shadow-${quote.color}-500/50`} />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{quote.status}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/quotes/${quote.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-xl transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAction('Editar')}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Quotes;
