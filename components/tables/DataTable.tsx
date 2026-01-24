import React, { ReactNode } from 'react';

interface ColumnDef<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    density?: 'compact' | 'comfortable';
    onRowClick?: (row: T) => void;
    rowActions?: (row: T) => ReactNode;
}

function DataTable<T extends { id: string | number }>({
    columns,
    data,
    density = 'compact',
    onRowClick,
    rowActions
}: DataTableProps<T>) {
    const paddingClass = density === 'compact' ? 'py-2 px-3' : 'py-3 px-4';

    return (
        <div className="w-full overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 transition-all">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 dark:bg-slate-900 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={`text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ${paddingClass} ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                            {rowActions && <th className={paddingClass}></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-12 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">Nenhum registro encontrado</p>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row.id}
                                    onClick={() => onRowClick?.(row)}
                                    className={`group transition-all ${onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40' : ''}`}
                                >
                                    {columns.map((col, idx) => (
                                        <td key={idx} className={`text-[11px] font-medium text-slate-700 dark:text-slate-300 ${paddingClass} ${col.className || ''}`}>
                                            {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as ReactNode)}
                                        </td>
                                    ))}
                                    {rowActions && (
                                        <td className={`w-10 ${paddingClass}`}>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                {rowActions(row)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;
