import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import OrderItemSelector, { OrderLineItem } from '../components/OrderItemSelector';
import { useApp } from '../contexts/AppContext';
import { Order } from '../types/order';
import { useToast } from '../contexts/ToastContext';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  LayoutGrid,
  List,
  Activity,
  Zap,
  Briefcase,
  Users,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { orders, clients, technicians, inventory, addOrder, updateOrder, deleteOrder, deleteOrders, addInventoryItem } = useApp();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    serviceType: '',
    technicianId: '',
    technicianName: '',
    description: '',
    priority: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
    observations: ''
  });

  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);

  const handleOpenNewOrderModal = () => {
    setIsEditMode(false);
    setEditingOrderId(null);
    setFormData({
      clientId: '', clientName: '', serviceType: '', technicianId: '',
      technicianName: '', description: '', priority: 'media', observations: ''
    });
    setOrderItems([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (order: Order) => {
    setIsEditMode(true);
    setEditingOrderId(order.id);
    setFormData({
      clientId: order.clientId,
      clientName: order.clientName,
      serviceType: order.serviceType,
      technicianId: order.technicianId,
      technicianName: order.technicianName,
      description: order.description,
      priority: order.priority as any,
      observations: order.observations || ''
    });
    setOrderItems(order.items?.map((item: any) => ({
      id: item.id || `item-${Date.now()}`,
      type: item.type || 'service',
      name: item.name || item.description || '',
      description: item.description,
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      total: item.total || (item.quantity * item.unitPrice) || 0,
      sourceId: item.sourceId
    })) || []);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find(c => c.id === formData.clientId);
    const selectedTech = technicians.find(t => t.id === formData.technicianId);
    const originalOrder = isEditMode && editingOrderId ? orders.find(o => o.id === editingOrderId) : null;
    const totalValue = orderItems.reduce((sum, item) => sum + item.total, 0);

    const orderData: any = {
      ...formData,
      clientName: selectedClient?.name || formData.clientName,
      technicianName: selectedTech?.name || formData.technicianName,
      scheduledDate: originalOrder?.scheduledDate || new Date().toISOString(),
      completedDate: originalOrder?.completedDate || null,
      value: totalValue,
      items: orderItems.map(item => ({
        id: item.id, type: item.type, name: item.name, description: item.description,
        quantity: item.quantity, unitPrice: item.unitPrice, total: item.total, sourceId: item.sourceId
      }))
    };

    if (formData.technicianId && (!isEditMode || (originalOrder && originalOrder.status === 'nova'))) {
      orderData.status = 'pendente';
    }

    if (isEditMode && editingOrderId) {
      updateOrder(editingOrderId, orderData);
      showToast('success', 'OS centralizada e atualizada.');
    } else {
      addOrder(orderData);
      showToast('success', 'Nova ordem lançada no sistema.');
    }
    setIsModalOpen(false);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'todas' || o.status === activeTab;
    return matchesSearch && matchesTab;
  }).sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'nova': return { color: 'text-gray-400 bg-gray-50/50 dark:bg-white/5', label: 'Lançada', icon: Plus };
      case 'em_andamento': return { color: 'text-blue-500 bg-blue-500/10', label: 'Em Curso', icon: Activity };
      case 'pendente': return { color: 'text-[#F97316] bg-[#F97316]/10', label: 'Backlog', icon: Clock };
      case 'concluida': return { color: 'text-emerald-500 bg-emerald-500/10', label: 'Finalizada', icon: ShieldCheck };
      default: return { color: 'text-gray-500 bg-gray-50', label: status, icon: AlertCircle };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'urgente': return { color: 'bg-red-500', label: 'CRÍTICO' };
      case 'alta': return { color: 'bg-orange-500', label: 'ALTA' };
      default: return { color: 'bg-blue-500', label: priority.toUpperCase() };
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-gray-800/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] leading-none">Fluxo de Operações</p>
          </div>
          <h1 className="text-5xl font-black text-[#1e293b] dark:text-white tracking-tighter leading-none mb-3 italic">
            Serviços<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest opacity-80">
            Controle e auditoria de Ordens de Serviço.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="h-16 px-6 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
            >
              DELETAR ({selectedIds.length})
            </button>
          )}
          <button
            onClick={handleOpenNewOrderModal}
            className="h-16 px-10 bg-[#1e293b] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 hover:bg-primary transition-all shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>Emitir Nova OS</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-6">
        <div className="flex-1 bg-white dark:bg-[#101622] rounded-[2.5rem] p-4 shadow-sm border border-gray-100 dark:border-gray-800/50 flex items-center gap-4 group">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="LOCALIZAR OS POR ID OU CLIENTE..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50/50 dark:bg-white/5 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 dark:text-white"
            />
          </div>
          <button className="h-14 w-14 flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 rounded-2xl hover:text-primary transition-all">
            <Filter className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          {['todas', 'nova', 'pendente', 'em_andamento', 'concluida'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all
                  ${activeTab === tab
                  ? 'bg-[#1e293b] text-white shadow-xl shadow-gray-200 dark:shadow-none'
                  : 'bg-white dark:bg-[#101622] text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-primary/50'}`}
            >
              {tab === 'todas' ? 'Tudo' : getStatusConfig(tab).label}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white dark:bg-[#101622] p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <button onClick={() => setViewMode('grid')} className={`h-10 w-12 flex items-center justify-center rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-gray-300'}`}><LayoutGrid className="w-5 h-5" /></button>
          <button onClick={() => setViewMode('list')} className={`h-10 w-12 flex items-center justify-center rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-gray-300'}`}><List className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Grid Display */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#101622] rounded-[3rem] p-20 text-center border-4 border-dashed border-gray-50 dark:border-gray-800">
          <TrendingUp className="w-20 h-20 text-gray-100 mx-auto mb-6" />
          <p className="text-gray-300 font-black uppercase tracking-[0.3em]">Nenhum registro encontrado no filtro atual</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20">
          {filteredOrders.map(order => {
            const config = getStatusConfig(order.status);
            const priority = getPriorityInfo(order.priority);
            return (
              <div
                key={order.id}
                className={`group relative bg-white dark:bg-[#101622] rounded-[3rem] p-8 border transition-all hover:translate-y-[-4px]
                  ${selectedIds.includes(order.id) ? 'border-primary ring-8 ring-primary/5 bg-gray-50/50' : 'border-gray-100 dark:border-gray-800/50 shadow-sm'}`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => setSelectedIds(prev => prev.includes(order.id) ? prev.filter(i => i !== order.id) : [...prev, order.id])}
                        className="w-6 h-6 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/10 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all cursor-pointer opacity-0 group-hover:opacity-100 checked:opacity-100 absolute inset-0 z-10"
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${selectedIds.includes(order.id) ? 'bg-primary border-primary scale-0' : 'border-gray-200 opacity-20'}`}></div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${config.color}`}>
                      <config.icon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate(`/orders/${order.id}`)} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm"><Eye className="w-5 h-5" /></button>
                    <button onClick={() => handleOpenEditModal(order)} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all shadow-sm"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => { setOrderToDelete(order.id); setIsDeleteDialogOpen(true); }} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none">OS #{order.id.split('-')[0]}</span>
                    <div className={`h-[5px] w-[5px] rounded-full ${priority.color} ${order.priority === 'urgente' ? 'animate-pulse scale-150' : ''}`}></div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${order.priority === 'urgente' ? 'text-red-500' : 'text-gray-300'}`}>{priority.label}</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#1e293b] dark:text-white tracking-tighter italic uppercase leading-tight mb-2 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                    {order.clientName}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{order.serviceType}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 mb-8">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 text-center">Data Agendada</p>
                    <p className="text-sm font-black text-[#1e293b] dark:text-gray-300 text-center">{new Date(order.scheduledDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 text-center">Budget Total</p>
                    <p className="text-sm font-black text-primary text-center leading-none">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-tr from-[#1e293b] to-black flex items-center justify-center text-white text-xs font-black shadow-lg">
                      {order.technicianName?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Responsável</p>
                      <p className="text-xs font-black text-[#1e293b] dark:text-white tracking-widest">{order.technicianName}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-primary transition-all">
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#101622] rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-20">
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_140px] items-center gap-8 px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-50 dark:border-gray-800">
            <div className="flex justify-center"><input type="checkbox" checked={selectedIds.length === filteredOrders.length} onChange={() => setSelectedIds(selectedIds.length === filteredOrders.length ? [] : filteredOrders.map(o => o.id))} /></div>
            <span>Identificação</span>
            <span>Categoria</span>
            <span>Proprietário</span>
            <span>Fase Atual</span>
            <span className="text-right">Ações</span>
          </div>
          {filteredOrders.map(order => {
            const config = getStatusConfig(order.status);
            return (
              <div key={order.id} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_140px] items-center gap-8 px-10 py-8 border-b border-gray-50 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                <div className="flex justify-center flex-shrink-0">
                  <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => setSelectedIds(prev => prev.includes(order.id) ? prev.filter(i => i !== order.id) : [...prev, order.id])} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-[#1e293b] dark:text-white uppercase italic tracking-tighter truncate max-w-[200px]">{order.clientName}</span>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">OS #{order.id.substring(0, 8)}</span>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.serviceType}</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-black">{order.technicianName?.substring(0, 2).toUpperCase()}</div>
                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">{order.technicianName}</span>
                </div>
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${config.color}`}>
                    <config.icon className="w-3.5 h-3.5" />
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate(`/orders/${order.id}`)} className="p-2 text-gray-400 hover:text-primary"><Eye className="w-5 h-5" /></button>
                  <button onClick={() => handleOpenEditModal(order)} className="p-2 text-gray-400 hover:text-blue-500"><Edit2 className="w-5 h-5" /></button>
                  <button onClick={() => { setOrderToDelete(order.id); setIsDeleteDialogOpen(true); }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern High-End Modal for OS */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'ATUALIZAÇÃO DE REGISTRO : OS' : 'LANÇAMENTO DE NOVA OS'}
        size="xl"
        footer={
          <div className="flex items-center gap-4 justify-end w-full px-10 pb-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            >
              Abortar Operação
            </button>
            <button
              onClick={handleSubmit}
              className="px-12 py-4 bg-[#1e293b] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-primary transition-all active:scale-95 flex items-center gap-3"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Confirmar Registro</span>
            </button>
          </div>
        }
      >
        <div className="p-10 space-y-10 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {/* Section 1: Entity Mapping */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Mapeamento de Cliente</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black uppercase tracking-widest focus:ring-8 focus:ring-primary/5 dark:text-white px-5 outline-none transition-all"
                required
              >
                <option value="">Selecione a Entidade</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Técnico Encarregado</label>
              <select
                value={formData.technicianId}
                onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black uppercase tracking-widest focus:ring-8 focus:ring-primary/5 dark:text-white px-5 outline-none transition-all"
                required
              >
                <option value="">Delegar Responsável</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.name.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Section 2: Service Classification */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Classificação de Serviço</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black uppercase tracking-widest focus:ring-8 focus:ring-primary/5 dark:text-white px-5 outline-none transition-all"
                required
              >
                <option value="">TIPO DE INTERVENÇÃO</option>
                <option value="Manutenção Preventiva">MANUTENÇÃO PREVENTIVA</option>
                <option value="Instalação">INSTALAÇÃO / SETUP</option>
                <option value="Reparo">REPARO TÉCNICO</option>
                <option value="Substituição">SUBSTITUIÇÃO DE ATIVOS</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Escala de Prioridade</label>
              <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-white/5 rounded-[1.5rem] border border-gray-200 dark:border-gray-800">
                {(['baixa', 'media', 'alta', 'urgente'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                ${formData.priority === p
                        ? 'bg-[#1e293b] text-white shadow-xl'
                        : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {p === 'urgente' ? 'CRÍTICO' : p}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Summary & Description */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Escopo Técnico (Descrição)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-bold focus:ring-8 focus:ring-primary/5 dark:text-white transition-all uppercase placeholder:opacity-20"
              placeholder="DETALHE A INTERVENÇÃO, PROBLEMAS RELATADOS E EXPECTATIVAS..."
              required
            />
          </div>

          {/* Section 4: Budget & Items Mapping */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-10">
            <div className="flex items-center gap-3 mb-6 ml-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Materiais e Alocação de Recursos</h4>
            </div>
            <OrderItemSelector
              items={orderItems}
              onItemsChange={setOrderItems}
              inventory={inventory}
              productsServices={[]}
              onAddNewProduct={(p) => { addInventoryItem(p); showToast('success', 'Hardware catalogado com sucesso.'); }}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Dialogs */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Cancelar Ordem"
        message="Esta ação irá remover o registro da OS permanentemente. Documentos gerados serão desativados."
        confirmText="Confirmar Deleção"
        cancelText="Manter Registro"
        type="danger"
      />

      <ConfirmDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="LIMPEZA EM MASSA"
        message={`Deseja realmente purgar as ${selectedIds.length} ordens de serviço do ecossistema?`}
        confirmText="Sim, Deletar Lote"
        cancelText="Cancelar"
        type="danger"
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Orders;
