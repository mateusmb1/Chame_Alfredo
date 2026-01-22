import React, { useState } from 'react'
import {
  MapPin,
  Clock,
  Instagram,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  Wrench,
  Camera,
  DoorOpen,
  Tv,
  Phone,
  Mail,
  ShieldCheck,
  Video,
  Zap,
  Lock,
  LifeBuoy,
  Settings,
  CheckCircle2,
  User,
  Star,
  Quote,
  Users,
  Check,
  AlertTriangle
} from 'lucide-react'
import { supabase } from '../src/lib/supabase'
import LeadFormModal from '../components/LeadFormModal'
import ServiceCard from '../components/ServiceCard'
import MetricCard from '../components/MetricCard'
import BrandLogo from '../components/BrandLogo'
import Mascot from '../components/Mascot'



const Landing: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [leadModalOpen, setLeadModalOpen] = useState(false)


  // Form state
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    service: '' // Will be populated after initial submit
  })

  // New state for 2-step process
  const [step, setStep] = useState<'initial' | 'service_selection'>('initial')
  const [clientData, setClientData] = useState<any>(null) // Store client data after step 1
  const [tempOrderId, setTempOrderId] = useState<string | null>(null) // To update the order later if needed, or create fresh

  const trackWhatsAppClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_whatsapp_cta', {
        'event_category': 'engagement',
        'event_label': 'whatsapp_button'
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle service selection click
  const handleServiceSelect = async (selectedService: string) => {
    if (!clientData) return

    setIsSubmitting(true)
    try {
      // Map service to priority and description
      const servicePriorityMap: Record<string, { priority: string; serviceType: string }> = {
        'manutencao': { priority: 'media', serviceType: 'Manutenção Geral' },
        'portao': { priority: 'alta', serviceType: 'Portão Automático' },
        'seguranca': { priority: 'alta', serviceType: 'Câmeras / Segurança' },
        'preventiva': { priority: 'baixa', serviceType: 'Manutenção Preventiva' },
        'outro': { priority: 'media', serviceType: 'Outros Serviços' }
      }

      // 1. Get or Create Client using secure RPC (bypasses RLS lookup restrictions)
      const cleanPhone = formData.whatsapp.replace(/\D/g, '')
      const { data: clientId, error: clientError } = await supabase
        .rpc('get_or_create_client_v1', {
          p_name: formData.name,
          p_phone: formData.whatsapp,
          p_type: 'pf',
          p_status: 'active'
        })

      if (clientError) {
        console.error('Erro ao identificar/criar cliente (RPC):', clientError)
        throw new Error('Não foi possível processar seu cadastro. Por favor, tente pelo WhatsApp.')
      }

      const serviceInfo = servicePriorityMap[selectedService] || { priority: 'media', serviceType: 'Outros' }

      if (!clientId) {
        throw new Error('Identificação do cliente falhou. Por favor, tente novamente.')
      }

      const finalClientName = formData.name?.trim() || 'Cliente Site'

      // 2. Create Order
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          client_id: clientId,
          client_name: finalClientName,
          service_type: serviceInfo.serviceType,
          description: `Solicitação via site - ${serviceInfo.serviceType}`,
          status: 'nova',
          priority: serviceInfo.priority,
          value: 0,
          origin: 'landing_hero'
          // protocol: handled by DB trigger
        }])

      if (orderError) {
        console.error('Erro detalhado ao criar ordem:', orderError)
        throw orderError
      }

      // Show final success
      setShowSuccessMessage(true)
      setStep('initial') // Reset to initial for next user or same user
      setFormData({ name: '', whatsapp: '', service: '' })
      setTimeout(() => setShowSuccessMessage(false), 5000)

    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      alert('Ocorreu um erro ao salvar sua opção.')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Check if client exists by phone
      const cleanPhone = formData.whatsapp.replace(/\D/g, '')
      let client = null

      // Use a more careful selection to handle potential RLS issues
      const { data: existingClients, error: searchError } = await supabase
        .from('clients')
        .select('id, name, phone')
        .eq('phone', cleanPhone)
        .limit(1)

      if (existingClients && existingClients.length > 0) {
        client = existingClients[0]
      } else {
        // 2. Create new client
        // We use a try-catch for the insert specifically to handle "already exists" errors 
        // that might happen if the SELECT above failed to find the client (e.g. due to RLS)
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert([{
            name: formData.name,
            phone: cleanPhone,
            type: 'pf',
            status: 'active'
          }])
          .select()
          .single()

        if (clientError) {
          // If it fails because of duplicate phone, try to get the existing client one more time
          if (clientError.code === '23505') {
            const { data: retryClient } = await supabase
              .from('clients')
              .select('id, name, phone')
              .eq('phone', cleanPhone)
              .single()
            if (retryClient) {
              client = retryClient
            } else {
              throw new Error('Este telefone já está cadastrado, mas não conseguimos recuperar seus dados. Por favor, fale conosco pelo WhatsApp.')
            }
          } else {
            throw clientError
          }
        } else {
          client = newClient
        }
      }

      if (!client) throw new Error('Não foi possível identificar ou criar seu cadastro.')

      setClientData(client)

      // Move to step 2: Service Selection
      setStep('service_selection')

    } catch (error: any) {
      console.error('Erro detalhado ao enviar solicitação:', error)
      const msg = error.message || error.details || 'Erro desconhecido'
      alert(`Erro ao processar sua solicitação: ${msg}. Por favor, tente novamente ou use o WhatsApp.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-gray-700 bg-gray-50">
      <div className="bg-[#1e293b] text-white py-2 text-sm hidden md:block border-b border-gray-700">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-[#F97316]" /> Atendendo Recife e Região</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-[#F97316]" /> Suporte 24 Horas</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="mailto:Chamealfredo@gmail.com" className="hover:text-[#F97316] transition">Chamealfredo@gmail.com</a>
            <a href="https://instagram.com/chamealfredo" target="_blank" className="hover:text-[#F97316] transition"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
              <Mascot className="w-[4.5rem] h-[4.5rem]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#F97316] leading-none tracking-tight">Chame <span className="text-[#1e293b]">ALFREDO!</span></h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.05em] uppercase mt-0.5">Soluções para Corporativa, Administradoras e Condomínio</p>
            </div>
          </a>
          <nav className="hidden md:flex space-x-8 font-medium text-[#1e293b]">
            <a href="#home" className="hover:text-[#F97316] transition">Início</a>
            <a href="#servicos" className="hover:text-[#F97316] transition">Serviços</a>
            <a href="#sobre" className="hover:text-[#F97316] transition">Sobre Nós</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="flex items-center text-[#1e293b] hover:text-[#F97316] font-bold transition text-sm px-4">
              <User className="w-4 h-4 mr-2" /> Entrar
            </a>
            <a href="https://wa.me/5581988417003" onClick={trackWhatsAppClick} className="flex items-center bg-[#84cc16] hover:bg-green-600 text-white px-5 py-2 rounded-full font-bold transition shadow-lg">
              <PhoneCall className="w-4 h-4 mr-2" /> (81) 9 8841-7003
            </a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#1e293b] focus:outline-none">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-3 shadow-lg">
            <a href="#home" className="block text-[#1e293b] font-medium">Início</a>
            <a href="#servicos" className="block text-[#1e293b] font-medium">Serviços</a>
            <a href="#sobre" className="block text-[#1e293b] font-medium">Sobre Nós</a>
            <a href="/login" className="block border border-gray-200 text-center py-2 rounded font-bold flex items-center justify-center gap-2 text-gray-700"><User className="w-4 h-4" /> Entrar</a>
            <a href="https://wa.me/5581988417003" onClick={trackWhatsAppClick} className="block bg-[#84cc16] text-white text-center py-2 rounded font-bold">Ligar Agora</a>
          </div>
        )}
      </header>

      <section id="home" className="relative overflow-hidden text-white py-20 md:py-32" style={{ backgroundImage: 'linear-gradient(rgba(30,41,59,0.85), rgba(30,41,59,0.8)), url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1950&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b]/90 to-transparent"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <div className="inline-flex items-center bg-[#F97316]/20 border border-[#F97316]/50 rounded-full px-4 py-1 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#F97316] rounded-full mr-2 animate-pulse"></span>
              <span className="text-[#F97316] text-xs font-bold uppercase tracking-wide">Atendimento em Recife e Região</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Portão travado? Chame o Alfredo em <span className="text-[#F97316]">30 MIN</span></h2>
            <p className="text-lg text-gray-200 mb-8 max-w-lg mx-auto md:mx-0 font-light">Técnico especializado em automação desde 2015. 24 horas de atendimento. Garantia 6 meses em todos os serviços.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => setLeadModalOpen(true)} className="bg-[#84cc16] hover:bg-green-600 text-white text-lg font-bold px-8 py-3 rounded-lg shadow-xl flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                <MessageCircle className="mr-2" /> Abrir Chamado Rápido
              </button>
              <a href="#servicos" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-3 rounded-lg text-center flex items-center justify-center hover:bg-white/30 transition-all">
                Ver Nossos Serviços
              </a>
            </div>


          </div>
          <div className="md:w-1/2 md:pl-12 w-full">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-md mx-auto border-t-8 border-[#F97316]">
              <div className="flex items-center mb-6">
                <div
                  className="w-16 h-16 rounded-full mr-4 overflow-hidden bg-transparent flex items-center justify-center"
                >
                  <Mascot className="w-14 h-14" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Orçamento Rápido</h3>
                  <p className="text-xs text-gray-500">Responder em até 30 minutos</p>
                </div>
              </div>

              {showSuccessMessage && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-500 w-5 h-5 mr-2" />
                    <p className="text-green-800 font-semibold text-sm">
                      Solicitação enviada com sucesso! Alfredo entrará em contato em breve.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                {step === 'initial' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-xs font-bold mb-1 uppercase">Seu Nome</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400 disabled:opacity-50"
                        placeholder="Ex: João Silva"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-xs font-bold mb-1 uppercase">WhatsApp</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400 disabled:opacity-50"
                        placeholder="(81) 9 8841-7003"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1e293b] hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Continuar <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-[#1e293b] font-bold text-center mb-2">Qual serviço você precisa?</p>
                    <button
                      type="button"
                      onClick={() => handleServiceSelect('portao')}
                      className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#F97316] hover:bg-orange-50 transition flex items-center"
                    >
                      <div className="w-4 h-4 border-2 border-gray-400 rounded mr-3 flex items-center justify-center"></div>
                      <span className="font-medium text-gray-700">Portão Automático</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleServiceSelect('seguranca')}
                      className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#F97316] hover:bg-orange-50 transition flex items-center"
                    >
                      <div className="w-4 h-4 border-2 border-gray-400 rounded mr-3 flex items-center justify-center"></div>
                      <span className="font-medium text-gray-700">Câmeras / Segurança</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleServiceSelect('preventiva')}
                      className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#F97316] hover:bg-orange-50 transition flex items-center"
                    >
                      <div className="w-4 h-4 border-2 border-gray-400 rounded mr-3 flex items-center justify-center"></div>
                      <span className="font-medium text-gray-700">Manutenção Preventiva</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleServiceSelect('outro')}
                      className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#F97316] hover:bg-orange-50 transition flex items-center"
                    >
                      <div className="w-4 h-4 border-2 border-gray-400 rounded mr-3 flex items-center justify-center"></div>
                      <span className="font-medium text-gray-700">Outro</span>
                    </button>

                    {isSubmitting && (
                      <div className="text-center text-xs text-gray-500 mt-2">Processando...</div>
                    )}
                  </div>
                )}
              </form>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      {['JS', 'MS', 'PC'][i - 1]}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-gray-400 font-medium leading-tight">
                  <span className="text-gray-600 font-bold block">Excelente (4.8/5)</span>
                  2k+ atendimentos em Recife
                </div>
                <div className="ml-auto">
                  <ShieldCheck className="w-8 h-8 text-[#84cc16] opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="bg-white py-8 border-b border-gray-100 relative z-20 -mt-8 mx-4 md:mx-0 rounded-xl md:rounded-none shadow-xl md:shadow-none">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Users}
              number="2000+"
              text="Clientes Atendidos"
              subtext="Condomínios, empresas e pessoas"
              color="text-[#F97316]"
            />
            <MetricCard
              icon={Star}
              number="4.8/5"
              text="Avaliação Google"
              subtext="Baseado em 100+ reviews"
              color="text-yellow-400"
            />
            <MetricCard
              icon={Clock}
              number="30 min"
              text="Tempo de Resposta"
              subtext="SLA garantido em urgências"
              color="text-green-500"
            />
            <MetricCard
              icon={ShieldCheck}
              number="6 meses"
              text="Garantia Total"
              subtext="Peças e mão de obra inclusas"
              color="text-blue-500"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Trabalhamos com as melhores marcas</h3>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">As mesmas marcas confiadas por grandes condomínios. Peças originais e suporte técnico garantido.</p>
          </div>
          <BrandLogo />
        </div>
      </section>

      <section id="servicos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F97316] font-bold text-sm uppercase tracking-wider">O que fazemos</span>
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-[#1e293b] mt-2 mb-4">Soluções para Corporativa, Administradoras e Condomínio</h2>
            <div className="w-20 h-1.5 bg-[#F97316] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={DoorOpen}
              title="Portão Travado? Consertamos em 1-2 Horas"
              description="Seu portão parou de abrir, trava na metade ou faz barulho estranho? Alfredo diagnostica e corrige o problema. Se for motor, trilho, roldana, mola, cabo, sensor ou fotocélula - Alfredo resolve."
              benefits={["Diagnóstico grátis por telefone", "Peças originais Garen + garantia 6 meses", "Atendimento em até 30 minutos"]}
              ctaText="Chamar para Emergência"
              onCtaClick={() => setLeadModalOpen(true)}
              isEmergency={false} // User requested this as standard card 1, but with urgent title. Kept standard style to match layout request (6 cards + 1 cta).
            />
            <ServiceCard
              icon={Settings}
              title="Manutenção Preventiva: Evite Surpresas"
              description="Portão novo quebra em 3 meses? Sensor falha toda semana? Seu condomínio paga mais caro com quebras emergenciais. Visitas periódicas de Alfredo = lubrificação, ajustes, testes de segurança."
              benefits={["Visitas mensais/trimestrais flexíveis", "Previne acidentes e paradas", "Economiza até 40% em gastos"]}
              ctaText="Agendar Visita"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={Camera}
              title="Monitoramento em Tempo Real 24h"
              description="Garagens desprotegidas sofrem roubos. Alfredo instala câmeras Hikvision (HD/IP) e gravadores Intelbras. Monitore de qualquer lugar (celular ou computador) com segurança."
              benefits={["Câmeras Hikvision Full HD", "Acesso remoto 24/7 + nuvem", "Instalação profissional inclusa"]}
              ctaText="Solicitar Orçamento"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={ShieldCheck}
              title="Acesso Inteligente: Cartão, Biometria"
              description="Sem chaves, sem senhas escritas na parede. Sistema Intelbras de controle de acesso integrado ao portão automático: cartão, biometria (digital), teclado numérico. Zero acessos não autorizados."
              benefits={["Acesso por tag, biometria ou senha", "Histórico de quem entrou/saiu", "Sem chaves perdidas"]}
              ctaText="Conhecer Sistema"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={AlertTriangle}
              title="Zero Acidentes: Barreiras Ativas"
              description="Criança esmagada por portão? Nunca mais. Alfredo instala fotocélulas PPA e barreiras infravermelhas que PARAM o portão se detectarem obstáculo. Segurança que previne acidentes."
              benefits={["Fotocélulas anti-esmagamento (ABNT)", "Sensor de sobrecarga automático", "Testes mensais de segurança"]}
              ctaText="Avaliar Meu Portão"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={Tv}
              title="Sinal Digital Limpo no Prédio Todo"
              description="Apartamentos com TV travando? Alfredo instala antena coletiva digital com cabeamento estruturado. Sinal HD limpo em todas as unidades. Sem interferência, sem antenas na fachada."
              benefits={["Sinal digital HD em todos aptos", "Cabeamento estruturado", "Manutenção e limpeza de contatos"]}
              ctaText="Melhorar Sinal"
              onCtaClick={() => setLeadModalOpen(true)}
            />

            {/* Emergency Card Spanning Full Width or prominent position */}
            <div className="md:col-span-2 lg:col-span-3 mt-4">
              <ServiceCard
                icon={LifeBuoy}
                title="Emergência Agora? Plantão 24h"
                description="Portão travado de madrugada, câmera fora, acesso bloqueado? Alfredo funciona 24 horas todos os dias. Resposta em 30 minutos. Técnico na sua porta em 1-2 horas."
                benefits={[]}
                ctaText="Ligar Agora: (81) 9 8841-7003"
                onCtaClick={() => window.location.href = 'tel:5581988417003'}
                isEmergency={true}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F97316] font-bold text-sm uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-[#1e293b] mt-2 mb-4">O Que Nossos Clientes Dizem</h2>
            <div className="w-20 h-1.5 bg-[#F97316] mx-auto rounded-full"></div>
          </div>

          <div className="flex overflow-x-auto pb-8 gap-6 md:grid md:grid-cols-3 md:overflow-visible snap-x snap-mandatory scrollbar-hide">

            <div className="min-w-[85vw] md:min-w-0 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col snap-center">
              <div className="mb-6 text-[#F97316]">
                <Quote className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-gray-600 mb-6 flex-grow italic">"Portão travado numa segunda-feira. Liguei à noite e Alfredo apareceu terça de manhã. Profissional, rápido, fez bem feito."</p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="flex items-center mt-auto border-t border-gray-100 pt-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold mr-3">JS</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#1e293b] text-sm">João Silva</h4>
                    <span className="flex items-center text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold"><Check className="w-3 h-3 mr-1" /> Verificado</span>
                  </div>
                  <p className="text-xs text-gray-500">Condomínio Ponto Real, Recife</p>
                </div>
              </div>
            </div>


            <div className="min-w-[85vw] md:min-w-0 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col snap-center">
              <div className="mb-6 text-[#F97316]">
                <Quote className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-gray-600 mb-6 flex-grow italic">"Meu sensor de porta quebrava quase todo mês. Alfredo trocou e já fazem 2 anos sem problema. Recomendo!"</p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="flex items-center mt-auto border-t border-gray-100 pt-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold mr-3">MS</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#1e293b] text-sm">Maria Santos</h4>
                    <span className="flex items-center text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold"><Check className="w-3 h-3 mr-1" /> Verificado</span>
                  </div>
                  <p className="text-xs text-gray-500">Loja Meu Sonho, Jaboatão</p>
                </div>
              </div>
            </div>


            <div className="min-w-[85vw] md:min-w-0 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col snap-center">
              <div className="mb-6 text-[#F97316]">
                <Quote className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-gray-600 mb-6 flex-grow italic">"Não cobrou nada a mais. Quando eu perguntei, disse que era dentro da garantia e corrigiu de graça. Ótimo atendimento."</p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="flex items-center mt-auto border-t border-gray-100 pt-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold mr-3">PC</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#1e293b] text-sm">Pedro Costa</h4>
                    <span className="flex items-center text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold"><Check className="w-3 h-3 mr-1" /> Verificado</span>
                  </div>
                  <p className="text-xs text-gray-500">Edifício Paulista, Recife</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setLeadModalOpen(true)}
              className="bg-[#1e293b] text-white font-bold py-4 px-10 rounded-full shadow-xl hover:bg-gray-800 transform hover:scale-105 transition-all text-lg flex items-center mx-auto"
            >
              <Star className="w-5 h-5 text-yellow-500 mr-2 fill-yellow-500" />
              Quero ser o próximo cliente satisfeito
            </button>
            <p className="text-gray-500 text-sm mt-3">Junte-se a mais de 2.000 clientes em Recife</p>
          </div>
        </div>
      </section >

      <section id="sobre" className="py-20 bg-[#fff7ed]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem]">
              <div className="absolute inset-0 rounded-full"></div>
              <div className="w-full h-full rounded-full overflow-hidden bg-transparent flex items-center justify-center">
                <Mascot className="w-[90%] h-[90%]" />
              </div>
              <div className="absolute top-0 right-0 bg-white p-4 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-xl transform translate-x-4 -translate-y-4">
                <p className="text-[#1e293b] font-bold text-sm">Deixa com o Alfredo!</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] mb-6">Alfredo: 10 Anos Consertando <span className="text-[#F97316]">Problemas que Ninguém Consegue</span></h2>
            <p className="text-gray-600 text-lg mb-6">Não é só técnico. É especialista em portões automáticos desde 2015. Começou atendendo emergências à noite e virou referência. Hoje, 2000+ condomínios e empresas em Recife confiam em Alfredo porque ele resolve problema que ninguém consegue - e faz parecer simples.</p>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="text-green-500 w-6 h-6 mr-3" /> 10 anos de experiência em automação predial</li>
              <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="text-green-500 w-6 h-6 mr-3" /> Todas as emergências atendidas no mesmo dia</li>
              <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="text-green-500 w-6 h-6 mr-3" /> Equipamentos premium: Garen, Hikvision, Intelbras, PPA</li>
            </ul>
          </div>
        </div>
      </section>


      <footer className="bg-[#1e293b] text-white pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Mascot className="w-12 h-12" />
              <span className="text-2xl font-bold text-white">Chame Alfredo</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">A solução completa para manutenção do seu patrimônio. Atendimento ágil, preço justo e garantia de serviço.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#F97316] transition"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#F97316]">Contato</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center"><Phone className="w-4 h-4 mr-2 text-[#84cc16]" /> (81) 9 8841-7003</li>
              <li className="flex items-center"><Mail className="w-4 h-4 mr-2 text-[#84cc16]" /> Chamealfredo@gmail.com</li>
              <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-[#84cc16]" /> Recife - PE</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#F97316]">Menu</h4>
            <li><a href="#home" className="hover:text-white transition">Início</a></li>
            <li><a href="#servicos" className="hover:text-white transition">Serviços</a></li>
            <li><a href="#sobre" className="hover:text-white transition">Sobre Nós</a></li>
            <li className="pt-2 border-t border-gray-700 mt-2"></li>
            <li><a href="/dashboard" className="hover:text-white transition text-gray-400 text-xs flex items-center"><User className="w-3 h-3 mr-1" /> Área Admin</a></li>
            <li><a href="/mobile/login" className="hover:text-white transition text-gray-400 text-xs flex items-center"><Wrench className="w-3 h-3 mr-1" /> Sou Técnico</a></li>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">&copy; 2024 Chame Alfredo Soluções. Todos os direitos reservados.</div>
      </footer>

      <LeadFormModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
    </div >
  )
}

export default Landing
