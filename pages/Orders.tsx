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
  MoreVertical,
  Calendar,
  DollarSign,
  LayoutGrid,
  List
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
      clientId: '',
      clientName: '',
      serviceType: '',
      technicianId: '',
      technicianName: '',
      description: '',
      priority: 'media',
      observations: ''
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
      showToast('success', 'Ordem de serviço atualizada!');
    } else {
      addOrder(orderData);
      showToast('success', 'Ordem de serviço criada!');
    }

    setIsModalOpen(false);
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete);
      showToast('success', 'Ordem de serviço excluída!');
      setSelectedIds(prev => prev.filter(id => id !== orderToDelete));
    }
    setOrderToDelete(null);
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length > 0) {
      deleteOrders(selectedIds);
      showToast('success', `${selectedIds.length} ordens de serviço excluídas!`);
      setSelectedIds([]);
    }
  };

  const handleConfirmDeleteAll = () => {
    const allIds = filteredOrders.map(o => o.id);
    if (allIds.length > 0) {
      deleteOrders(allIds);
      showToast('success', 'Todas as ordens de serviço foram excluídas!');
      setSelectedIds([]);
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'todas' || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'nova': return { color: 'text-gray-500 bg-gray-50 dark:bg-gray-800/50', label: 'Nova', icon: Plus };
      case 'em_andamento': return { color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10', label: 'Em Andamento', icon: Clock };
      case 'pendente': return { color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10', label: 'Pendente', icon: AlertCircle };
      case 'concluida': return { color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10', label: 'Concluída', icon: CheckCircle2 };
      default: return { color: 'text-gray-500 bg-gray-50', label: status, icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0d121b] dark:text-white tracking-tight">Ordens de Serviço</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie e acompanhe todos os serviços.</p>
        </div>
        <div className="flex items-center gap-3">
          {filteredOrders.length > 0 && (
            <div className="hidden md:flex items-center gap-2 mr-2">
              <button
                onClick={() => setIsDeleteAllDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar Tudo</span>
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir Selecionados ({selectedIds.length})</span>
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleOpenNewOrderModal}
            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Nova OS</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-[#101622] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente ou ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 px-2">
          <button
            onClick={toggleSelectAll}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
              ${selectedIds.length === filteredOrders.length && filteredOrders.length > 0
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? 'Desvincular Tudo' : 'Selecionar Tudo'}
          </button>

          {selectedIds.length > 0 && (
            <span className="text-xs font-bold text-primary">
              {selectedIds.length} selecionado(s)
            </span>
          )}
        </div>

        {/* Mobile Tabs Wrapper */}
        <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-2 no-scrollbar">
          {['todas', 'nova', 'pendente', 'em_andamento', 'concluida'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider
                ${activeTab === tab
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              {tab === 'todas' ? 'Todas' : getStatusConfig(tab).label}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600'}`}
            title="Visualização em Grade"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600'}`}
            title="Visualização em Lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Grid/List */}
      {filteredOrders.length === 0 ? (
        <div className="col-span-full py-20 bg-white dark:bg-[#101622] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400">
          <Search className="w-12 h-12 mb-4 opacity-20" />
          <p className="font-medium text-sm text-gray-500">Nenhuma ordem encontrada</p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map(order => {
              const config = getStatusConfig(order.status);
              return (
                <div
                  key={order.id}
                  className="group bg-white dark:bg-[#101622] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  {/* Status Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="w-5 h-5 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 transition-all cursor-pointer"
                      />
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${config.color}`}>
                        <config.icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(order)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/5 rounded-xl transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#0d121b] dark:text-white leading-tight">
                        {order.clientName}
                      </h3>
                      {order.priority === 'urgente' && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.serviceType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Criada em</span>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Valor</span>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                      {order.technicianName?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-0.5">Técnico</span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                        {order.technicianName}
                      </span>
                    </div>
                  </div>
                  );
            })}
                </div>
              ) : (
            <div className="bg-white dark:bg-[#101622] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800"
                />
                <span>Cliente</span>
                <span>Serviço</span>
                <span>Técnico</span>
                <span>Status</span>
                <span className="text-right">Ações</span>
              </div>
              {filteredOrders.map(order => {
                const config = getStatusConfig(order.status);
                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] md:grid-cols-[auto_1fr_1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0d121b] dark:text-white">{order.clientName}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">ID: {order.id.substring(0, 8)}</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{order.serviceType}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{order.technicianName}</span>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${config.color}`}>
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </span>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(order)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/5 rounded-xl transition-colors"
                        title="Editar Ordem"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                        title="Excluir Ordem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )
      )}
            {/* Modals & Dialogs */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title={isEditMode ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
              size="xl"
              footer={
                <div className="flex items-center gap-3 justify-end w-full">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEditMode ? 'Salvar Alterações' : 'Criar Ordem'}</span>
                  </button>
                </div>
              }
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Cliente</label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                      required
                    >
                      <option value="">Selecione um cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Técnico</label>
                    <select
                      value={formData.technicianId}
                      onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                      className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                      required
                    >
                      <option value="">Selecione um técnico</option>
                      {technicians.map(tech => (
                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Serviço</label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                      <option value="Instalação">Instalação</option>
                      <option value="Reparo">Reparo</option>
                      <option value="Substituição">Substituição</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Prioridade</label>
                    <div className="flex gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl">
                      {(['baixa', 'media', 'alta', 'urgente'] as const).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: p })}
                          className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all
                      ${formData.priority === p
                              ? 'bg-white dark:bg-gray-800 shadow-sm text-primary'
                              : 'text-gray-400'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white placeholder:text-gray-400"
                    placeholder="Descreva os detalhes do serviço..."
                    required
                  />
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <OrderItemSelector
                    items={orderItems}
                    onItemsChange={setOrderItems}
                    inventory={inventory}
                    productsServices={[]}
                    onAddNewProduct={(p) => {
                      addInventoryItem(p);
                      showToast('success', 'Produto adicionado ao estoque!');
                    }}
                  />
                </div>
              </form>
            </Modal>

            <ConfirmDialog
              isOpen={isBulkDeleteDialogOpen}
              onClose={() => setIsBulkDeleteDialogOpen(false)}
              onConfirm={handleConfirmBulkDelete}
              title="Excluir Selecionados"
              message={`Deseja realmente excluir as ${selectedIds.length} ordens de serviço selecionadas? Esta ação é irreversível.`}
              confirmText="Sim, Excluir Selecionadas"
              cancelText="Cancelar"
              type="danger"
            />

            <ConfirmDialog
              isOpen={isDeleteAllDialogOpen}
              onClose={() => setIsDeleteAllDialogOpen(false)}
              onConfirm={handleConfirmDeleteAll}
              title="EXCLUIR TODAS AS ORDENS"
              message="ATENÇÃO: Deseja realmente excluir TODAS as ordens de serviço visíveis nesta lista? Esta ação é extrema e irreversível. Use apenas para limpeza total antes de uma nova importação."
              confirmText="Sim, EXCLUIR TUDO"
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
