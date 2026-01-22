import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Briefcase,
  DollarSign,
  PieChart,
  Zap,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Quotes: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { quotes: realQuotes, orders } = useApp();
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['Todos', 'Rascunho', 'Enviado', 'Aprovado', 'Rejeitado'];

  const allQuotes = [
    ...realQuotes.map(q => ({
      id: q.id,
      client: q.clientName,
      date: new Date(q.createdAt).toLocaleDateString('pt-BR'),
      value: q.total,
      status: q.status === 'draft' ? 'Rascunho' : q.status === 'sent' ? 'Enviado' : q.status === 'approved' ? 'Aprovado' : 'Rejeitado',
      color: q.status === 'approved' ? 'emerald' : q.status === 'sent' ? 'blue' : q.status === 'draft' ? 'gray' : 'red',
      sourceOrderId: q.sourceOrderId
    })),
    ...orders.filter(o => o.items && o.items.length > 0 && o.status !== 'concluida').map(o => ({
      id: `OS-${o.id}`,
      client: o.clientName,
      date: new Date(o.createdAt).toLocaleDateString('pt-BR'),
      value: o.items.reduce((sum: number, i: any) => sum + i.total, 0),
      status: o.customerSignature ? 'Aprovado' : 'Enviado',
      color: o.customerSignature ? 'emerald' : 'blue',
      isFieldOrder: true
    }))
  ];

  const filteredQuotes = allQuotes.filter(q => {
    const matchesSearch = q.client.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'Todos' || q.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado': return CheckCircle2;
      case 'Rejeitado': return XCircle;
      case 'Enviado': return Zap;
      case 'Rascunho': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'bg-emerald-500/10 text-emerald-500';
      case 'Rejeitado': return 'bg-red-500/10 text-red-500';
      case 'Enviado': return 'bg-blue-500/10 text-blue-500';
      case 'Rascunho': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-gray-800/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] leading-none">Gestão Comercial</p>
          </div>
          <h1 className="text-5xl font-black text-[#1e293b] dark:text-white tracking-tighter leading-none mb-3 italic">
            Propostas<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest opacity-80">
            Acompanhe o funil de vendas e orçamentos emitidos.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-16 px-6 bg-white dark:bg-[#101622] text-[#1e293b] dark:text-white rounded-2xl border border-gray-100 dark:border-gray-800 font-black uppercase tracking-widest text-[9px] hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/quotes/new')}
            className="h-16 px-10 bg-[#1e293b] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 hover:bg-primary transition-all shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Gerar Orçamento</span>
          </button>
        </div>
      </div>

      {/* Strategic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pipeline Mensal', value: formatCurrency(allQuotes.reduce((sum, q) => sum + q.value, 0)), trend: '+12%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Taxa de Conversão', value: '42%', trend: '+5%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Em Negociação', value: allQuotes.filter(q => q.status === 'Enviado').length, trend: '-2', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Ticket Médio', value: formatCurrency(allQuotes.length ? allQuotes.reduce((sum, q) => sum + q.value, 0) / allQuotes.length : 0), trend: '+8%', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#101622] p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/50 shadow-sm hover:border-primary/20 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
              <stat.icon className="w-20 h-20 rotate-12" />
            </div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black italic tracking-widest ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.trend} <ArrowUpRight className="inline w-3 h-3 mb-1" />
                </span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-40">vs last month</span>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">{stat.label}</p>
              <p className="text-3xl font-black text-[#1e293b] dark:text-white leading-none tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-6">
        <div className="flex-1 bg-white dark:bg-[#101622] rounded-[2.5rem] p-4 shadow-sm border border-gray-100 dark:border-gray-800/50 flex items-center gap-4 group">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="RASTREAR POR NOME OU ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50/50 dark:bg-white/5 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 dark:text-white"
            />
          </div>
          <button className="h-14 w-14 flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 rounded-2xl hover:text-primary transition-all">
            <Filter className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all
                  ${activeTab === tab
                  ? 'bg-[#1e293b] text-white shadow-xl shadow-gray-200 dark:shadow-none'
                  : 'bg-white dark:bg-[#101622] text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-primary/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20">
        {filteredQuotes.length === 0 ? (
          <div className="col-span-full py-32 bg-white dark:bg-[#101622] rounded-[3rem] border-4 border-dashed border-gray-50 dark:border-gray-800 flex flex-col items-center justify-center text-gray-200">
            <FileText className="w-20 h-20 mb-6 opacity-40" />
            <p className="font-black text-xs uppercase tracking-[0.3em]">Nenhum registro encontrado</p>
          </div>
        ) : (
          filteredQuotes.map(quote => {
            const StatusIcon = getStatusIcon(quote.status);
            const statusStyle = getStatusStyle(quote.status);
            return (
              <div
                key={quote.id}
                className="group relative bg-white dark:bg-[#101622] rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-2 h-full ${quote.color === 'emerald' ? 'bg-emerald-500' : quote.color === 'blue' ? 'bg-blue-500' : quote.color === 'red' ? 'bg-red-500' : 'bg-gray-300'}`}></div>

                <div className="flex items-start justify-between mb-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">ID {quote.id.substring(0, 8)}</span>
                      {quote.sourceOrderId && (
                        <span className="bg-purple-500/10 text-purple-600 px-2.5 py-1 rounded-lg text-[8px] font-black border border-purple-500/20 uppercase tracking-[0.1em]">OS Captura</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-[#1e293b] dark:text-white leading-tight tracking-tighter italic uppercase group-hover:text-primary transition-colors">{quote.client}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl ${statusStyle} shadow-inner`}>
                    <StatusIcon className="w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 mb-8 items-center text-center">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-[0.25em] block mb-1">Valor Auditado</span>
                    <p className="text-xl font-black text-[#1e293b] dark:text-gray-300 italic tracking-tighter leading-none">{formatCurrency(quote.value)}</p>
                  </div>
                  <div className="space-y-1 border-l border-gray-200 dark:border-gray-800">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-[0.25em] block mb-1">Emissão</span>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">{quote.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_12px] ${quote.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-500/40' : quote.color === 'blue' ? 'bg-blue-500 shadow-blue-500/40' : 'bg-gray-400 shadow-gray-400/40'}`} />
                    <span className="text-[10px] font-black text-[#1e293b] dark:text-gray-500 uppercase tracking-[0.2em]">{quote.status}</span>
                  </div>
                  <div className="flex items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/quotes/${quote.id}`)}
                      className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/quotes/${quote.id}/edit`)}
                      className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all shadow-sm"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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
