import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Check } from 'lucide-react';
import { ValidationResult } from '../utils/csvImporters';

interface ImportPreviewTableProps<T> {
    data: Array<{ data: T; validation: ValidationResult; selected: boolean }>;
    columns: Array<{ key: keyof T; label: string }>;
    onToggleSelect: (index: number) => void;
    onSelectAll: () => void;
    allSelected: boolean;
}

export function ImportPreviewTable<T extends Record<string, unknown>>({
    data,
    columns,
    onToggleSelect,
    onSelectAll,
    allSelected,
}: ImportPreviewTableProps<T>) {
    const getStatusIcon = (validation: ValidationResult) => {
        if (!validation.valid) {
            return <XCircle className="w-5 h-5 text-red-500" />;
        }
        if (validation.warnings.length > 0) {
            return <AlertTriangle className="w-5 h-5 text-amber-500" />;
        }
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    };

    const getStatusTooltip = (validation: ValidationResult): string => {
        if (validation.errors.length > 0) {
            return validation.errors.join('; ');
        }
        if (validation.warnings.length > 0) {
            return validation.warnings.join('; ');
        }
        return 'Válido para importação';
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Nenhum dado para exibir. Faça upload de um arquivo CSV.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-4 py-3 text-left">
                            <button
                                onClick={onSelectAll}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${allSelected
                                        ? 'bg-primary border-primary text-white'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                    }`}
                            >
                                {allSelected && <Check className="w-3 h-3" />}
                            </button>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Status
                        </th>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#0f1729] divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((row, index) => (
                        <tr
                            key={index}
                            className={`transition-colors ${row.selected
                                    ? 'bg-primary/5 dark:bg-primary/10'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                } ${!row.validation.valid ? 'opacity-60' : ''}`}
                        >
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => onToggleSelect(index)}
                                    disabled={!row.validation.valid}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${row.selected
                                            ? 'bg-primary border-primary text-white'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                        } ${!row.validation.valid ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    {row.selected && <Check className="w-3 h-3" />}
                                </button>
                            </td>
                            <td className="px-4 py-3">
                                <div title={getStatusTooltip(row.validation)}>
                                    {getStatusIcon(row.validation)}
                                </div>
                            </td>
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate"
                                    title={String(row.data[col.key] || '')}
                                >
                                    {String(row.data[col.key] || '-')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ImportPreviewTable;
