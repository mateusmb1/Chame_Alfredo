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
            // 1. Get or Create Client using secure RPC
            const { data: clientId, error: clientError } = await supabase
                .rpc('get_or_create_client_v1', {
                    p_name: formData.name,
                    p_phone: cleanPhone,
                    p_type: 'pf',
                    p_status: 'active'
                })

            if (clientError) {
                console.error('RPC Client Error:', clientError)
                throw new Error('Não foi possível identificar seu cadastro. Por favor, fale conosco pelo WhatsApp.')
            }

            // 2. Create Order
            if (!clientId) throw new Error('Não foi possível identificar seu cadastro (ID ausente).')

            const protocol = generateProtocol()
            const priority = determinePriority(formData)
            const finalClientName = formData.name?.trim() || 'Cliente Site'

            // Construct description from services
            const serviceNames = formData.services.length > 0 ? formData.services.join(', ') : 'Serviços não especificados'
            const description = `Solicitação via Landing Page. Serviços: ${serviceNames}. ${formData.otherServiceDescription ? `Obs: ${formData.otherServiceDescription}` : ''} ${formData.isEmergency ? '[EMERGÊNCIA]' : ''}`

            const { error: orderError } = await supabase
                .from('orders')
                .insert([{
                    client_id: clientId,
                    client_name: finalClientName,
                    service_type: formData.services.length > 0 ? formData.services[0] : 'outros',
                    description: description,
                    status: 'nova',
                    priority: priority,
                    origin: 'landing_form'
                    // protocol: removed - generated via DB trigger
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
