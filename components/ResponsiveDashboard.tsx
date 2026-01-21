import React, { memo } from 'react';
import { useResponsive } from '../src/hooks/useResponsive';

type GapSize = 'sm' | 'md' | 'lg';

export interface ResponsiveDashboardProps {
    children: React.ReactNode;
    gap?: GapSize;
    maxCols?: number;
    className?: string;
}

const gapMap: Record<GapSize, string> = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
};

/**
 * ResponsiveDashboard Component
 * A flexible grid container for dashboard cards and components.
 * Automatically adjusts columns based on screen size.
 */
const ResponsiveDashboardComponent = ({
    children,
    gap = 'md',
    maxCols = 4,
    className = '',
}: ResponsiveDashboardProps) => {
    const { isMobile, breakpoint } = useResponsive();

    // Determine grid columns based on breakpoint and maxCols
    const getGridCols = () => {
        if (breakpoint === 'xs') return 'grid-cols-1';
        if (breakpoint === 'sm') return 'grid-cols-2';
        if (breakpoint === 'md') return 'grid-cols-2 lg:grid-cols-3';

        // For lg and above, we respect maxCols
        if (maxCols === 1) return 'lg:grid-cols-1';
        if (maxCols === 2) return 'lg:grid-cols-2';
        if (maxCols === 3) return 'lg:grid-cols-3';

        // Default for lg+ is up to 4 columns
        return 'lg:grid-cols-3 xl:grid-cols-4';
    };

    return (
        <div className={`w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
            <div
                className={`grid ${getGridCols()} ${gapMap[gap]} transition-all duration-300`}
                role="region"
                aria-label="Dashboard Grid"
            >
                {children}
            </div>
        </div>
    );
};

export const ResponsiveDashboard = memo(ResponsiveDashboardComponent);
