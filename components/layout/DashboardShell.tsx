import React, { ReactNode } from 'react';
import SidebarNav from './SidebarNav';
import Topbar from './Topbar';
import { useDashboardTheme } from '../../contexts/DashboardThemeContext';

interface DashboardShellProps {
    children: ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
    const { theme } = useDashboardTheme();

    if (theme === 'classic') {
        // Return or import old layout logic if needed, 
        // but for now we focus on the new structural wrapper.
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-all duration-500">
            {/* Sidebar - Compact and Hidden on Small Screens */}
            <aside className="hidden lg:flex flex-col z-50">
                <SidebarNav />
            </aside>

            {/* Main Container */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
                <Topbar />

                {/* Dynamic Page Content */}
                <main className="flex-1 w-full max-w-[1920px] mx-auto overflow-y-auto custom-scrollbar p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardShell;
