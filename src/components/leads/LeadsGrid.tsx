
import React, { useState } from 'react'
import { useLeadsList } from '../../hooks/useLeadsList'
import { LeadCard } from './LeadCard'
import { LeadsFilter } from './LeadsFilter'
import { LeadDetailModal } from './LeadDetailModal'
import { Lead } from '../../hooks/useLeadsList'

export const LeadsGrid: React.FC = () => {
    const { leads, loading, filters, setFilters, page, setPage, total, totalPages, fetchLeads } = useLeadsList()
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const handleSelect = (lead: Lead) => {
        setSelectedLead(lead)
        setIsModalOpen(true)
    }

    const toggleCheck = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds)
        if (checked) newSet.add(id)
        else newSet.delete(id)
        setSelectedIds(newSet)
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Quadro de Leads Capturados</h1>

            <LeadsFilter filters={filters} onChange={setFilters} />

            {/* Bulk Actions Bar could go here */}
            {selectedIds.size > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 p-2 rounded mb-4 flex items-center justify-between">
                    <span className="text-indigo-700 text-sm font-medium px-2">{selectedIds.size} selecionados</span>
                    <div className="space-x-2">
                        <button className="text-xs bg-white border px-2 py-1 rounded shadow-sm hover:bg-gray-50">Mudar Status</button>
                        <button className="text-xs bg-white border px-2 py-1 rounded shadow-sm hover:bg-gray-50">Exportar</button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {leads.map(lead => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onSelect={handleSelect}
                            checked={selectedIds.has(lead.id)}
                            onCheck={(checked) => toggleCheck(lead.id, checked)}
                        />
                    ))}

                    {leads.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Nenhum lead encontrado com os filtros atuais.
                        </div>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50 bg-white"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1 text-gray-600">
                        Página {page + 1} de {totalPages}
                    </span>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50 bg-white"
                    >
                        Próxima
                    </button>
                </div>
            )}

            <LeadDetailModal
                lead={selectedLead}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={fetchLeads} // Refresh list on update
            />
        </div>
    )
}
