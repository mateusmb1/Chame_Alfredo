
import React from 'react'
import { LeadFiltersState } from '../../hooks/useLeadsList'

interface LeadsFilterProps {
    filters: LeadFiltersState
    onChange: (filters: LeadFiltersState) => void
}

export const LeadsFilter: React.FC<LeadsFilterProps> = ({ filters, onChange }) => {
    const handleChange = (key: keyof LeadFiltersState, value: string) => {
        onChange({ ...filters, [key]: value || undefined })
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex flex-col w-full md:w-auto flex-1 min-w-[200px]">
                <label className="text-xs font-medium text-gray-500 mb-1">Buscar</label>
                <input
                    type="text"
                    placeholder="Nome, Protocolo..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.search || ''}
                    onChange={(e) => handleChange('search', e.target.value)}
                />
            </div>

            <div className="flex flex-col w-1/2 md:w-auto">
                <label className="text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={filters.status || ''}
                    onChange={(e) => handleChange('status', e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="nova">Nova</option>
                    <option value="agendada">Agendada</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                </select>
            </div>

            <div className="flex flex-col w-1/2 md:w-auto">
                <label className="text-xs font-medium text-gray-500 mb-1">Prioridade</label>
                <select
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={filters.priority || ''}
                    onChange={(e) => handleChange('priority', e.target.value)}
                >
                    <option value="">Todas</option>
                    <option value="urgente">Urgente</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                </select>
            </div>

            <div className="flex flex-col w-1/2 md:w-auto">
                <label className="text-xs font-medium text-gray-500 mb-1">Período</label>
                <select
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={filters.dateRange || ''}
                    onChange={(e) => handleChange('dateRange', e.target.value)}
                >
                    <option value="">Todo o período</option>
                    <option value="24h">Últimas 24h</option>
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                </select>
            </div>

            <div className="flex flex-col w-1/2 md:w-auto">
                <label className="text-xs font-medium text-gray-500 mb-1">Origem</label>
                <select
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={filters.origin || ''}
                    onChange={(e) => handleChange('origin', e.target.value)}
                >
                    <option value="">Todas</option>
                    <option value="landing_form">Site</option>
                    <option value="admin_manual">Manual</option>
                    <option value="phone">Telefone</option>
                </select>
            </div>

            {(filters.status || filters.priority || filters.origin || filters.dateRange || filters.search) && (
                <button
                    onClick={() => onChange({})}
                    className="text-sm text-red-600 underline md:ml-auto"
                >
                    Limpar filtros
                </button>
            )}
        </div>
    )
}
