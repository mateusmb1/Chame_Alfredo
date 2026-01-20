import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { clients, technicians, addOrder } = useApp();
  const { showToast } = useToast();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    serviceType: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    technicianId: '',
    priority: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
    observations: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || !formData.technicianId || !formData.serviceType) {
      showToast('error', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedClient = clients.find(c => c.id === formData.clientId);
      const selectedTech = technicians.find(t => t.id === formData.technicianId);

      const newOrder = {
        clientId: formData.clientId,
        clientName: selectedClient?.name || '',
        serviceType: formData.serviceType,
        description: formData.description,
        priority: formData.priority,
        scheduledDate: formData.scheduledDate && formData.scheduledTime
          ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
          : new Date().toISOString(),
        completedDate: null,
        technicianId: formData.technicianId,
        technicianName: selectedTech?.name || '',
        value: 0,
        observations: formData.observations,
        projectId: '',
        projectName: ''
      };

      // Assuming addOrder handles the DB insert and returns or triggers sync
      // For the sake of the modal, let's assume we can determine success
      await addOrder(newOrder);

      showToast('success', 'Ordem de serviço criada com sucesso!');
      setShowSuccessModal(true);
      // In a real scenario, we'd get the ID back from addOrder
      // setCreatedOrderId(result.id); 
    } catch (error) {
      console.error('Error creating order:', error);
      showToast('error', 'Erro ao criar ordem de serviço.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full relative">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-8">
        <div className="flex items-center gap-8">
          <h2 className="text-[#333333] dark:text-white text-xl font-bold leading-tight">Criar Nova Ordem de Serviço</h2>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <button onClick={() => navigate('/orders')} className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[#333333] shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Ordem'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-8">
            {/* Client Info */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F]">
              <h3 className="text-lg font-semibold text-[#333333] dark:text-white mb-6">Informações do Cliente</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-1">
                  <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente *</label>
                  <select
                    id="cliente"
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="form-select w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => navigate('/clients')}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    <span>Adicionar Novo Cliente</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F]">
              <h3 className="text-lg font-semibold text-[#333333] dark:text-white mb-6">Detalhes do Serviço</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="tipo_servico" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Serviço *</label>
                  <input
                    type="text"
                    id="tipo_servico"
                    required
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="form-input w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Ex: Manutenção Preventiva"
                  />
                </div>
                <div>
                  <label htmlFor="descricao_problema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição do Problema/Serviço *</label>
                  <textarea
                    id="descricao_problema"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-textarea w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Descreva o problema ou o serviço a ser realizado..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F]">
              <h3 className="text-lg font-semibold text-[#333333] dark:text-white mb-6">Agendamento e Atribuição</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="data_agendamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Agendamento</label>
                  <input
                    type="date"
                    id="data_agendamento"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="form-input w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="hora_agendamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora de Agendamento</label>
                  <input
                    type="time"
                    id="hora_agendamento"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="form-input w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="tecnico" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Técnico Atribuído *</label>
                  <select
                    id="tecnico"
                    required
                    value={formData.technicianId}
                    onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                    className="form-select w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Selecione um técnico</option>
                    {technicians.map(tech => (
                      <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridade</label>
                  <select
                    id="prioridade"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="form-select w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F]">
              <h3 className="text-lg font-semibold text-[#333333] dark:text-white mb-6">Observações</h3>
              <div>
                <label htmlFor="observacoes" className="sr-only">Observações</label>
                <textarea
                  id="observacoes"
                  rows={4}
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="form-textarea w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                  placeholder="Adicione qualquer observação adicional aqui..."
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl dark:bg-[#18202F]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">check_circle</span>
              </div>
              <h2 className="mb-2 text-xl font-bold text-[#333333] dark:text-white">Ordem de Serviço Criada com Sucesso!</h2>
              <p className="mb-6 text-gray-500 dark:text-gray-400">O que você gostaria de fazer a seguir?</p>
              <div className="flex w-full flex-col gap-3">
                <button onClick={() => navigate('/orders')} className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90">Ver Lista de Ordens</button>
                <button onClick={() => {
                  setShowSuccessModal(false);
                  setFormData({
                    clientId: '',
                    serviceType: '',
                    description: '',
                    scheduledDate: '',
                    scheduledTime: '',
                    technicianId: '',
                    priority: 'media',
                    observations: ''
                  });
                }} className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[#333333] shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Criar Nova</button>
                <button onClick={() => navigate('/dashboard')} className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50">Ir para Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;