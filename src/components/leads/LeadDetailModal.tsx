
import React, { useState, useEffect } from 'react'
import { Lead } from '../../hooks/useLeadsList'
import { useLeadDetail } from '../../hooks/useLeadDetail'
import { format } from 'date-fns'

interface LeadDetailModalProps {
    lead: Lead | null
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
}



export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isOpen, onClose, onUpdate }) => {
    const { updateLead, loading } = useLeadDetail()
    const [status, setStatus] = useState<Lead['status']>('novo')
    const [priority, setPriority] = useState<string>('media')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (lead) {
            setStatus(lead.status)
            setPriority(lead.priority)
            setNotes(lead.description || '')
        }
    }, [lead])

    if (!isOpen || !lead) return null

    const handleSave = async () => {
        const success = await updateLead(lead.id, {
            status,
            priority: priority as any,
            description: notes
        })
        if (success) {
            onUpdate()
            onClose()
        }
    }

    const waLink = `https://wa.me/55${lead.phone?.replace(/\D/g, '') || ''}?text=Olá ${lead.name}, sobre sua solicitação...`

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-800">
                        Detalhes do Lead <span className="text-gray-500 font-mono text-base">#{lead.id.substring(0, 8)}</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <div className="p-6 grid gap-6">
                    {/* Client/Lead Info */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-3">Dados do Contato</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 block">Nome</label>
                                <p className="font-medium">{lead.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block">Telefone</label>
                                <p className="font-medium">{lead.phone || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block">Email</label>
                                <p className="font-medium">{lead.email || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block">Origem</label>
                                <p className="font-medium capitalize">{lead.origin}</p>
                            </div>
                        </div>
                    </div>

                    {/* Context Info */}
                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-2">Interesse</h3>
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-100">
                            <p className="font-bold text-blue-800">{lead.service_interest}</p>
                            <p className="mt-1">Valor Esperado: {lead.expected_value ? `R$ ${lead.expected_value}` : '-'}</p>
                            <p className="mt-2 text-xs text-gray-400">Criado em: {new Date(lead.created_at).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Editable Fields */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">Gerenciar Lead</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full border rounded p-2 bg-white"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                >
                                    <option value="novo">Novo</option>
                                    <option value="qualificado">Qualificado</option>
                                    <option value="convertido">Convertido</option>
                                    <option value="perdido">Perdido</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                                <select
                                    className="w-full border rounded p-2 bg-white"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="urgente">Urgente</option>
                                    <option value="alta">Alta</option>
                                    <option value="media">Média</option>
                                    <option value="baixa">Baixa</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observações / Descrição</label>
                            <textarea
                                className="w-full border rounded p-2 h-24"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium flex items-center"
                    >
                        <span className="mr-2">📲</span> Enviar Msg WhatsApp
                    </a>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 flex-1 md:flex-none"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex-1 md:flex-none disabled:bg-indigo-400"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

