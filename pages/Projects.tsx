import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ProjectStatusBadge from '../components/ProjectStatusBadge';
import ProjectProgressBar from '../components/ProjectProgressBar';
import ProjectTypeIcon from '../components/ProjectTypeIcon';
import ProjectForm from '../components/ProjectForm';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Project } from '../types/project';

const Projects: React.FC = () => {
  const { projects, clients, technicians, addProject, updateProject, deleteProject } = useApp();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const handleOpenNewProjectModal = () => {
    setIsEditMode(false);
    setEditingProjectId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setIsEditMode(true);
    setEditingProjectId(project.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      showToast('success', 'Projeto excluído com sucesso!');
    }
    setProjectToDelete(null);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planejamento': return 'Planejamento';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'concluido': return 'Concluído';
      case 'arquivado': return 'Arquivado';
      default: return status;
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

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesType = typeFilter === 'all' || project.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [projects, searchTerm, statusFilter, typeFilter]);

  // Group projects by status for kanban view
  const groupedProjects = useMemo(() => {
    const groups = {
      planejamento: filteredProjects.filter(p => p.status === 'planejamento'),
      em_andamento: filteredProjects.filter(p => p.status === 'em_andamento'),
      em_pausa: filteredProjects.filter(p => p.status === 'em_pausa'),
      concluido: filteredProjects.filter(p => p.status === 'concluido'),
      cancelado: filteredProjects.filter(p => p.status === 'cancelado'),
      arquivado: filteredProjects.filter(p => p.status === 'arquivado')
    };
    return groups;
  }, [filteredProjects]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projetos</h1>
          <button
            onClick={handleOpenNewProjectModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Novo Projeto
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Todos os Status</option>
            <option value="planejamento">Planejamento</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="pendente">Pendente</option>
            <option value="concluido">Concluído</option>
            <option value="arquivado">Arquivado</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Todos os Tipos</option>
            <option value="instalacao">Instalação</option>
            <option value="manutencao">Manutenção</option>
            <option value="consultoria">Consultoria</option>
            <option value="suporte">Suporte</option>
            <option value="outro">Outro</option>
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 text-sm ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(groupedProjects).map(([status, statusProjects]) => (
            <div key={status} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{getStatusLabel(status)}</h3>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {statusProjects.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-4 flex-1 p-1">
                {statusProjects.length === 0 ? (
                  <div className="flex items-center justify-center min-h-40 md:min-h-48 bg-gray-50 dark:bg-transparent rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
                    <span className="text-sm text-gray-400">Nenhum projeto</span>
                  </div>
                ) : (
                  statusProjects.map(project => {
                    const client = clients.find(c => c.id === project.clientId);
                    const manager = technicians.find(t => t.id === project.responsibleId);
                    const progress = project.progress || 0;
                    
                    return (
                      <div key={project.id} className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <ProjectTypeIcon type={project.type} size="sm" />
                            <div>
                              <Link 
                                to={`/projects/${project.id}`}
                                className="text-base font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
                              >
                                {project.name}
                              </Link>
                              <p className="text-xs text-gray-500 dark:text-gray-400">#{project.id}</p>
                            </div>
                          </div>
                          <ProjectStatusBadge status={project.status} size="sm" />
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Progresso</span>
                            <span>{progress}%</span>
                          </div>
                          <ProjectProgressBar progress={progress} size="sm" showLabel={false} />
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                          <div className="text-xs text-gray-500">
                            <p>Cliente: <span className="font-medium">{client?.name || 'N/A'}</span></p>
                            <p>Gerente: <span className="font-medium">{manager?.name || 'N/A'}</span></p>
                          </div>
                          <div className="flex items-center gap-1" />
                        </div>
                        
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-3">
                          <Link
                            to={`/projects/${project.id}`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Ver Detalhes"
                          >
                            <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">visibility</span>
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(project.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Excluir"
                          >
                            <span className="material-symbols-outlined text-base text-red-600 dark:text-red-400">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Projeto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progresso</th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data Final</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredProjects.map(project => {
                  const client = clients.find(c => c.id === project.clientId);
                  const progress = project.progress || 0;
                  
                  return (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ProjectTypeIcon type={project.type} size="sm" />
                          <div className="ml-3">
                            <Link 
                              to={`/projects/${project.id}`}
                              className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary"
                            >
                              {project.name}
                            </Link>
                            <div className="text-xs text-gray-500 dark:text-gray-400">#{project.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {client?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">{getTypeLabel(project.type)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ProjectStatusBadge status={project.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <ProjectProgressBar progress={progress} size="sm" showLabel={false} />
                          </div>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">{progress}%</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(project.endDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${project.id}`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Ver Detalhes"
                          >
                            <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">visibility</span>
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(project.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Excluir"
                          >
                            <span className="material-symbols-outlined text-base text-red-600 dark:text-red-400">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Projeto"
        message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Project Form Modal */}
      {isModalOpen && (
        <ProjectForm
          project={isEditMode && editingProjectId ? projects.find(p => p.id === editingProjectId) : undefined}
          clients={clients}
          technicians={technicians}
          onSave={(projectData) => {
            if (isEditMode && editingProjectId) {
              updateProject(editingProjectId, projectData);
              showToast('success', 'Projeto atualizado com sucesso!');
            } else {
              addProject(projectData);
              showToast('success', 'Projeto criado com sucesso!');
            }
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Projects;
