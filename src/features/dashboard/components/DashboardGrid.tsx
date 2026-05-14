import React, { ReactNode } from 'react';

interface DashboardGridProps {
    columns?: 2 | 3 | 4;
    density?: 'compact' | 'comfortable';
    children: ReactNode;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
    columns = 3,
    density = 'compact',
    children
}) => {
    const gapClasses = density === 'compact' ? 'gap-3 lg:gap-4' : 'gap-6';

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 ${gapClasses} w-full animate-in fade-in zoom-in-95 duration-500`}>
            {children}
        </div>
    );
};

export default DashboardGrid;
