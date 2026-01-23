import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProjectStatusBadge from '../components/ProjectStatusBadge';
import ProjectProgressBar from '../components/ProjectProgressBar';
import ProjectTypeIcon from '../components/ProjectTypeIcon';
import { useApp } from '../contexts/AppContext';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, clients, technicians, orders, projectActivities } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'documents' | 'notes' | 'timeline'>('overview');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex h-full flex-col p-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Projeto não encontrado</h1>
            <Link to="/projects" className="text-primary hover:text-primary/80">Voltar para Projetos</Link>
          </div>
        </div>
      </div>
    );
  }

  const client = clients.find(c => c.id === project.clientId);
  const manager = technicians.find(t => t.id === project.responsibleId);
  const projectOrders = orders.filter(order => order.projectId === project.id);
  const activities = projectActivities
    .filter(activity => activity.projectId === project.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const teamMembers = technicians.filter(tech => project.team.map(m => m.technicianId).includes(tech.id));

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planejamento': return 'Planejamento';
      case 'em_andamento': return 'Em Andamento';
      case 'em_pausa': return 'Em Pausa';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'arquivado': return 'Arquivado';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'Baixa';
      case 'normal': return 'Normal';
      case 'alta': return 'Alta';
      case 'urgente': return 'Urgente';
      default: return priority;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'instalacao': return 'Instalação';
      case 'manutencao': return 'Manutenção';
      case 'consultoria': return 'Consultoria';
      case 'suporte': return 'Suporte';
      case 'inspecao': return 'Inspeção';
      case 'treinamento': return 'Treinamento';
      case 'outro': return 'Outro';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change': return 'swap_horiz';
      case 'member_added': return 'person_add';
      case 'member_removed': return 'person_remove';
      case 'document_added': return 'description';
      case 'note_added': return 'note_add';
      case 'order_linked': return 'link';
      case 'criacao': return 'add_task';
      case 'task_completed': return 'check_circle';
      default: return 'info';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'status_change': return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
      case 'member_added': return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
      case 'member_removed': return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
      case 'document_added': return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300';
      case 'note_added': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
      case 'order_linked': return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300';
      case 'criacao': return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
      case 'task_completed': return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="flex h-full flex-col p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Link to="/dashboard" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
            <span className="text-gray-400 text-sm font-medium">/</span>
            <Link to="/projects" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary">Projetos</Link>
            <span className="text-gray-400 text-sm font-medium">/</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">#{project.id}</span>
          </div>

          {/* Page Heading & Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <ProjectTypeIcon type={project.type} size="lg" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{project.name}</h1>
                  <ProjectStatusBadge status={project.status} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">#{project.id} • {getTypeLabel(project.type)}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
                <span className="material-symbols-outlined text-base">edit</span>
                <span className="truncate">Editar Projeto</span>
              </button>
              <Link to={`/new-order?projectId=${project.id}`} className="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-emerald-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-emerald-700">
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span className="truncate">Criar OS</span>
              </Link>
              <button className="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-base">add_task</span>
                <span className="truncate">Nova Tarefa</span>
              </button>
              <button className="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-base">description</span>
                <span className="truncate">Adicionar Doc</span>
              </button>
              <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-xl">more_vert</span>
              </button>
            </div>
          </div>
        </header>

        {/* Progress Overview */}
        <div className="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Progresso do Projeto</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
            <ProjectProgressBar progress={project.progress || 0} size="lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.progress || 0}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Progresso</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectOrders.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ordens de Serviço</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teamMembers.length + 1}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Membros</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {project.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Orçamento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', label: 'Visão Geral', icon: 'dashboard' },
                { id: 'tasks', label: 'Tarefas', icon: 'task' },
                { id: 'team', label: 'Equipe', icon: 'groups' },
                { id: 'documents', label: 'Documentos', icon: 'description' },
                { id: 'notes', label: 'Notas', icon: 'note' },
                { id: 'timeline', label: 'Timeline', icon: 'schedule' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detalhes do Projeto</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Descrição</p>
                      <p className="text-gray-900 dark:text-white">{project.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo</p>
                        <div className="flex items-center gap-2">
                          <ProjectTypeIcon type={project.type} size="sm" />
                          <span className="text-sm text-gray-900 dark:text-white">{getTypeLabel(project.type)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Data de Início</p>
                        <p className="text-gray-900 dark:text-white">{formatDate(project.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Data de Término</p>
                        <p className="text-gray-900 dark:text-white">{formatDate(project.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detalhes do Cliente</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome</p>
                      <p className="text-gray-900 dark:text-white">{client?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-gray-900 dark:text-white">{client?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Telefone</p>
                      <p className="text-gray-900 dark:text-white">{client?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Endereço</p>
                      <p className="text-gray-900 dark:text-white">{client?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tarefas do Projeto</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Nova Tarefa
                  </button>
                </div>
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">task</span>
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma tarefa cadastrada ainda.</p>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Equipe do Projeto</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    Adicionar Membro
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Manager */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">person</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{manager?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Gerente do Projeto</p>
                    </div>
                  </div>

                  {/* Team Members */}
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">person</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.specialization?.[0] || 'Técnico'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Documentos do Projeto</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Upload Documento
                  </button>
                </div>
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">description</span>
                  <p className="text-gray-500 dark:text-gray-400">Nenhum documento anexado ainda.</p>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notas do Projeto</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    <span className="material-symbols-outlined text-sm">note_add</span>
                    Nova Nota
                  </button>
                </div>
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">note</span>
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma nota cadastrada ainda.</p>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Timeline do Projeto</h3>
                {activities.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">schedule</span>
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma atividade registrada ainda.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-6">
                      {activities.map((activity, index) => (
                        <div key={activity.id} className="relative flex items-start gap-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getActivityColor(activity.type)}`}>
                            <span className="material-symbols-outlined text-sm">{getActivityIcon(activity.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{activity.description}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(activity.timestamp)}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Por: {activity.performedBy}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
