import React from 'react';

interface ProjectStatusBadgeProps {
  status: 'planejamento' | 'em_andamento' | 'em_pausa' | 'concluido' | 'cancelado' | 'arquivado';
  size?: 'sm' | 'md' | 'lg';
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'planejamento':
        return {
          label: 'Planejamento',
          className: 'bg-blue-100 text-blue-700 border-blue-200',
          dotClassName: 'bg-blue-500'
        };
      case 'em_andamento':
        return {
          label: 'Em Andamento',
          className: 'bg-green-100 text-green-700 border-green-200',
          dotClassName: 'bg-green-500'
        };
      case 'em_pausa':
        return {
          label: 'Em Pausa',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          dotClassName: 'bg-yellow-500'
        };
      case 'concluido':
        return {
          label: 'Concluído',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          dotClassName: 'bg-gray-500'
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          className: 'bg-red-100 text-red-700 border-red-200',
          dotClassName: 'bg-red-500'
        };
      case 'arquivado':
        return {
          label: 'Arquivado',
          className: 'bg-gray-100 text-gray-500 border-gray-200',
          dotClassName: 'bg-gray-400'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          dotClassName: 'bg-gray-500'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border ${config.className} ${sizeClasses[size]}`}>
      <span className={`w-2 h-2 rounded-full ${config.dotClassName}`}></span>
      {config.label}
    </span>
  );
};

export default ProjectStatusBadge;