import React from 'react';

interface ProjectProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({ 
  progress, 
  size = 'md', 
  showLabel = true,
  color = 'blue' 
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500'
  };

  const getProgressColor = () => {
    if (color !== undefined) return colorClasses[color];
    
    if (clampedProgress >= 80) return colorClasses.green;
    if (clampedProgress >= 60) return colorClasses.blue;
    if (clampedProgress >= 40) return colorClasses.yellow;
    if (clampedProgress >= 20) return 'bg-orange-500';
    return colorClasses.red;
  };

  const getLabelColor = () => {
    if (clampedProgress >= 80) return 'text-green-600';
    if (clampedProgress >= 60) return 'text-blue-600';
    if (clampedProgress >= 40) return 'text-yellow-600';
    if (clampedProgress >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full">
      <div className={`relative w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`h-full transition-all duration-300 ease-out ${getProgressColor()}`}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className={`text-xs font-medium ${getLabelColor()}`}>
            {clampedProgress}% Completo
          </span>
          <span className="text-xs text-gray-500">
            {clampedProgress >= 100 ? 'Concluído' : 'Em Progresso'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectProgressBar;