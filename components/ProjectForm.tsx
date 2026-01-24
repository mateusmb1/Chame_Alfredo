import React, { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { Client } from '../types/client';
import { Technician } from '../types/technician';
import { Order } from '../types/order';

interface ProjectFormProps {
  project?: Project;
  clients: Client[];
  technicians: Technician[];
  orders: Order[];
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, clients, technicians, orders, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    type: project?.type || 'instalacao',
    status: project?.status || 'planejamento',
    clientId: project?.clientId || '',
    clientName: project?.clientName || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    budget: project?.budget || 0,
    progress: project?.progress || 0,
    managerId: project?.managerId || '',
    managerName: project?.managerName || '',
    teamIds: project?.teamIds || [],
    team: project?.team || [],
    relatedOrders: project?.relatedOrders || [],
    documents: project?.documents || [],
    notes: project?.notes || []
  });

  const [selectedClient, setSelectedClient] = useState<string>(formData.clientId);
  const [selectedManager, setSelectedManager] = useState<string>(formData.managerId);
  const [selectedTeam, setSelectedTeam] = useState<string[]>(formData.teamIds);

  useEffect(() => {
    if (selectedClient) {
      const client = clients.find(c => c.id === selectedClient);
      if (client) {
        setFormData(prev => ({
          ...prev,
          clientId: client.id,
          clientName: client.name
        }));
      }
    }
  }, [selectedClient, clients]);

  useEffect(() => {
    if (selectedManager) {
      const manager = technicians.find(t => t.id === selectedManager);
      if (manager) {
        setFormData(prev => ({
          ...prev,
          managerId: manager.id,
          managerName: manager.name
        }));
      }
    }
  }, [selectedManager, technicians]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, teamIds: selectedTeam }));
  }, [selectedTeam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTeamMember = (technicianId: string) => {
    setSelectedTeam(prev =>
      prev.includes(technicianId)
        ? prev.filter(id => id !== technicianId)
        : [...prev, technicianId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Projeto *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Instalação CFTV Condomínio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Projeto
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="instalacao">Instalação</option>
                <option value="manutencao">Manutenção</option>
                <option value="consultoria">Consultoria</option>
                <option value="suporte">Suporte</option>
                <option value="inspecao">Inspeção</option>
                <option value="treinamento">Treinamento</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva os objetivos e escopo do projeto..."
            />
          </div>

          {/* Cliente e Gerente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                required
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gerente *
              </label>
              <select
                required
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um gerente</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Datas e Orçamento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Término
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orçamento (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Progresso e Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progresso (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="planejamento">Planejamento</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="em_pausa">Em Pausa</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>
          </div>

          {/* Equipe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipe do Projeto
            </label>
            <div className="border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
              {technicians.map(tech => (
                <div key={tech.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`tech-${tech.id}`}
                    checked={selectedTeam.includes(tech.id)}
                    onChange={() => toggleTeamMember(tech.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`tech-${tech.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">{tech.name}</div>
                    <div className="text-sm text-gray-500">
                      {tech.specialization.join(', ')}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Ordens de Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vincular Ordens de Serviço (OS)
            </label>
            <div className="border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
              {orders.filter(o => !selectedClient || o.clientId === selectedClient).length === 0 ? (
                <p className="text-sm text-gray-500 italic p-2">Nenhuma OS disponível para este cliente.</p>
              ) : (
                orders
                  .filter(o => !selectedClient || o.clientId === selectedClient)
                  .map(order => (
                    <div key={order.id} className="flex items-center mb-2 border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                      <input
                        type="checkbox"
                        id={`os-${order.id}`}
                        checked={formData.relatedOrders?.includes(order.id)}
                        onChange={(e) => {
                          const current = formData.relatedOrders || [];
                          if (e.target.checked) {
                            handleInputChange('relatedOrders', [...current, order.id]);
                          } else {
                            handleInputChange('relatedOrders', current.filter(id => id !== order.id));
                          }
                        }}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`os-${order.id}`} className="flex-1 cursor-pointer flex justify-between items-center sm:pr-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">#{order.id.slice(0, 8)} - {order.serviceType}</div>
                          <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</div>
                        </div>
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${order.status === 'concluida' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelada' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {order.status}
                        </div>
                      </label>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {project ? 'Salvar Alterações' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;