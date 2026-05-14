import React, { ReactNode } from 'react';

interface PageShellProps {
    title: string;
    breadcrumb?: string[];
    actions?: ReactNode;
    children: ReactNode;
}

const PageShell: React.FC<PageShellProps> = ({ title, breadcrumb, actions, children }) => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    {breadcrumb && (
                        <nav className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">
                            {breadcrumb.map((item, idx) => (
                                <React.Fragment key={item}>
                                    <span>{item}</span>
                                    {idx < breadcrumb.length - 1 && <span className="opacity-30">/</span>}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-tight">
                        {title}
                    </h1>
                </div>

                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>

            {/* Main Page Area */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

export default PageShell;
