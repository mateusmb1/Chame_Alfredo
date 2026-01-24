
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Lead {
    id: string
    name: string
    phone?: string
    email?: string
    origin: 'whatsapp' | 'landing_page' | 'manual' | 'referral' | string
    status: 'novo' | 'qualificado' | 'perdido' | 'convertido'
    priority: 'urgente' | 'alta' | 'media' | 'baixa'
    description?: string
    service_interest?: string
    expected_value?: number
    client_id?: string
    created_at: string
    updated_at: string
}

export type LeadFiltersState = {
    status?: string
    priority?: string
    origin?: string
    service_type?: string // maps to service_interest
    dateRange?: '24h' | '7d' | '30d'
    search?: string
}

const ITEMS_PER_PAGE = 10

export const useLeadsList = () => {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<LeadFiltersState>({})
    const [page, setPage] = useState(0)
    const [total, setTotal] = useState(0)

    const fetchLeads = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('leads')
            .select('*', { count: 'exact' })

        if (filters.status) query = query.eq('status', filters.status)
        if (filters.priority) query = query.eq('priority', filters.priority)
        if (filters.origin) query = query.eq('origin', filters.origin)
        if (filters.service_type) query = query.ilike('service_interest', `%${filters.service_type}%`)
        if (filters.search) query = query.ilike('name', `%${filters.search}%`) // Basic search by name

        if (filters.dateRange) {
            const now = new Date()
            let past = new Date()
            if (filters.dateRange === '24h') past.setHours(now.getHours() - 24)
            if (filters.dateRange === '7d') past.setDate(now.getDate() - 7)
            if (filters.dateRange === '30d') past.setDate(now.getDate() - 30)
            query = query.gte('created_at', past.toISOString())
        }

        // Sorting: created_at desc (newest first)
        query = query
            .order('created_at', { ascending: false })
            .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching leads:', error)
        } else {
             // Map DB response to Lead interface if needed, but names match mostly.
            setLeads(data as Lead[])
            setTotal(count || 0)
        }
        setLoading(false)
    }, [filters, page])

    useEffect(() => {
        fetchLeads()

        const channel = supabase
            .channel('public:leads')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
                fetchLeads()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchLeads])

    return {
        leads,
        loading,
        filters,
        setFilters,
        page,
        setPage,
        total,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        fetchLeads
    }
}
