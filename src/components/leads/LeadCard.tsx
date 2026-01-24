
import React from 'react'
import { Lead } from '../../hooks/useLeadsList'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'

interface LeadCardProps {
    lead: Lead
    onSelect: (lead: Lead) => void
    checked?: boolean
    onCheck?: (checked: boolean) => void
}

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors: Record<string, string> = {
        urgente: 'bg-red-100 text-red-800 border-red-200',
        alta: 'bg-orange-100 text-orange-800 border-orange-200',
        media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        baixa: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    const colorClass = colors[priority] || colors.baixa
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClass} uppercase`}>
            {priority}
        </span>
    )
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onSelect, checked, onCheck }) => {
    const navigate = useNavigate()
    const timeAgo = formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })

    // Use lead.phone directly or fallback
    const safePhone = lead.phone?.replace(/\D/g, '') || ''
    const waLink = `https://wa.me/55${safePhone}`

    const handleCreateQuote = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigate('/quotes/new', { state: { lead } })
    }

    const handleCreateOrder = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigate('/orders/new', { state: { lead } })
    }

    // Determine conversion status
    const isConverted = !!lead.client_id || lead.status === 'convertido'

    return (
        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 mb-3 flex flex-col md:flex-row items-start md:items-center justify-between group relative">
            {onCheck && (
                <div className="absolute left-2 top-2 md:static md:mr-4">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onCheck && onCheck(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                </div>
            )}

            <div className="flex-1 ml-6 md:ml-0 cursor-pointer" onClick={() => onSelect(lead)}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1 rounded">
                        #{lead.id.substring(0, 8)}
                    </span>
                    <PriorityBadge priority={lead.priority} />
                    <span className="text-xs text-gray-400">• {timeAgo}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${lead.status === 'novo' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'qualificado' ? 'bg-purple-100 text-purple-700' :
                            lead.status === 'convertido' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-600'
                        }`}>
                        {lead.status}
                    </span>
                </div>

                <h3 className="font-bold text-gray-900 text-sm md:text-base flex items-center gap-2">
                    {lead.name}
                    {isConverted && <span className="text-green-500 text-xs bg-green-50 px-1 rounded border border-green-100">Cliente</span>}
                </h3>

                {lead.service_interest && (
                    <div className="flex items-center mt-1 text-sm text-gray-700">
                        <span className="mr-1">🎯</span> {lead.service_interest}
                    </div>
                )}
                {lead.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
                        "{lead.description}"
                    </p>
                )}
            </div>

            <div className="mt-3 md:mt-0 md:ml-4 flex flex-wrap gap-2">
                {safePhone && (
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 text-xs font-semibold transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        WhatsApp
                    </a>
                )}

                <button
                    className="inline-flex items-center justify-center px-3 py-2 border border-indigo-200 text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 text-xs font-semibold transition-colors"
                    onClick={handleCreateQuote}
                >
                    Proposta
                </button>

                {!isConverted && (
                    <button
                        className="inline-flex items-center justify-center px-3 py-2 border border-green-200 text-green-700 bg-green-50 rounded-md hover:bg-green-100 text-xs font-semibold transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            // Navigate to client creation with lead data or open modal
                            // navigate('/clients/new', { state: { lead } }) 
                            // OR assuming there's a modal or similar. If no route, maybe do nothing or console log for now.
                            // Assuming /clients/new exists or similar logic. Let's try navigating to clients page with state to open modal?
                            // Actually Clients page has a "New Client" button usually.
                            // Let's assume we can navigate.
                            console.log('Convert to client', lead)
                        }}
                    >
                        Virar Cliente
                    </button>
                )}

                <button
                    className="inline-flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-xs font-semibold transition-colors shadow-sm"
                    onClick={handleCreateOrder}
                >
                    Criar OS
                </button>
            </div>
        </div>
    )
}
