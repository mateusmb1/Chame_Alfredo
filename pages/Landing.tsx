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
  User
} from 'lucide-react'

const Mascot: React.FC<{ className?: string }> = ({ className }) => {
  const [sourceIndex, setSourceIndex] = useState(0)
  const sources = ['/mascot-minimalist-icon-1764812577837-removebg-preview.png', '/alfredo.webp', '/alfredo.png']
  return (
    <img
      src={sources[sourceIndex]}
      alt="Mascote Alfredo"
      className={(className ? className + ' ' : '') + 'object-contain'}
      loading="lazy"
      decoding="async"
      onError={() => setSourceIndex(Math.min(sourceIndex + 1, sources.length - 1))}
    />
  )
}

const Landing: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
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
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-0.5">Soluções Prediais</p>
            </div>
          </a>
          <nav className="hidden md:flex space-x-8 font-medium text-[#1e293b]">
            <a href="#home" className="hover:text-[#F97316] transition">Início</a>
            <a href="#servicos" className="hover:text-[#F97316] transition">Serviços</a>
            <a href="#sobre" className="hover:text-[#F97316] transition">Sobre Nós</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <a href="/mobile/login" className="hidden md:flex items-center border border-gray-200 bg-white text-[#1e293b] hover:bg-gray-50 px-4 py-2 rounded-full font-bold transition shadow-sm text-sm">
                <Wrench className="w-4 h-4 mr-2" /> Sou Técnico
              </a>
              <a href="/dashboard" className="hidden md:flex items-center bg-[#1e293b] text-white hover:bg-gray-800 px-4 py-2 rounded-full font-bold transition shadow-sm text-sm">
                <User className="w-4 h-4 mr-2" /> Área Admin
              </a>
            </div>
            <a href="https://wa.me/5581988417003" className="flex items-center bg-[#84cc16] hover:bg-green-600 text-white px-5 py-2 rounded-full font-bold transition shadow-lg">
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
            <a href="/dashboard" className="block border border-gray-200 text-center py-2 rounded font-bold flex items-center justify-center gap-2"><User className="w-4 h-4" /> Área Admin</a>
            <a href="/mobile/login" className="block border border-gray-200 text-center py-2 rounded font-bold flex items-center justify-center gap-2 text-gray-600"><Wrench className="w-4 h-4" /> Sou Técnico</a>
            <a href="https://wa.me/5581988417003" className="block bg-[#84cc16] text-white text-center py-2 rounded font-bold">Ligar Agora</a>
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
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Facilitando sua vida com <span className="text-[#F97316]">Técnica e Confiança</span></h2>
            <p className="text-lg text-gray-200 mb-8 max-w-lg mx-auto md:mx-0 font-light">Manutenção predial, portões automáticos e segurança eletrônica. O Alfredo resolve o que você precisa, na hora que você precisa.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="https://wa.me/5581988417003" className="bg-[#84cc16] hover:bg-green-600 text-white text-lg font-bold px-8 py-3 rounded-lg shadow-xl flex items-center justify-center">
                <MessageCircle className="mr-2" /> Chamar o Alfredo
              </a>
              <a href="#servicos" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-3 rounded-lg text-center">Nossos Serviços</a>
              <a href="/dashboard" className="bg-white text-[#1e293b] hover:bg-gray-100 border border-white/30 font-bold px-6 py-3 rounded-lg text-center flex items-center justify-center"><User className="w-4 h-4 mr-2" /> Admin</a>
              <a href="/mobile/login" className="bg-white/90 text-[#1e293b] hover:bg-white border border-white/30 font-bold px-6 py-3 rounded-lg text-center flex items-center justify-center"><Wrench className="w-4 h-4 mr-2" /> Técnico</a>
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
              <form onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada! Alfredo entrará em contato.') }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1 uppercase">Seu Nome</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1 uppercase">WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      required
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
                      placeholder="(81) 9 8841-7003"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1 uppercase">Serviço</label>
                    <select
                      name="service"
                      required
                      defaultValue=""
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none text-gray-900"
                    >
                      <option value="" disabled hidden>
                        Selecione um serviço
                      </option>
                      <option value="manutencao">Manutenção Geral</option>
                      <option value="portao">Portão Automático</option>
                      <option value="seguranca">Câmeras / Segurança</option>
                      <option value="antena">Antena Coletiva</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-[#1e293b] hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center">
                    Solicitar Agora <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Trabalhamos com as melhores marcas</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="font-bold text-xl flex items-center gap-2"><ShieldCheck /> INTELBRAS</span>
            <span className="font-bold text-xl flex items-center gap-2"><Video /> HIKVISION</span>
            <span className="font-bold text-xl flex items-center gap-2"><Zap /> PPA</span>
            <span className="font-bold text-xl flex items-center gap-2"><Lock /> GAREN</span>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F97316] font-bold text-sm uppercase tracking-wider">O que fazemos</span>
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-[#1e293b] mt-2 mb-4">Soluções completas para seu condomínio</h2>
            <div className="w-20 h-1.5 bg-[#F97316] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#F97316] transition">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Wrench className="w-7 h-7 text-[#F97316]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Manutenção Predial</h3>
              <p className="text-gray-600 text-sm">Reparos elétricos, hidráulicos e estruturais. Mantenha seu patrimônio valorizado e seguro.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#F97316] transition">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Camera className="w-7 h-7 text-[#F97316]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Segurança Eletrônica</h3>
              <p className="text-gray-600 text-sm">Instalação e manutenção de CFTV, câmeras IP e sistemas de monitoramento.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#F97316] transition">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <DoorOpen className="w-7 h-7 text-[#F97316]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Portões Automáticos</h3>
              <p className="text-gray-600 text-sm">Motores rápidos e seguros. Manutenção preventiva para evitar imprevistos.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#F97316] transition">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Tv className="w-7 h-7 text-[#F97316]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Antena Coletiva</h3>
              <p className="text-gray-600 text-sm">Sinal digital limpo para todos os apartamentos. Cabeamento estruturado.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#F97316] transition">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7 text-[#F97316]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Interfonia e PABX</h3>
              <p className="text-gray-600 text-sm">Comunicação eficiente entre portaria e apartamentos. Centrais digitais.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#1e293b] text-white shadow-lg relative overflow-hidden cursor-pointer">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <LifeBuoy className="w-7 h-7 text-[#F97316]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#F97316]">Precisa de Ajuda Urgente?</h3>
                <p className="text-gray-300 text-sm mb-4">Plantão 24h para emergências em portões e segurança.</p>
                <span className="inline-flex items-center text-sm font-bold">Falar no WhatsApp <ArrowRight className="ml-2 w-4 h-4" /></span>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Settings className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] mb-6">Mais que um técnico, um <span className="text-[#F97316]">Parceiro de Confiança</span></h2>
            <p className="text-gray-600 text-lg mb-6">A Chame Alfredo nasceu para oferecer um serviço humanizado e tecnicamente impecável. Entrar na sua casa ou empresa exige confiança.</p>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="text-green-500 w-6 h-6 mr-3" /> Equipe uniformizada e identificada</li>
              <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="text-green-500 w-6 h-6 mr-3" /> Garantia em todos os serviços</li>
              <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="text-green-500 w-6 h-6 mr-3" /> Pagamento facilitado</li>
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
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#home" className="hover:text-white transition">Início</a></li>
              <li><a href="#servicos" className="hover:text-white transition">Serviços</a></li>
              <li><a href="#sobre" className="hover:text-white transition">Sobre Nós</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">&copy; 2024 Chame Alfredo Soluções. Todos os direitos reservados.</div>
      </footer>

    </div>
  )
}

export default Landing
