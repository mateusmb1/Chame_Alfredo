import { useState } from 'react'
import { supabase } from '../src/lib/supabase'
import { useNavigate } from 'react-router-dom'

export type LeadPriority = 'urgente' | 'alta' | 'media' | 'baixa'
export type ServiceType = 'Manutenção Predial' | 'Portão Automático' | 'Câmeras / Segurança' | 'Antena Coletiva' | 'Interfonia / PABX' | 'Manutenção Preventiva' | 'Outros Serviços'

export interface LeadFormData {
    name: string
    whatsapp: string
    cep: string
    street: string
    neighborhood: string
    city: string
    uf: string
    number: string
    complement: string
    isEmergency: boolean
    latitude?: number
    longitude?: number
    services: string[] // IDs or keys of selected services
    otherServiceDescription?: string
}

export const useLeadCapture = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // ViaCEP lookup
    const fetchAddressByCEP = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '')
        if (cleanCep.length !== 8) return null

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            const data = await response.json()
            if (data.erro) {
                throw new Error('CEP não encontrado')
            }
            return {
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                uf: data.uf
            }
        } catch (err) {
            console.error(err)
            return null
        }
    }

    // Generate Protocol: YYYY-MMDD-XXXXX
    const generateProtocol = () => {
        const now = new Date()
        const yyyy = now.getFullYear()
        const mm = String(now.getMonth() + 1).padStart(2, '0')
        const dd = String(now.getDate()).padStart(2, '0')
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
        return `${yyyy}-${mm}${dd}-${random}`
    }

    // Determine Priority based on services and emergency flag
    const determinePriority = (formData: LeadFormData): LeadPriority => {
        if (formData.isEmergency) return 'urgente'

        // Check specific services if not manually urgent
        if (formData.services.includes('portao')) return 'urgente' // Portão is often urgent
        if (formData.services.includes('seguranca')) return 'alta'
        if (formData.services.includes('manutencao')) return 'media'

        return 'media' // Default
    }

    const submitLead = async (formData: LeadFormData) => {
        setLoading(true)
        setError(null)

        try {
            const cleanPhone = formData.whatsapp.replace(/\D/g, '')
            let clientId: string

            // 1. Check or Create Client
            const { data: existingClients } = await supabase
                .from('clients')
                .select('*')
                .eq('phone', cleanPhone)
                .limit(1)

            if (existingClients && existingClients.length > 0) {
                clientId = existingClients[0].id
                // Optional: Update client address if missing or changed? skipping for speed, keeping existing data safer
            } else {
                const { data: newClient, error: createError } = await supabase
                    .from('clients')
                    .insert([{
                        name: formData.name,
                        phone: cleanPhone,
                        type: 'pf',
                        status: 'active',
                        address: `${formData.street}, ${formData.number}`,
                        city: formData.city,
                        cep: formData.cep,
                        latitude: formData.latitude,
                        longitude: formData.longitude,
                        username: cleanPhone, // Fallback
                        password: '123' // Temp password logic from existing code
                    }])
                    .select()
                    .single()

                if (createError) throw createError
                clientId = newClient.id
            }

            // 2. Create Order
            const protocol = generateProtocol()
            const priority = determinePriority(formData)

            // Construct description from services
            const serviceNames = formData.services.join(', ')
            const description = `Solicitação via Landing Page. Serviços: ${serviceNames}. ${formData.otherServiceDescription ? `Obs: ${formData.otherServiceDescription}` : ''} ${formData.isEmergency ? '[EMERGÊNCIA]' : ''}`

            const { error: orderError } = await supabase
                .from('orders')
                .insert([{
                    client_id: clientId,
                    service_type: formData.services.length > 0 ? formData.services[0].toLowerCase() : 'outros', // Ensure matching enum or string. Landing.tsx had mapped values. I'll rely on string for now.
                    description: description,
                    status: 'nova',
                    priority: priority,
                    origin: 'landing_form',
                    protocol: protocol
                }])

            if (orderError) throw orderError

            // 3. Redirect to Confirmation
            navigate('/lead-confirmation', {
                state: {
                    protocol,
                    name: formData.name,
                    services: serviceNames,
                    priority: priority === 'urgente' ? 'URGENTE' : 'Normal',
                    whatsapp: cleanPhone,
                    neighborhood: formData.neighborhood,
                    city: formData.city
                }
            })

        } catch (err: any) {
            console.error('Error submitting lead:', err)
            setError(err.message || 'Erro ao processar solicitação')
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        fetchAddressByCEP,
        submitLead
    }
}
