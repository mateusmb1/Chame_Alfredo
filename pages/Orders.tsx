import React, { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../contexts/AppContext';
import { Order } from '../types/order';
import { useToast } from '../contexts/ToastContext';

const Orders: React.FC = () => {
  const { orders, clients, technicians, addOrder, updateOrder, deleteOrder } = useApp();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    serviceType: '',
    technicianId: '',
    technicianName: '',
    description: '',
    priority: 'normal' as 'baixa' | 'normal' | 'alta' | 'urgente',
    observations: ''
  });

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
      priority: 'normal',
      observations: ''
    });
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
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedClient = clients.find(c => c.id === formData.clientId);
    const selectedTech = technicians.find(t => t.id === formData.technicianId);

    const originalOrder = isEditMode && editingOrderId ? orders.find(o => o.id === editingOrderId) : null;

    const orderData: any = {
      ...formData,
      clientName: selectedClient?.name || formData.clientName,
      technicianName: selectedTech?.name || formData.technicianName,
      scheduledDate: originalOrder?.scheduledDate || new Date().toISOString(),
      completedDate: originalOrder?.completedDate || null,
      value: originalOrder?.value || 0
    };

    // Workflow: If a technician is assigned and status is 'nova', move to 'pendente'
    if (formData.technicianId && (!isEditMode || (originalOrder && originalOrder.status === 'nova'))) {
      orderData.status = 'pendente';
    }

    if (isEditMode && editingOrderId) {
      updateOrder(editingOrderId, orderData);
      showToast('success', 'Ordem de serviço atualizada com sucesso!');
    } else {
      addOrder(orderData);
      showToast('success', 'Ordem de serviço criada com sucesso!');
    }

    setIsModalOpen(false);
    setFormData({
      clientId: '',
      clientName: '',
      serviceType: '',
      technicianId: '',
      technicianName: '',
      description: '',
      priority: 'normal',
      observations: ''
    });
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete);
      showToast('success', 'Ordem de serviço excluída com sucesso!');
    }
    setOrderToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'em_andamento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'pendente': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'concluida': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nova': return 'Nova';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  };

  const groupedOrders = {
    nova: orders.filter(o => o.status === 'nova'),
    pendente: orders.filter(o => o.status === 'pendente'),
    em_andamento: orders.filter(o => o.status === 'em_andamento'),
    concluida: orders.filter(o => o.status === 'concluida')
  };

  return (
    <div class="flex flex-col h-full">
      <div class="px-4 sm:px-6 lg:px-10 py-6">
        <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 class="text-gray-900 dark:text-white text-3xl font-black tracking-tight">Gerenciamento de Ordens de Serviço</h1>
          <button
            onClick={handleOpenNewOrderModal}
            class="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            <span class="material-symbols-outlined text-lg">add</span>
            <span class="truncate">Nova Ordem de Serviço</span>
          </button>
        </div>

        {/* New/Edit Order Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isEditMode ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
          size="lg"
          footer={
            <>
              <button
                onClick={() => setIsModalOpen(false)}
                class="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                class="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
              >
                <span class="material-symbols-outlined text-lg">save</span>
                <span>{isEditMode ? 'Atualizar' : 'Criar'} Ordem</span>
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Serviço</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                  <option value="Instalação">Instalação</option>
                  <option value="Reparo">Reparo</option>
                  <option value="Consultoria">Consultoria</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Técnico Responsável</label>
                <select
                  value={formData.technicianId}
                  onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">Selecione um técnico</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Prioridade</label>
              <div class="flex gap-4">
                {(['baixa', 'normal', 'alta', 'urgente'] as const).map(priority => (
                  <label key={priority} class="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      class="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300 capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição do Serviço</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Descreva os detalhes do serviço a ser realizado..."
                required
              />
            </div>
          </form>
        </Modal>

        {/* Filters */}
        <div class="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="relative w-full sm:max-w-xs">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
              <input type="text" class="w-full h-10 pl-10 pr-4 rounded-lg bg-background-light dark:bg-background-dark border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary" placeholder="Buscar por ID, cliente..." />
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div class="flex overflow-x-auto gap-6 pb-6">
          {Object.entries(groupedOrders).map(([status, statusOrders]) => (
            <div key={status} class="flex flex-col w-full sm:w-72 min-w-0">
              <div class="flex items-center justify-between py-2 mb-4">
                <h3 class="text-base font-bold text-gray-800 dark:text-gray-200">{getStatusLabel(status)}</h3>
                <span class="px-2 py-0.5 text-sm font-semibold text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-700 rounded-md">{statusOrders.length}</span>
              </div>
              <div class="flex flex-col gap-4 flex-1 p-1">
                {statusOrders.length === 0 ? (
                  <div class="flex items-center justify-center min-h-32 sm:min-h-40 md:min-h-48 bg-gray-50 dark:bg-transparent rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
                    <span class="text-sm text-gray-400">Nenhuma ordem</span>
                  </div>
                ) : (
                  statusOrders.map(order => (
                    <div key={order.id} class="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div class="flex justify-between items-start mb-2">
                        <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">#{(order.id || '').substring(0, 8)}</p>
                        <span class={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                          <span class="size-1.5 rounded-full bg-current"></span>{getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p class="text-base font-bold text-gray-900 dark:text-white mb-1">{order.clientName}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{order.serviceType}</p>
                      <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                          onClick={() => handleOpenEditModal(order)}
                          class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Editar"
                        >
                          <span class="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(order.id)}
                          class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Excluir"
                        >
                          <span class="material-symbols-outlined text-base text-red-600 dark:text-red-400">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Ordem de Serviço"
        message="Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Orders;
