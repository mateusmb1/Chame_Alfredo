import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DashboardTheme = 'classic' | 'commandCenter';

interface DashboardThemeContextType {
    theme: DashboardTheme;
    setTheme: (theme: DashboardTheme) => void;
    toggleTheme: () => void;
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined);

export const DashboardThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<DashboardTheme>(() => {
        const saved = localStorage.getItem('dashboard-theme');
        return (saved as DashboardTheme) || 'commandCenter';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-dashboard-theme', theme);
        localStorage.setItem('dashboard-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'classic' ? 'commandCenter' : 'classic');
    };

    return (
        <DashboardThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </DashboardThemeContext.Provider>
    );
};

export const useDashboardTheme = () => {
    const context = useContext(DashboardThemeContext);
    if (context === undefined) {
        throw new Error('useDashboardTheme must be used within a DashboardThemeProvider');
    }
    return context;
};
