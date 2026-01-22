import React, { useState, useEffect } from 'react'
import { X, MapPin, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react'
import { useLeadCapture, LeadFormData } from '../hooks/useLeadCapture'

interface LeadFormModalProps {
    isOpen: boolean
    onClose: () => void
}

const SERVICES = [
    { id: 'portao', label: 'Portão Automático', icon: '🚪' },
    { id: 'manutencao', label: 'Manutenção Predial', icon: '🔧' },
    { id: 'seguranca', label: 'Câmeras / Segurança', icon: '📷' },
    { id: 'antena', label: 'Antena Coletiva', icon: '📡' },
    { id: 'interfonia', label: 'Interfonia / PABX', icon: '📞' },
    { id: 'preventiva', label: 'Manutenção Preventiva', icon: '📋' },
    { id: 'outro', label: 'Outro', icon: '➕' }
]

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose }) => {
    const { loading, error: submitError, success, protocol, fetchAddressByCEP, submitLead } = useLeadCapture()
    const [step, setStep] = useState(1)
    const [addressLoading, setAddressLoading] = useState(false)

    const [formData, setFormData] = useState<LeadFormData>({
        name: '',
        whatsapp: '',
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        uf: '',
        number: '',
        complement: '',
        isEmergency: false,
        services: [],
        otherServiceDescription: ''
    })

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep(1)
        }
    }, [isOpen])

    // Geolocation effect
    useEffect(() => {
        if (isOpen && step === 1 && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }))
            }, (err) => {
                console.log('Geolocation denied or failed', err)
            })
        }
    }, [isOpen, step])

    const handleCEPBlur = async () => {
        if (formData.cep.length >= 8) {
            setAddressLoading(true)
            const address = await fetchAddressByCEP(formData.cep)
            setAddressLoading(false)
            if (address) {
                setFormData(prev => ({
                    ...prev,
                    street: address.street,
                    neighborhood: address.neighborhood,
                    city: address.city,
                    uf: address.uf
                }))
            }
        }
    }

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.name.length < 3) return alert('Nome deve ter pelo menos 3 caracteres')
        if (formData.whatsapp.length < 10) return alert('WhatsApp inválido')
        setStep(2)
    }

    const toggleService = (id: string) => {
        setFormData(prev => {
            const exists = prev.services.includes(id)
            if (exists) {
                return { ...prev, services: prev.services.filter(s => s !== id) }
            } else {
                return { ...prev, services: [...prev.services, id] }
            }
        })
    }

    const handleFinalSubmit = () => {
        if (formData.services.length === 0) return alert('Selecione pelo menos um serviço')
        submitLead(formData)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#1e293b] text-white p-4 px-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Solicitar Atendimento</h2>
                        <p className="text-xs text-gray-400">Resposta em até 30 minutos</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {success ? (
                        <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Solicitação Enviada!</h3>
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl w-full">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Seu Protocolo</p>
                                <p className="text-xl font-black text-primary font-mono">{protocol}</p>
                            </div>
                            <p className="text-gray-600 font-medium">
                                Obrigado, <span className="text-[#1e293b] font-bold">{formData.name.split(' ')[0]}</span>.
                                Recebemos seu pedido e um de nossos especialistas entrará em contato pelo seu <span className="text-emerald-600 font-bold italic">WhatsApp</span> em instantes.
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full bg-[#1e293b] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg mt-4"
                            >
                                Entendi, obrigado!
                            </button>
                        </div>
                    ) : step === 1 ? (
                        <form id="step1-form" onSubmit={handleNextStep} className="space-y-4">
                            {/* Emergency Checkbox */}
                            <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-3">
                                <div className="mt-0.5">
                                    <input
                                        type="checkbox"
                                        id="emergency"
                                        checked={formData.isEmergency}
                                        onChange={e => setFormData({ ...formData, isEmergency: e.target.checked })}
                                        className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                    />
                                </div>
                                <label htmlFor="emergency" className="text-sm cursor-pointer select-none">
                                    <span className="font-bold text-red-700 block">É uma emergência?</span>
                                    <span className="text-red-600/80 text-xs">Marque se portão travado, risco à segurança ou falta de energia crítica.</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        minLength={3}
                                        placeholder="Seu nome"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="(XX) 9 XXXX-XXXX"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition"
                                        value={formData.whatsapp}
                                        onChange={e => {
                                            let v = e.target.value.replace(/\D/g, '')
                                            if (v.length > 11) v = v.slice(0, 11)
                                            setFormData({ ...formData, whatsapp: v })
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                        <input
                                            type="text"
                                            placeholder="00000-000"
                                            maxLength={9}
                                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition ${addressLoading ? 'bg-gray-50' : ''}`}
                                            value={formData.cep}
                                            onChange={e => setFormData({ ...formData, cep: e.target.value })}
                                            onBlur={handleCEPBlur}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade - UF</label>
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                            value={formData.city ? `${formData.city} - ${formData.uf}` : ''}
                                        />
                                    </div>
                                </div>

                                {formData.street && (
                                    <div className="animate-fade-in space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rua / Logradouro</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                                                value={formData.street}
                                                readOnly
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                                                    value={formData.neighborhood}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition"
                                                    value={formData.number}
                                                    onChange={e => setFormData({ ...formData, number: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-lg font-semibold text-gray-800">Selecione o(s) serviço(s):</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {SERVICES.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={`
                                flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center h-24
                                ${formData.services.includes(service.id)
                                                ? 'border-[#F97316] bg-orange-50 text-[#F97316] shadow-md transform scale-[1.02]'
                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}
                            `}
                                    >
                                        <span className="text-2xl mb-1">{service.icon}</span>
                                        <span className="text-xs font-bold leading-tight">{service.label}</span>
                                    </button>
                                ))}
                            </div>

                            {formData.services.includes('outro') && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descreva o serviço:</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                                        rows={2}
                                        value={formData.otherServiceDescription}
                                        onChange={e => setFormData({ ...formData, otherServiceDescription: e.target.value })}
                                    />
                                </div>
                            )}

                            {submitError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    {submitError}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                {!success && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between shrink-0">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-2 text-gray-600 font-medium hover:text-[#1e293b] flex items-center"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                            </button>
                        )}

                        <div className="ml-auto w-full sm:w-auto">
                            {step === 1 ? (
                                <button
                                    onClick={handleNextStep}
                                    className="w-full sm:w-auto bg-[#1e293b] hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center"
                                >
                                    Continuar <ArrowRight className="ml-2 w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinalSubmit}
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-[#F97316] hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>Processando...</>
                                    ) : (
                                        <>Solicitar Agora <CheckCircle className="ml-2 w-4 h-4" /></>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LeadFormModal
