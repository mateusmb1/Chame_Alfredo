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
  AlertTriangle,
  ChevronDown,
  X
} from 'lucide-react'
import { supabase } from '../src/lib/supabase'
import LeadFormModal from '../components/LeadFormModal'
import ServiceCard from '../components/ServiceCard'
import MetricCard from '../components/MetricCard'
import BrandLogo from '../components/BrandLogo'
import Mascot from '../components/Mascot'

interface ProductSubitem {
  title: string;
  image: string;
  description: string;
}

const Landing: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>('produtos')
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  
  // Interactive product browser category state
  const [activeCategory, setActiveCategory] = useState<string>('seguranca')

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setActiveDropdown(menu)
  }

  const handleMouseLeave = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
    }
    const timer = setTimeout(() => {
      setActiveDropdown(null)
    }, 350)
    setDropdownTimeout(timer)
  }

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
  }

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    services: [] as string[],
    description: ''
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

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!clientData) return
    if (formData.services.length === 0) return alert('Por favor, selecione ao menos um serviço.')

    setIsSubmitting(true)
    try {
      const servicePriorityMap: Record<string, { priority: string; serviceType: string }> = {
        'manutencao': { priority: 'media', serviceType: 'Manutenção Geral' },
        'portao': { priority: 'alta', serviceType: 'Portão Automático' },
        'seguranca': { priority: 'alta', serviceType: 'Câmeras / Segurança' },
        'preventiva': { priority: 'baixa', serviceType: 'Manutenção Preventiva' },
        'outro': { priority: 'media', serviceType: 'Outros Serviços' }
      }

      const cleanPhone = formData.whatsapp.replace(/\D/g, '')
      const { data: clientId, error: clientError } = await supabase
        .rpc('get_or_create_client_v1', {
          p_name: formData.name,
          p_phone: cleanPhone,
          p_type: 'pf',
          p_status: 'active'
        })

      if (clientError) throw clientError
      if (!clientId) throw new Error('Falha na identificação do cliente.')

      const serviceNames = formData.services.map(s => servicePriorityMap[s]?.serviceType || s).join(', ')
      const finalDescription = `[QUICK] Serviços: ${serviceNames}. Obs: ${formData.description}`
      const primaryService = formData.services[0]
      const serviceInfo = servicePriorityMap[primaryService] || { priority: 'media', serviceType: 'Serviço Geral' }

      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          client_id: clientId,
          client_name: formData.name,
          service_type: serviceNames.length > 50 ? 'Múltiplos Serviços' : serviceNames,
          description: finalDescription,
          status: 'nova',
          priority: serviceInfo.priority,
          origin: 'landing_quick_quote'
        }])

      if (orderError) throw orderError

      setShowSuccessMessage(true)
      setStep('initial')
      setFormData({ name: '', whatsapp: '', services: [], description: '' })
      setTimeout(() => setShowSuccessMessage(false), 5000)

      // Open WhatsApp automatically on success with a friendly message
      const text = `Olá Alfredo! Sou ${formData.name}. Gostaria de solicitar um orçamento para: ${serviceNames}.`
      window.open(`https://wa.me/5581988417003?text=${encodeURIComponent(text)}`, '_blank')

    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao processar: ' + (error.message || 'Verifique sua conexão.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id]
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Check if client exists by phone
      const cleanPhone = formData.whatsapp.replace(/\D/g, '')
      let client = null

      const { data: existingClients, error: searchError } = await supabase
        .from('clients')
        .select('id, name, phone')
        .eq('phone', cleanPhone)
        .limit(1)

      if (existingClients && existingClients.length > 0) {
        client = existingClients[0]
      } else {
        // 2. Create new client
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
          if (clientError.code === '23505') {
            const { data: retryClient } = await supabase
              .from('clients')
              .select('id, name, phone')
              .eq('phone', cleanPhone)
              .single()
            if (retryClient) {
              client = retryClient
            } else {
              throw new Error('Este telefone já está cadastrado. Por favor, fale conosco pelo WhatsApp.')
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
      setStep('service_selection')

    } catch (error: any) {
      console.error('Erro detalhado ao enviar solicitação:', error)
      const msg = error.message || error.details || 'Erro desconhecido'
      alert(`Erro ao processar sua solicitação: ${msg}. Por favor, tente novamente ou use o WhatsApp.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mega-menu category items helper
  const getSubitemsForCategory = (): ProductSubitem[] => {
    switch (activeCategory) {
      case 'seguranca':
        return [
          { title: 'Câmeras CFTV', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80', description: 'Câmeras analógicas HD, IP e Wi-Fi inteligentes de alta resolução.' },
          { title: 'Gravadores DVR/NVR', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=300&q=80', description: 'DVRs e NVRs inteligentes Multi-HD com detecção facial por IA.' },
          { title: 'Alarmes', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=300&q=80', description: 'Centrais de alarme de intrusão inteligentes com monitoramento por app.' },
          { title: 'Controle de Acesso', image: 'https://images.unsplash.com/photo-1580983218765-f663bec55b0a?auto=format&fit=crop&w=300&q=80', description: 'Leitores, controladoras de portas e catracas de alto fluxo.' },
          { title: 'Fechaduras Digitais', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80', description: 'Fechaduras digitais, eletromagnéticas e solenoides.' },
          { title: 'Interfonia', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80', description: 'Videoporteiros e porteiros eletrônicos residenciais e coletivos.' },
          { title: 'Sensores', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80', description: 'Sensores de presença infravermelhos (IVA, IVP) e barreiras.' },
          { title: 'Detecção de Incêndio', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80', description: 'Sistemas de detecção e alarme de incêndio endereçáveis.' },
          { title: 'Monitoramento Veicular', image: 'https://images.unsplash.com/photo-1611516491426-03025e6043c8?auto=format&fit=crop&w=300&q=80', description: 'Gravadores digitais móveis (MDVR) e câmeras veiculares robustas.' },
          { title: 'Armazenamento', image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=300&q=80', description: 'HDs da linha WD Purple para gravação ininterrupta 24/7.' },
          { title: 'Sinalização Emergência', image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?auto=format&fit=crop&w=300&q=80', description: 'Blocos e luminárias autônomas de LED para saídas de emergência.' },
          { title: 'Softwares e Apps', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80', description: 'Apps integrados para visualização de câmeras em tempo real.' }
        ]
      case 'redes':
        return [
          { title: 'Roteadores Wi-Fi', image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=300&q=80', description: 'Roteadores Wi-Fi 5/6 residenciais e sistemas Mesh velozes.' },
          { title: 'Switches PoE', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80', description: 'Switches gerenciáveis e não-gerenciáveis PoE de alta performance.' },
          { title: 'Access Points', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80', description: 'Access points corporativos, repetidores e adaptadores de sinal.' },
          { title: 'Fibra Óptica GPON', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80', description: 'Equipamentos GPON/EPON de fibra óptica e ONUs de alta velocidade.' },
          { title: 'Injetores PoE', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=300&q=80', description: 'Fontes e injetores PoE para alimentação de câmeras e rádios.' },
          { title: 'Cabos de Rede', image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=300&q=80', description: 'Cabeamento estruturado CAT5e e CAT6 homologado de alta blindagem.' },
          { title: 'Rádios Outdoor', image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=300&q=80', description: 'Rádios de alta potência para enlaces ponto a ponto de longa distância.' }
        ]
      case 'comunicacao':
        return [
          { title: 'Central Telefônica', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=300&q=80', description: 'Centrais PABX analógicas, digitais e IP para integração em escritórios.' },
          { title: 'Telefones', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80', description: 'Aparelhos com fio, sem fio (DECT), telefones IP e headsets.' },
          { title: 'Porteiros Residenciais', image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=300&q=80', description: 'Interfones clássicos e porteiros eletrônicos residenciais duráveis.' },
          { title: 'Radiocomunicação', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80', description: 'Rádios analógicos e digitais de longo alcance para equipes e eventos.' },
          { title: 'Acessórios Telefônicos', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80', description: 'Placas de ramais adicionais, interfaces GSM e protetores de linha.' }
        ]
      case 'acesso':
        return [
          { title: 'Controladores Biométricos', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', description: 'Controladores autônomos por impressão digital, senha e proximidade.' },
          { title: 'Fechaduras Digitais', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80', description: 'Fechaduras de sobrepor e embutir com senha, tag, biometria e app.' },
          { title: 'Leitores Faciais', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80', description: 'Terminais de reconhecimento facial de alta precisão com inteligência artificial.' },
          { title: 'Catracas e Barreiras', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=300&q=80', description: 'Catracas de acesso robustas e cancelas para recepções e garagens.' },
          { title: 'Tags e Cartões', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80', description: 'Chaveiros e cartões de proximidade RFID 125kHz e Mifare 13.56MHz.' },
          { title: 'Fechaduras Eletroímã', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80', description: 'Eletroímãs de alta força (150kg, 300kg, 500kg) e suportes em alumínio.' },
          { title: 'Molas Aéreas', image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=300&q=80', description: 'Molas hidráulicas aéreas de fechamento controlado para portas.' },
          { title: 'Botoeiras e Saídas', image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=300&q=80', description: 'Botões de saída em inox com acionamento mecânico, touch ou sem toque.' }
        ]
      case 'energia':
        return [
          { title: 'Nobreaks UPS', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80', description: 'Fontes ininterruptas de energia para servidores, portões e CFTV.' },
          { title: 'Protetores de Surto', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=300&q=80', description: 'Proteção contra surtos elétricos induzidos por raios e descargas.' },
          { title: 'Fontes de Alimentação', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80', description: 'Fontes colmeia reguladas de 12V e 24V para câmeras e fechaduras.' },
          { title: 'Baterias Estacionárias', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=300&q=80', description: 'Baterias seladas de chumbo-ácido VRLA de alta durabilidade.' },
          { title: 'Carregadores Inteligentes', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80', description: 'Carregadores automáticos de bateria e fontes nobreak inteligentes.' }
        ]
      case 'energia_solar':
        return [
          { title: 'Painéis Solares', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=300&q=80', description: 'Módulos fotovoltaicos monocristalinos de alta eficiência energética.' },
          { title: 'Inversores Off-Grid', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=300&q=80', description: 'Inversores senoidais puros para sistemas isolados de energia solar.' },
          { title: 'Inversores Grid-Tie', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=300&q=80', description: 'Inversores para conexão com a rede elétrica da concessionária.' },
          { title: 'Controladores MPPT', image: 'https://images.unsplash.com/photo-1548613053-220a29df10d1?auto=format&fit=crop&w=300&q=80', description: 'Gerenciadores inteligentes de carga PWM e MPPT para baterias.' },
          { title: 'Bombas Solares', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80', description: 'Bombas d\'água alimentadas diretamente por energia solar fotovoltaica.' },
          { title: 'Estruturas de Fixação', image: 'https://images.unsplash.com/photo-1608526689788-e4a6d9082dbe?auto=format&fit=crop&w=300&q=80', description: 'Suportes em alumínio e fixadores de alta resistência para telhados.' }
        ]
      case 'casa_inteligente':
        return [
          { title: 'Lâmpadas Smart', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', description: 'Lâmpadas LED RGB inteligentes controladas por aplicativo ou voz.' },
          { title: 'Interruptores Smart', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80', description: 'Interruptores touch Wi-Fi para automação flexível de iluminação.' },
          { title: 'Plugues Inteligentes', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=300&q=80', description: 'Plugues de tomada smart para agendamentos e monitoramento de energia.' },
          { title: 'Sensores de Abertura', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80', description: 'Sensores de abertura de portas e janelas sem fio integrados por app.' },
          { title: 'Fechaduras Smart', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80', description: 'Fechaduras digitais Wi-Fi com gerenciamento de acessos remoto.' },
          { title: 'Controles Universais', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=300&q=80', description: 'Centrais de controle infravermelho Wi-Fi para automatizar ar e TV.' }
        ]
      case 'residenciais':
        return [
          { title: 'Videoporteiro Wi-Fi', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80', description: 'Atendimento de chamadas e liberação de portão pelo celular.' },
          { title: 'Porteiro Eletrônico', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80', description: 'Interfones clássicos e robustos para comunicação residencial.' },
          { title: 'Motores para Portão', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80', description: 'Motores rápidos e seguros de marcas como Garen, Rossi e PPA.' },
          { title: 'Câmeras Wi-Fi', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80', description: 'Monitoramento de pets, crianças ou ambientes internos com áudio.' },
          { title: 'Fechaduras de Embutir', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80', description: 'Fechaduras mecânicas de segurança e linguetas reforçadas.' }
        ]
      case 'pme':
        return [
          { title: 'Sistemas de Câmeras', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80', description: 'CFTV completo com alta resolução e acesso remoto para lojas e escritórios.' },
          { title: 'Controle de Ponto', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80', description: 'Terminais de ponto homologados por biometria e tag para funcionários.' },
          { title: 'Centrais PABX', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=300&q=80', description: 'Soluções de telefonia integrada para comunicação fluida entre ramais.' },
          { title: 'Switches Comerciais', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80', description: 'Switches PoE robustos para alimentação estável de telefones IP e CFTV.' },
          { title: 'Alarmes de Intrusão', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?auto=format&fit=crop&w=300&q=80', description: 'Centrais monitoráveis com sirene externa de alto impacto sonoro.' }
        ]
      case 'grandes_empresas':
        return [
          { title: 'Controladoras IP', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', description: 'Sistemas integrados para gerenciar acessos de milhares de usuários em tempo real.' },
          { title: 'Câmeras LPR', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80', description: 'Leitura de placas automática por IA (OCR) para frotas e condomínios.' },
          { title: 'Servidores de Vídeo', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80', description: 'Servidores dedicados e NVRs de grande capacidade para videomonitoramento.' },
          { title: 'Sistemas de Incêndio', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80', description: 'Centrais de incêndio endereçáveis de alta tecnologia para galpões e edifícios.' },
          { title: 'Switches Core L3', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80', description: 'Infraestrutura de rede core de altíssima velocidade e gerência avançada.' }
        ]
      case 'provedores':
        return [
          { title: 'ONUs GPON', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80', description: 'Terminais ópticos Gigabit de cliente final para internet ultra veloz.' },
          { title: 'OLTs Industriais', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80', description: 'Concentradores ópticos para gerência avançada de centenas de portas de fibra.' },
          { title: 'Roteadores Gigabit', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80', description: 'Roteadores corporativos de alta throughput e Wi-Fi dual-band robustos.' },
          { title: 'Cabos de Fibra', image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=300&q=80', description: 'Cabos aéreos ópticos AS/ASU homologados com alma de aço de sustentação.' },
          { title: 'Ferragens e Alças', image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=300&q=80', description: 'Ferragens de fixação em postes, alças de ancoragem e roldanas.' }
        ]
      case 'transportes':
        return [
          { title: 'MDVR Automotivo', image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=300&q=80', description: 'Gravador de vídeo automotivo blindado contra alta vibração e poeira.' },
          { title: 'Câmeras de Fadiga', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80', description: 'Algoritmos de IA integrados para alertar sobre sono e distração de motoristas.' },
          { title: 'Câmeras de Ré Rugosas', image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=300&q=80', description: 'Câmeras de alta vedação IP67/IP69K contra água e poeira para caminhões.' },
          { title: 'Monitores de Cabine', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80', description: 'Telas robustas coloridas de alta resolução para visualização do painel.' },
          { title: 'Cabos de Aviação M12', image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=300&q=80', description: 'Conectores circulares blindados com trava rosqueável contra trepidação severa.' }
        ]
      default:
        return []
    }
  }

  return (
    <div className="text-slate-600 bg-slate-50 min-h-screen antialiased selection:bg-orange-500 selection:text-white">
      {/* Top utility bar matching Intelbras high-contrast utility bar */}
      <div className="bg-[#1e293b] text-slate-300 py-2.5 text-xs hidden md:block border-b border-slate-800">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-[#F97316]" /> Atendendo Recife e Região Metropolitana</span>
            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-[#84cc16]" /> Suporte & Emergências 24h</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="mailto:Chamealfredo@gmail.com" className="hover:text-[#F97316] transition-colors">Chamealfredo@gmail.com</a>
            <a href="https://instagram.com/chamealfredo" target="_blank" className="hover:text-orange-400 transition-colors flex items-center gap-1"><Instagram className="w-3.5 h-3.5" /> <span>@chamealfredo</span></a>
          </div>
        </div>
      </div>

      {/* Modern, high-end sticky header (relative to position drop-downs perfectly full-width) */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center relative">
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-1 group-hover:scale-105 transition-all">
              <Mascot className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 leading-none tracking-tight">Chame <span className="text-[#F97316]">Alfredo!</span></h1>
              <p className="text-[9px] text-slate-400 font-bold tracking-[0.08em] uppercase mt-1">Automação, Segurança & Manutenção Predial</p>
            </div>
          </a>

          {/* Interactive header links with drop-down menus on hover (Intelbras mega-menu style, static divs to position relative to parent header) */}
          <nav className="hidden md:flex space-x-6 font-semibold text-slate-600 text-sm">
            {/* 1. Produtos e Soluções - REBUILT TO MATCH PORTAL MOCKUP EXACTLY */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('produtos')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-1 transition-colors font-semibold text-sm focus:outline-none ${activeDropdown === 'produtos' ? 'text-[#F97316]' : 'text-slate-700 hover:text-[#F97316]'}`}>
                Produtos e Soluções <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'produtos' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'produtos' && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Invisible bridge to prevent gap between button and dropdown */}
                  <div className="h-2 w-full" />
                  <div className="w-[980px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/80 border border-slate-150 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden flex">
                    {/* Left Sidebar Category panel identical to mockup */}
                    <div className="w-1/4 bg-slate-50/80 border-r border-slate-100 p-6 flex flex-col justify-between max-h-[640px] overflow-y-auto custom-scrollbar">
                      <div>
                        <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest mb-4">Navegue por produtos</h4>
                        <ul className="space-y-2 text-xs text-slate-600 font-bold">
                          {[
                            { id: 'seguranca', label: 'Segurança eletrônica' },
                            { id: 'redes', label: 'Redes' },
                            { id: 'comunicacao', label: 'Comunicação' },
                            { id: 'acesso', label: 'Controle de Acesso' },
                            { id: 'energia', label: 'Energia' },
                            { id: 'energia_solar', label: 'Energia Solar' }
                          ].map((cat) => (
                            <li key={cat.id}>
                              <button 
                                onMouseEnter={() => setActiveCategory(cat.id)}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full text-left py-1.5 px-3 rounded-lg transition-all ${activeCategory === cat.id ? 'bg-white text-[#F97316] shadow-sm border border-slate-100/50' : 'hover:text-slate-900 hover:bg-slate-100/50'}`}
                              >
                                {cat.label}
                              </button>
                            </li>
                          ))}
                        </ul>

                        <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest mt-6 mb-4">Encontre Soluções</h4>
                        <ul className="space-y-2 text-xs text-slate-600 font-bold">
                          {[
                            { id: 'casa_inteligente', label: 'Casa Inteligente' },
                            { id: 'residenciais', label: 'Residenciais' },
                            { id: 'pme', label: 'Pequenas e médias empresas' },
                            { id: 'grandes_empresas', label: 'Grandes empresas e projetos' },
                            { id: 'provedores', label: 'Provedores' },
                            { id: 'transportes', label: 'Transportes' }
                          ].map((cat) => (
                            <li key={cat.id}>
                              <button 
                                onMouseEnter={() => setActiveCategory(cat.id)}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full text-left py-1.5 px-3 rounded-lg transition-all ${activeCategory === cat.id ? 'bg-white text-[#F97316] shadow-sm border border-slate-100/50' : 'hover:text-slate-900 hover:bg-slate-100/50'}`}
                              >
                                {cat.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Product Grid with high fidelity icons & green right-arrows, plus Close X button */}
                    <div className="w-3/4 p-8 relative bg-white max-h-[640px] overflow-y-auto custom-scrollbar">
                      <button 
                        onClick={() => setActiveDropdown(null)} 
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 hover:bg-slate-50 rounded-full z-10 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="grid grid-cols-3 gap-y-6 gap-x-4 mt-2">
                        {getSubitemsForCategory().map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setActiveDropdown(null);
                              setLeadModalOpen(true);
                            }}
                            className="flex flex-col items-center text-center p-3 hover:bg-slate-50/70 border border-transparent hover:border-slate-100 rounded-2xl cursor-pointer group transition-all duration-300"
                          >
                            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-[11px] font-extrabold text-slate-700 group-hover:text-[#00A859] transition-colors flex items-center gap-1 justify-center leading-tight">
                              {item.title} <span className="text-[#00A859] font-black text-xs transition-transform duration-300 group-hover:translate-x-1">&gt;</span>
                            </span>
                            <p className="text-[9.5px] text-slate-400 font-medium mt-1 leading-normal max-w-[170px] text-center group-hover:text-slate-500 transition-colors">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Destaques */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('destaques')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-1 transition-colors font-semibold text-sm focus:outline-none ${activeDropdown === 'destaques' ? 'text-[#F97316]' : 'text-slate-700 hover:text-[#F97316]'}`}>
                Destaques <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'destaques' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'destaques' && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="h-2 w-full" />
                  <div className="w-[760px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/80 border border-slate-100 p-7 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#F97316] uppercase tracking-wider mb-3 pb-1.5 border-b border-orange-50">Urgência & Atendimento</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <li>
                          <a href="#home" onClick={() => setActiveDropdown(null)} className="flex items-center gap-1.5 hover:text-[#F97316] py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span> Plantão Expresso 24h
                          </a>
                        </li>
                        <li>
                          <a href="#servicos" onClick={() => setActiveDropdown(null)} className="flex items-center gap-1.5 hover:text-[#F97316] py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Resposta em até 30 Minutos
                          </a>
                        </li>
                        <li>
                          <a href="#servicos" onClick={() => setActiveDropdown(null)} className="flex items-center gap-1.5 hover:text-[#F97316] py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> SLA Garantido em Recife
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#00A859] uppercase tracking-wider mb-3 pb-1.5 border-b border-emerald-50">Nossos Diferenciais</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 6 Meses de Garantia por Escrito</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Peças 100% Homologadas & Originais</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Técnico Especializado desde 2015</li>
                      </ul>
                    </div>
                    {/* Intelbras Rich Featured Card on Right for Destaques */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <div className="h-24 w-full rounded-lg overflow-hidden bg-white border border-slate-100 mb-2 flex items-center justify-center">
                          <img 
                            src="https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&w=300&q=80" 
                            alt="Segurança e Proteção" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h5 className="font-bold text-xs text-slate-800 leading-tight">Garantia Total em Contrato</h5>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Todas as peças e a mão de obra de Alfredo contam com cobertura formal.</p>
                      </div>
                      <a 
                        href="#sobre" 
                        onClick={() => setActiveDropdown(null)}
                        className="text-[10px] text-[#F97316] font-bold hover:underline mt-2 inline-block"
                      >
                        Conhecer Diferenciais &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Onde Encontrar */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('onde')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-1 transition-colors font-semibold text-sm focus:outline-none ${activeDropdown === 'onde' ? 'text-[#F97316]' : 'text-slate-700 hover:text-[#F97316]'}`}>
                Onde Encontrar <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'onde' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'onde' && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="h-2 w-full" />
                  <div className="w-[520px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/80 border border-slate-100 p-6 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#F97316] uppercase tracking-wider mb-3 pb-1 border-b border-orange-50">Recife (Bairros)</h4>
                      <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                        <li>• Zona Sul (Boa Viagem, Imbiribeira, Pina)</li>
                        <li>• Zona Norte (Casa Forte, Espinheiro, Jaqueira)</li>
                        <li>• Zona Oeste (Madalena, Cordeiro, Iputinga)</li>
                        <li>• Centro (Boa Vista, Santo Amaro, Recife Antigo)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#00A859] uppercase tracking-wider mb-3 pb-1 border-b border-emerald-50">Região Metropolitana</h4>
                      <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                        <li>• Jaboatão dos Guararapes (Piedade, Candeias)</li>
                        <li>• Olinda (Casa Caiada, Bairro Novo, Rio Doce)</li>
                        <li>• Paulista (Janga, Pau Amarelo)</li>
                        <li>• Camaragibe & São Lourenço da Mata</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Suporte */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('suporte')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-1 transition-colors font-semibold text-sm focus:outline-none ${activeDropdown === 'suporte' ? 'text-[#F97316]' : 'text-slate-700 hover:text-[#F97316]'}`}>
                Suporte <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'suporte' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'suporte' && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="h-2 w-full" />
                  <div className="w-[460px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/80 border border-slate-100 p-6 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#00A859] uppercase tracking-wider mb-3 pb-1 border-b border-emerald-50">Urgência de Suporte</h4>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">Precisa de conserto de portão ou câmera CFTV travada agora?</p>
                      <a href="tel:5581988417003" className="flex items-center justify-center gap-1.5 bg-[#00A859] hover:bg-[#00904d] text-white text-[11px] font-bold py-2 px-3 rounded-lg transition-colors">
                        <PhoneCall className="w-3.5 h-3.5" /> Suporte 24h Rec
                      </a>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#F97316] uppercase tracking-wider mb-3 pb-1 border-b border-orange-50">Canais Digitais</h4>
                      <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                        <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> (81) 98841-7003</li>
                        <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> Chamealfredo@gmail.com</li>
                        <li className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Resposta em até 30 min</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Contato */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('contato')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-1 transition-colors font-semibold text-sm focus:outline-none ${activeDropdown === 'contato' ? 'text-[#F97316]' : 'text-slate-700 hover:text-[#F97316]'}`}>
                Contato <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'contato' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'contato' && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="h-2 w-full" />
                  <div className="w-[440px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/80 border border-slate-100 p-6 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#F97316] uppercase tracking-wider mb-3 pb-1 border-b border-orange-50">Canais de Contato</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
                        <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-600" /> (81) 9 8841-7003</li>
                        <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#F97316]" /> Chamealfredo@gmail.com</li>
                        <li className="flex items-center gap-2">
                          <a href="https://instagram.com/chamealfredo" target="_blank" className="hover:text-pink-500 flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-500" /> @chamealfredo
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#00A859] uppercase tracking-wider mb-3 pb-1 border-b border-emerald-50">Funcionamento</h4>
                      <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                        <li>• Segunda a Sábado: 8h às 22h</li>
                        <li>• Domingos & Feriados: Plantão de Emergência 24h</li>
                        <li>• SLA Comercial: Resposta no mesmo dia</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Sobre Nós */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('sobre')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-1 transition-colors font-semibold text-sm focus:outline-none ${activeDropdown === 'sobre' ? 'text-[#F97316]' : 'text-slate-700 hover:text-[#F97316]'}`}>
                Sobre Nós <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'sobre' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'sobre' && (
                <div 
                  className="absolute top-full right-0 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="h-2 w-full" />
                  <div className="w-[420px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/80 border border-slate-100 p-6 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2.5">Quem é Alfredo?</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Especialista em automação e segurança eletrônica desde 2015. Referência em condomínios de Recife por resolver os defeitos mais complexos de portões de forma limpa e transparente.</p>
                      <a href="#sobre" onClick={() => setActiveDropdown(null)} className="text-[11px] text-[#F97316] font-bold hover:underline mt-2 inline-block">Conhecer História &rarr;</a>
                    </div>
                    <div className="flex items-center justify-center p-2 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-white border border-slate-100 flex items-center justify-center p-1 shadow-sm">
                        <Mascot className="w-[85%] h-[85%] object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Pill WhatsApp button renamed to "Peça um Orçamento" as requested */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="flex items-center text-slate-600 hover:text-[#F97316] font-bold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
              <User className="w-4 h-4 mr-1.5" /> Entrar
            </a>
            <button 
              onClick={() => {
                setLeadModalOpen(true);
                trackWhatsAppClick();
              }}
              className="flex items-center bg-[#00A859] hover:bg-[#00904d] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md shadow-green-600/10 hover:shadow-lg hover:scale-102"
            >
              <PhoneCall className="w-4 h-4 mr-2 animate-pulse" /> Peça um Orçamento
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-800 focus:outline-none p-1.5 hover:bg-slate-50 rounded-lg">
            <svg className="w-6.5 h-6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <a href="#home" onClick={() => setMenuOpen(false)} className="block text-slate-700 font-bold hover:text-[#F97316]">Início</a>
            <a href="#servicos" onClick={() => setMenuOpen(false)} className="block text-slate-700 font-bold hover:text-[#F97316]">Serviços</a>
            <a href="#sobre" onClick={() => setMenuOpen(false)} className="block text-slate-700 font-bold hover:text-[#F97316]">Sobre Nós</a>
            <hr className="border-slate-100" />
            <a href="/login" className="flex items-center justify-center border border-slate-200 text-center py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50"><User className="w-4 h-4 mr-2" /> Entrar</a>
            <button 
              onClick={() => {
                setMenuOpen(false);
                setLeadModalOpen(true);
              }}
              className="w-full bg-[#00A859] text-white text-center py-3 rounded-full font-bold shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" /> Peça um Orçamento
            </button>
          </div>
        )}
      </header>

      {/* Hero Section Estilo Intelbras Puro */}
      <section id="home" className="relative overflow-hidden bg-white border-b border-slate-100 py-20 lg:py-28">
        {/* Background graphics inspired by Intelbras circular accent */}
        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[32px] border-emerald-500/5 pointer-events-none hidden lg:block"></div>
        <div className="absolute top-[40%] right-[5%] -translate-y-1/2 w-[450px] h-[450px] rounded-full border-[16px] border-[#F97316]/5 pointer-events-none hidden lg:block"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center bg-orange-50 border border-orange-200/60 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <span className="w-2.5 h-2.5 bg-[#F97316] rounded-full mr-2 animate-pulse"></span>
                <span className="text-[#F97316] text-xs font-bold uppercase tracking-wider">Atendimento Rápido em Recife</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-[1.1] mb-6">
                Segurança, Portões & Tecnologia do <span className="text-[#F97316]">Seu Jeito.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Soluções inteligentes para portões automáticos, CFTV, controle de acesso e antenas prediais. Alfredo resolve com rapidez o que os outros técnicos dizem que não tem conserto, garantindo a tranquilidade do seu condomínio ou empresa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://wa.me/5581988417003"
                  onClick={trackWhatsAppClick}
                  className="bg-[#00A859] hover:bg-[#00904d] text-white text-base font-bold px-8 py-4 rounded-full shadow-lg shadow-green-600/20 flex items-center justify-center transform hover:-translate-y-0.5 transition-all"
                >
                  <MessageCircle className="mr-2 w-5 h-5 fill-white" /> Falar com o Alfredo
                </a>
                <a
                  href="#servicos"
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 rounded-full border border-slate-200 text-center flex items-center justify-center transition-all shadow-sm"
                >
                  Conhecer Nossas Soluções
                </a>
              </div>
            </div>

            {/* Circular framing design for Handyman mascot */}
            <div className="lg:w-5/12 flex justify-center relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/10 to-transparent animate-spin-slow"></div>
                <div className="absolute inset-3.5 rounded-full border border-dashed border-slate-200"></div>
                <div className="absolute inset-8 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                  <Mascot className="w-[85%] h-[85%] object-contain" />
                </div>

                {/* Floating tags */}
                <div className="absolute top-2 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 transform translate-x-2 animate-bounce-slow">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Serviço Garantido</span>
                </div>
                <div className="absolute -bottom-2 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 transform -translate-x-2">
                  <Clock className="w-5 h-5 text-[#F97316]" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Suporte 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Lead Form Ribbon just below Hero */}
      <section className="relative z-20 -mt-12 max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Orçamento Expresso
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Preencha e receba nosso contato direto em minutos</p>
            </div>

            {step === 'initial' && (
              <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Passo 1 de 2: Seus Dados</span>
              </div>
            )}
            {step === 'service_selection' && (
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Passo 2 de 2: O que precisa?</span>
              </div>
            )}
          </div>

          {showSuccessMessage && (
            <div className="mb-6 p-4.5 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />
              <p className="text-emerald-800 font-semibold text-sm">
                Solicitação enviada com sucesso! Alfredo já foi acionado e falará com você no WhatsApp.
              </p>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            {step === 'initial' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 items-end">
                <div>
                  <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Seu Nome</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-10.5 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 disabled:opacity-50 text-sm"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-10.5 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 disabled:opacity-50 text-sm"
                      placeholder="(81) 98841-7003"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4.5 w-4.5 border-b-2 border-white"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Continuar Orçamento <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                  <p className="text-slate-700 font-bold text-sm mb-3">Selecione os serviços que precisa:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'portao', label: 'Portão Automático' },
                      { id: 'seguranca', label: 'Câmeras / Segurança' },
                      { id: 'preventiva', label: 'Manut. Preventiva' },
                      { id: 'outro', label: 'Outros Serviços' }
                    ].map(s => {
                      const isSelected = formData.services.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleService(s.id)}
                          className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-[#F97316] bg-orange-50 text-[#F97316]'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Algum detalhe adicional? (Opcional)</label>
                  <textarea
                    placeholder="Ex: portão parou de fechar, câmera sem imagem, etc..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#F97316] outline-none text-sm h-20 resize-none text-slate-800"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('initial')}
                    className="sm:w-1/4 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-3.5 rounded-2xl text-sm transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFinalSubmit()}
                    disabled={isSubmitting || formData.services.length === 0}
                    className="sm:w-3/4 bg-[#00A859] hover:bg-[#00904d] text-white font-bold py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : 'Peça um Orçamento Rápido'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Quick Stats Grid under floating form */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
            <div className="flex -space-x-2">
              {['JS', 'MS', 'PC'].map((init, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                  {init}
                </div>
              ))}
              <div className="text-[10px] text-slate-400 font-medium pl-4 flex flex-col justify-center leading-tight">
                <span className="text-slate-700 font-bold block">Excelente (4.8/5)</span>
                2.000+ atendimentos em Recife
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-60" />
              <div className="text-[10px] text-slate-400 font-medium leading-tight">
                <span className="text-slate-700 font-bold block">Atendimento Garantido</span>
                6 meses de garantia em peças e serviços
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics strip - elegant, cards with soft gray backgrounds */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Users}
              number="2.000+"
              text="Clientes Atendidos"
              subtext="Condomínios, residências e corporações"
              color="text-[#F97316]"
            />
            <MetricCard
              icon={Star}
              number="4.8/5"
              text="Nota no Google"
              subtext="Garantia de satisfação dos clientes"
              color="text-amber-500 animate-pulse"
            />
            <MetricCard
              icon={Clock}
              number="30 min"
              text="Tempo de Resposta"
              subtext="SLA recorde para urgências prediais"
              color="text-emerald-500"
            />
            <MetricCard
              icon={ShieldCheck}
              number="6 Meses"
              text="Garantia Total"
              subtext="Segurança absoluta em todas as peças"
              color="text-sky-500"
            />
          </div>
        </div>
      </section>

      {/* Official Partners strip */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Marcas oficiais com que trabalhamos</h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">Trabalhamos exclusivamente com marcas consagradas pelo mercado para garantir a máxima durabilidade e segurança.</p>
          </div>
          <BrandLogo />
        </div>
      </section>

      {/* Services Grid Section (Colunas Tecnológicas Estilo Intelbras) */}
      <section id="servicos" className="py-20 lg:py-28 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest bg-orange-50 border border-orange-200/50 px-4 py-1.5 rounded-full">Nossas Soluções</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mt-4 mb-4 leading-tight">Serviços inteligentes para condomínios e empresas</h2>
            <div className="w-16 h-1 bg-[#F97316] mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={DoorOpen}
              title="Conserto de Portões Automáticos"
              description="Portão travado, fazendo barulho ou quebrado? Alfredo realiza o diagnóstico no mesmo dia e substitui peças originais Garen, Rossi e PPA para deixar tudo funcionando em poucas horas."
              benefits={["Diagnóstico prévio por WhatsApp", "Substituição imediata de molas e trilhos", "Atendimento emergencial 24h"]}
              ctaText="Chamar Socorro Técnico"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={Settings}
              title="Manutenção Preventiva de Segurança"
              description="Evite paradas indesejadas e garanta o perfeito funcionamento das engrenagens do seu condomínio. Lubrificação e ajustes periódicos que reduzem custos emergenciais em até 40%."
              benefits={["Planos mensais sem fidelidade agressiva", "Verificação técnica detalhada por checklist", "Prevenção de acidentes mecânicos"]}
              ctaText="Agendar Preventiva"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={Camera}
              title="Câmeras e Sistemas de CFTV IP"
              description="Seu patrimônio monitorado 24 horas por dia. Instalação e manutenção especializada em sistemas Intelbras e Hikvision HD. Acesse as imagens em tempo real de qualquer lugar pelo celular."
              benefits={["Resolução Full HD e visão noturna", "Gravação em nuvem ou local segura", "Treinamento para a portaria inclusa"]}
              ctaText="Solicitar CFTV"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={ShieldCheck}
              title="Controle de Acesso por Tag & Biometria"
              description="Elimine chaves tradicionais e traga modernidade para a entrada. Instalação de leitores biométricos, fechaduras eletroímãs e tags inteligentes integradas para o controle de moradores."
              benefits={["Acesso rápido por tag, senha ou digital", "Histórico de auditoria de acessos completo", "Redução de vulnerabilidades na entrada"]}
              ctaText="Conhecer Controle de Acesso"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={AlertTriangle}
              title="Sistemas Anti-Esmagamento e Barreiras"
              description="Segurança em primeiro lugar. Instalação de barreiras infravermelhas ativas que detectam carros, pedestres ou pets e interrompem imediatamente o movimento do portão automático."
              benefits={["Fotocélulas certificadas pela ABNT", "Proteção de crianças e animais domésticos", "Testes mensais de calibragem de sensores"]}
              ctaText="Instalar Sensor Anti-Esmagamento"
              onCtaClick={() => setLeadModalOpen(true)}
            />
            <ServiceCard
              icon={Tv}
              title="Antenas Coletivas Digitais Prediais"
              description="Adeus sinal chuviscado ou travando. Alfredo instala antenas coletivas e repara o cabeamento interno de edifícios, garantindo que todas as unidades tenham sinal de TV perfeito e limpo."
              benefits={["Sinal digital limpo em todos apartamentos", "Reparo e limpeza de conexões nos andares", "Manutenção centralizada na cobertura"]}
              ctaText="Melhorar Sinal Coletivo"
              onCtaClick={() => setLeadModalOpen(true)}
            />

            {/* Prominent Emergency Banner spanning full width */}
            <div className="md:col-span-2 lg:col-span-3 mt-4">
              <div className="relative p-8 rounded-3xl bg-[#1e293b] text-white shadow-xl overflow-hidden border border-slate-700 hover:border-orange-500/80 transition-all duration-300">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/5 animate-pulse">
                      <LifeBuoy className="w-6 h-6 text-[#F97316]" />
                    </div>
                    <h3 className="text-2xl font-black text-[#F97316] leading-tight mb-2">Emergência Agora? Atendimento Expresso 24h</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">Portão travado no meio da noite, garagem aberta ou CFTV offline? Não espere até amanhã. Alfredo está de plantão agora mesmo para resolver o seu problema.</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = 'tel:5581988417003'}
                    className="flex-shrink-0 bg-[#00A859] hover:bg-[#00904d] text-white font-bold py-4 px-8 rounded-full shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-5 h-5 animate-bounce" /> Ligar Agora: (81) 98841-7003
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Clean modern styles on soft background */}
      <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest bg-orange-50 border border-orange-200/50 px-4 py-1.5 rounded-full">Depoimentos</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mt-4 mb-4 leading-tight">O que os nossos clientes de Recife dizem</h2>
            <div className="w-16 h-1 bg-[#F97316] mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col shadow-sm">
              <Quote className="w-8 h-8 text-orange-400 opacity-20 mb-4" />
              <p className="text-slate-600 mb-6 text-sm italic flex-grow">"Nosso portão de condomínio travou na segunda-feira à noite e impedia a entrada de carros. Alfredo veio em 40 minutos e resolveu o conserto da mola. Super profissional!"</p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <div className="flex items-center mt-auto border-t border-slate-200/60 pt-4">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F97316] font-extrabold text-sm mr-3">JS</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-800 text-sm">João Silva</h4>
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Verificado</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Edifício Ponto Real, Recife</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col shadow-sm">
              <Quote className="w-8 h-8 text-orange-400 opacity-20 mb-4" />
              <p className="text-slate-600 mb-6 text-sm italic flex-grow">"Nossas câmeras de segurança viviam travando por problemas de sinal. Alfredo refez toda a fiação IP da loja e instalou equipamentos Intelbras. Tudo perfeito há 2 anos."</p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <div className="flex items-center mt-auto border-t border-slate-200/60 pt-4">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F97316] font-extrabold text-sm mr-3">MS</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-800 text-sm">Maria Santos</h4>
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Verificado</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Loja Meu Sonho, Jaboatão</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col shadow-sm">
              <Quote className="w-8 h-8 text-orange-400 opacity-20 mb-4" />
              <p className="text-slate-600 mb-6 text-sm italic flex-grow">"Excelente técnico e muito honesto. Tivemos um problema bobo no sensor e, por estar dentro dos 6 meses de garantia, ele trocou sem cobrar nenhuma taxa extra. Recomendo demais!"</p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <div className="flex items-center mt-auto border-t border-slate-200/60 pt-4">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F97316] font-extrabold text-sm mr-3">PC</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-800 text-sm">Pedro Costa</h4>
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Verificado</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Edifício Paulista, Recife</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setLeadModalOpen(true)}
              className="bg-[#1e293b] hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all text-base inline-flex items-center gap-2"
            >
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Quero solicitar atendimento técnico
            </button>
            <p className="text-slate-400 text-xs mt-3">Junte-se a mais de 2.000 clientes satisfeitos em Pernambuco</p>
          </div>
        </div>
      </section>

      {/* About Us section with circular framed mascot */}
      <section id="sobre" className="py-20 lg:py-28 bg-orange-50/30 border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[400px] lg:h-[400px]">
              <div className="absolute inset-0 rounded-full bg-orange-500/5 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border border-dashed border-orange-200"></div>
              <div className="absolute inset-8 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border border-slate-100">
                <Mascot className="w-[85%] h-[85%] object-contain" />
              </div>
              <div className="absolute top-2 right-2 bg-white p-4.5 rounded-2xl shadow-xl border border-slate-100 transform translate-x-2 -translate-y-2">
                <p className="text-slate-800 font-extrabold text-sm">"Deixa com o Alfredo!"</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest bg-orange-50 border border-orange-200/50 px-4 py-1.5 rounded-full">Quem somos</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mt-5 mb-6 leading-tight">10 anos resolvendo problemas técnicos complexos</h2>
            <p className="text-slate-500 text-base leading-relaxed mb-6">Alfredo iniciou a carreira ininterrupta em 2015 atendendo urgências de portão eletrônico em Recife. Com precisão cirúrgica e profundo conhecimento técnico, especializou-se em integrar segurança eletrônica e automatização predial.</p>
            <p className="text-slate-500 text-base leading-relaxed mb-8">Hoje, condomínios e grandes administradoras da região confiam no trabalho de Alfredo porque ele busca a raiz do problema, utiliza componentes de primeira linha e garante total transparência.</p>
            
            <ul className="space-y-4">
              <li className="flex items-center text-slate-700 font-bold text-sm"><CheckCircle2 className="text-emerald-500 w-5 h-5 mr-3 flex-shrink-0" /> Equipamentos homologados e peças 100% originais</li>
              <li className="flex items-center text-slate-700 font-bold text-sm"><CheckCircle2 className="text-emerald-500 w-5 h-5 mr-3 flex-shrink-0" /> Garantia total de 6 meses por escrito em contrato</li>
              <li className="flex items-center text-slate-700 font-bold text-sm"><CheckCircle2 className="text-emerald-500 w-5 h-5 mr-3 flex-shrink-0" /> Suporte técnico pós-venda direto e descomplicado</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Refined slate-blue corporate Footer */}
      <footer className="bg-[#1e293b] text-white pt-16 pb-8 border-t border-slate-800">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="sm:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center p-1 border border-white/5">
                <Mascot className="w-8 h-8" />
              </div>
              <span className="text-xl font-black text-white">Chame Alfredo</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6 text-sm leading-relaxed">A solução inteligente e definitiva para manutenção, automação de acessos e segurança eletrônica para o seu condomínio ou empresa.</p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/chamealfredo" target="_blank" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-[#F97316] transition-colors"><Instagram className="w-5 h-5 text-slate-300 hover:text-white" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider mb-6 text-[#F97316]">Contato Direto</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex items-center"><Phone className="w-4 h-4 mr-2 text-emerald-500" /> (81) 9 8841-7003</li>
              <li className="flex items-center"><Mail className="w-4 h-4 mr-2 text-emerald-500" /> Chamealfredo@gmail.com</li>
              <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-emerald-500" /> Recife - PE</li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider mb-6 text-[#F97316]">Atalhos Úteis</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#home" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Serviços</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li className="pt-2 border-t border-slate-800 mt-2"></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors text-xs flex items-center"><User className="w-3.5 h-3.5 mr-1.5" /> Área Administrativa</a></li>
              <li><a href="/mobile/login" className="hover:text-white transition-colors text-xs flex items-center"><Wrench className="w-3.5 h-3.5 mr-1.5" /> Portal do Técnico</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} Chame Alfredo Soluções Prediais. Todos os direitos reservados.
        </div>
      </footer>

      <LeadFormModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
    </div>
  )
}

export default Landing
