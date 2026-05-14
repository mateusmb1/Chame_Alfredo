import React from 'react';

interface ProjectTypeIconProps {
  type: 'instalacao' | 'manutencao' | 'consultoria' | 'suporte' | 'inspecao' | 'treinamento' | 'outro';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ProjectTypeIcon: React.FC<ProjectTypeIconProps> = ({ type, size = 'md', className = '' }) => {
  const getIconConfig = () => {
    switch (type) {
      case 'instalacao':
        return {
          icon: 'build',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          label: 'Instalação'
        };
      case 'manutencao':
        return {
          icon: 'construction',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Manutenção'
        };
      case 'consultoria':
        return {
          icon: 'psychology',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          label: 'Consultoria'
        };
      case 'suporte':
        return {
          icon: 'support_agent',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          label: 'Suporte'
        };
      case 'inspecao':
        return {
          icon: 'search',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100',
          label: 'Inspeção'
        };
      case 'treinamento':
        return {
          icon: 'school',
          color: 'text-teal-600',
          bgColor: 'bg-teal-100',
          label: 'Treinamento'
        };
      case 'outro':
        return {
          icon: 'more_horiz',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: 'Outro'
        };
      default:
        return {
          icon: 'help_outline',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: 'Desconhecido'
        };
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-lg',
    xl: 'w-12 h-12 text-xl'
  };

  const config = getIconConfig();

  return (
    <div className={`inline-flex items-center justify-center rounded-lg ${config.bgColor} ${sizeClasses[size]} ${className}`}>
      <span className={`material-symbols-outlined ${config.color}`}>
        {config.icon}
      </span>
    </div>
  );
};

export default ProjectTypeIcon;