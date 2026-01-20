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
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  Clock,
  User,
  Briefcase,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

const Projects: React.FC = () => {
  const { projects, clients, technicians, addProject, updateProject, deleteProject } = useApp();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const activeProjects = projects.filter(p => p.status === 'em_andamento').length;
  const completedProjects = projects.filter(p => p.status === 'concluido').length;
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d121b] dark:text-white tracking-tight">Projetos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Gestão de obras, instalações e contratos de longo prazo.</p>
        </div>
        <button
          onClick={handleOpenNewProjectModal}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Projetos Ativos', value: activeProjects, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Concluídos', value: completedProjects, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Progresso Médio', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Total Projetos', value: projects.length, icon: Layers, color: 'text-gray-500', bg: 'bg-gray-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#101622] p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider leading-none mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-[#0d121b] dark:text-white leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & View Controls */}
      <div className="bg-white dark:bg-[#101622] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider focus:ring-2 focus:ring-primary/20 dark:text-white cursor-pointer"
          >
            <option value="all">TODOS STATUS</option>
            <option value="planejamento">PLANEJAMENTO</option>
            <option value="em_andamento">EM ANDAMENTO</option>
            <option value="em_pausa">EM PAUSA</option>
            <option value="concluido">CONCLUÍDO</option>
          </select>
          <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#101622] text-primary shadow-sm' : 'text-gray-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#101622] text-primary shadow-sm' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6" : "space-y-4"}>
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-20 bg-white dark:bg-[#101622] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400">
            <Layers className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-sm text-gray-500">Nenhum projeto encontrado</p>
          </div>
        ) : (
          filteredProjects.map(project => {
            const client = clients.find(c => c.id === project.clientId);
            const manager = technicians.find(t => t.id === project.responsibleId);
            const progress = project.progress || 0;

            if (viewMode === 'list') {
              return (
                <div key={project.id} className="bg-white dark:bg-[#101622] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 group">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <ProjectTypeIcon type={project.type} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link to={`/projects/${project.id}`} className="font-bold text-[#0d121b] dark:text-white truncate hover:text-primary transition-colors">
                        {project.name}
                      </Link>
                      <ProjectStatusBadge status={project.status} size="sm" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium truncate">{client?.name || 'Cliente indefinido'}</p>
                  </div>
                  <div className="hidden md:block w-32 px-4">
                    <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      <span>Progresso</span>
                      <span>{progress}%</span>
                    </div>
                    <ProjectProgressBar progress={progress} size="sm" showLabel={false} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/projects/${project.id}`} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleOpenEditModal(project)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(project.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={project.id} className="bg-white dark:bg-[#101622] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-[#0d121b] dark:text-white">
                    <ProjectTypeIcon type={project.type} size="md" />
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </div>

                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">PROJ-{project.id.slice(0, 4)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-800 mb-1" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">{project.type}</span>
                  </div>
                  <Link to={`/projects/${project.id}`} className="block font-bold text-lg text-[#0d121b] dark:text-white leading-tight group-hover:text-primary transition-colors truncate">
                    {project.name}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2">{project.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    <span>Conclusão</span>
                    <span className="text-[#0d121b] dark:text-white">{progress}%</span>
                  </div>
                  <ProjectProgressBar progress={progress} size="md" showLabel={false} />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-2xl mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black">
                      {manager?.name.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none">Responsável</span>
                      <span className="text-xs font-bold text-[#0d121b] dark:text-white leading-none mt-1">{manager?.name.split(' ')[0] || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none">Prazo</span>
                    <span className="text-xs font-bold text-[#0d121b] dark:text-white leading-none mt-1">{new Date(project.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/projects/${project.id}`} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-white/5 text-[#0d121b] dark:text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>Ver Mais</span>
                  </Link>
                  <button onClick={() => handleOpenEditModal(project)} className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteClick(project.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Projeto"
        message="Deseja realmente excluir este projeto? Esta ação removerá permanentemente todos os dados associados, incluindo ordens de serviço e cronograma."
        confirmText="Sim, Excluir"
        cancelText="Manter Projeto"
        type="danger"
      />

      {isModalOpen && (
        <ProjectForm
          project={isEditMode && editingProjectId ? projects.find(p => p.id === editingProjectId) : undefined}
          clients={clients}
          technicians={technicians}
          onSave={(projectData) => {
            if (isEditMode && editingProjectId) {
              updateProject(editingProjectId, projectData);
              showToast('success', 'Projeto atualizado!');
            } else {
              addProject(projectData);
              showToast('success', 'Projeto criado!');
            }
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Projects;
