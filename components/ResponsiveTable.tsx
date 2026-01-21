import React, { memo } from 'react';
import { useResponsive } from '../src/hooks/useResponsive';
import { Loader2, Info } from 'lucide-react';

export interface Column<T = any> {
    key: string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
    width?: string;
    sortable?: boolean;
}

export interface ResponsiveTableProps<T = any> {
    columns: Column<T>[];
    data: T[];
    rowClick?: (row: T) => void;
    loading?: boolean;
    emptyMessage?: string;
    mobileLayout?: 'card' | 'compact';
}

/**
 * ResponsiveTable Component
 * Adapts between a standard HTML table on desktop and a card-based layout on mobile/tablet.
 */
const ResponsiveTableComponent = <T extends Record<string, any>>({
    columns,
    data,
    rowClick,
    loading = false,
    emptyMessage = 'Nenhum dado encontrado',
    mobileLayout = 'card',
}: ResponsiveTableProps<T>) => {
    const { isMobile, breakpoint } = useResponsive();
    const isDesktop = !isMobile;
    const isTablet = isMobile && breakpoint === 'sm';
    const isPhone = isMobile && breakpoint === 'xs';

    if (loading) {
        return (
            <div className="w-full space-y-4 animate-pulse" role="status" aria-label="Carregando dados">
                {isDesktop ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 h-12 border-b border-slate-200" />
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 border-b border-slate-100 last:border-0" />
                        ))}
                    </div>
                ) : (
                    <div className={`grid gap-4 ${isTablet ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-slate-100 h-40 rounded-lg shadow-sm" />
                        ))}
                    </div>
                )}
                <div className="flex items-center justify-center py-4 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Carregando informações...</span>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full py-12 flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-500">
                <Info className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-lg font-medium">{emptyMessage}</p>
            </div>
        );
    }

    // --- DESKTOP VIEW: Standard Table ---
    if (isDesktop) {
        return (
            <div className="w-full overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse" aria-label="Tabela de dados">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-4 text-sm font-semibold text-slate-600 tracking-wider"
                                    style={col.width ? { width: col.width } : {}}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, index) => (
                            <tr
                                key={row.id || index}
                                onClick={() => rowClick?.(row)}
                                className={`group transition-colors duration-150 ${rowClick ? 'cursor-pointer hover:bg-blue-50/50' : ''
                                    } ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // --- MOBILE/TABLET VIEW: Card Layout ---
    return (
        <div
            className={`grid gap-4 ${isTablet ? 'grid-cols-2' : 'grid-cols-1'}`}
            role="list"
            aria-label="Lista de dados responsiva"
        >
            {data.map((row, index) => (
                <div
                    key={row.id || index}
                    onClick={() => rowClick?.(row)}
                    className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 transition-all active:scale-[0.98] ${rowClick ? 'cursor-pointer hover:border-blue-300' : ''
                        } ${mobileLayout === 'compact' ? 'flex items-center justify-between' : 'flex flex-col gap-3'}`}
                    role="listitem"
                >
                    {mobileLayout === 'card' ? (
                        <>
                            {columns.map((col) => (
                                <div key={col.key} className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                                        {col.label}
                                    </span>
                                    <div className="text-sm font-medium text-slate-800">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-900 truncate">
                                    {columns[1] ? (columns[1].render ? columns[1].render(row[columns[1].key], row) : row[columns[1].key]) : row[columns[0].key]}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                    {columns[0].label}: {row[columns[0].key]}
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                {columns.find(c => c.key === 'status') && (
                                    <div>{columns.find(c => c.key === 'status')?.render?.(row['status'], row) || row['status']}</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export const ResponsiveTable = memo(ResponsiveTableComponent) as typeof ResponsiveTableComponent;
