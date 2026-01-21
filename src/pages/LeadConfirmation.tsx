import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MessageCircle, CheckCircle2, ArrowLeft, ShieldCheck, Clock } from 'lucide-react'

const LeadConfirmation: React.FC = () => {
    const { state } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!state) {
            navigate('/')
        }
    }, [state, navigate])

    if (!state) return null

    const { protocol, name, services, priority, whatsapp, neighborhood, city } = state

    // Construct WhatsApp Message
    const whatsappMessage =
        `Olá! Sou *${name}*, de *${neighborhood || 'Recife'} - ${city || 'PE'}*.\n\n` +
        `Protocolo: *${protocol}*\n` +
        `Solicito: *${services}*\n` +
        `Urgência: *${priority === 'URGENTE' || priority === 'urgente' ? 'SIM 🚨' : 'Não'}*`

    const whatsappUrl = `https://wa.me/5581988417003?text=${encodeURIComponent(whatsappMessage)}`

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header Success */}
                <div className="bg-green-500 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/50">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-black mb-2">Solicitação Recebida!</h1>
                        <p className="text-green-100 font-medium text-lg">Alfredo já está analisando seu pedido.</p>
                    </div>
                </div>

                <div className="p-8">
                    {/* Protocol Box */}
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-6 text-center">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Seu Protocolo</p>
                        <div className="text-3xl font-mono font-bold text-[#1e293b] tracking-wider select-all">{protocol}</div>
                    </div>

                    {/* Steps Info */}
                    <div className="space-y-6 mb-8">
                        <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mr-4">
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Tempo de Resposta</h3>
                                <p className="text-sm text-gray-600">Nossa equipe retornará o contato em até 30 minutos via WhatsApp.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 mr-4">
                                <ShieldCheck className="w-5 h-5 text-[#F97316]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Prioridade Definida</h3>
                                <p className="text-sm text-gray-600">Sua solicitação foi classificada como <span className="font-bold uppercase text-[#F97316]">{priority}</span> e já está na fila de atendimento.</p>
                            </div>
                        </div>
                    </div>

                    {/* Main CTA */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full bg-[#25D366] hover:bg-[#128c7e] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center mb-4"
                    >
                        <MessageCircle className="w-6 h-6 mr-2" />
                        Abrir Chat com Alfredo
                    </a>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center justify-center py-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para o Início
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeadConfirmation
