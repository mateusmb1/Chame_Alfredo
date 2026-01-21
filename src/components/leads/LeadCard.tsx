
import React from 'react'
import { Lead } from '../../hooks/useLeadsList'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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

const ServiceIcon = ({ service }: { service: string }) => {
    // Simple mapping or generic icon
    return <span className="text-xl mr-2">🔧</span>
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onSelect, checked, onCheck }) => {
    const timeAgo = formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })

    // Format phone for WhatsApp
    const safePhone = lead.client?.phone?.replace(/\D/g, '') || ''
    const waLink = `https://wa.me/55${safePhone}`

    return (
        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 mb-3 flex flex-col md:flex-row items-start md:items-center justify-between group relative">
            {/* Selection Checkbox (Absolute or Flex) */}
            {onCheck && (
                <div className="absolute left-2 top-2 md:static md:mr-4">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onCheck(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                </div>
            )}

            <div className="flex-1 ml-6 md:ml-0 cursor-pointer" onClick={() => onSelect(lead)}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1 rounded">#{lead.protocol}</span>
                    <PriorityBadge priority={lead.priority} />
                    <span className="text-xs text-gray-400">• {timeAgo}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-sm md:text-base">
                    {lead.client?.name || 'Cliente Desconhecido'}
                </h3>
                <p className="text-sm text-gray-600 flex items-center">
                    <span className="mr-1">📍</span>
                    {lead.client?.city} - {lead.client?.neighborhood || lead.client?.address}
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded w-fit">
                    <ServiceIcon service={lead.service_type} />
                    {lead.service_type}
                </div>
            </div>

            <div className="mt-3 md:mt-0 md:ml-4 flex gap-2">
                <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none inline-flex items-center justify-center px-3 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 text-sm transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="mr-1">💬</span> WhatsApp
                </a>
                <button
                    className="flex-1 md:flex-none inline-flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm transition-colors shadow-sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        // Logic to create OS would go here or open modal pre-filled
                        onSelect(lead)
                    }}
                >
                    Criar OS
                </button>
            </div>
        </div>
    )
}
