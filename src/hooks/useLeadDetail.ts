
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Lead } from './useLeadsList'

export const useLeadDetail = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateLead = async (leadId: string, updates: Partial<Lead> | { assigned_team_id?: string; scheduled_for?: string }) => {
        setLoading(true)
        setError(null)
        try {
            const { error: updateError } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', leadId)

            if (updateError) throw updateError
            return true
        } catch (err: any) {
            console.error('Error updating lead:', err)
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        updateLead,
        loading,
        error
    }
}
