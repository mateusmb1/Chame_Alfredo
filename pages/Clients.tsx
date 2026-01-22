import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../contexts/AppContext';
import { Client } from '../types/client';
import { useToast } from '../contexts/ToastContext';
import {
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  ChevronRight,
  Edit2,
  Trash2,
  ArrowLeft,
  Briefcase,
  User,
  History,
  FileText,
  Building2,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

const Clients: React.FC = () => {
  const { clients, contracts, addClient, updateClient, deleteClient } = useApp();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const filteredClients = React.useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim();
    if (!query) return clients;
    return clients.filter(c => {
      const name = (c.name || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const phone = (c.phone || '');
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [clients, searchQuery]);

  React.useEffect(() => {
    if (clients.length > 0) {
      if (!selectedClient) {
        setSelectedClient(clients[0]);
      } else if (!clients.find(c => c.id === selectedClient.id)) {
        setSelectedClient(clients[0]);
      }
    }
  }, [clients, selectedClient]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'pf' as 'pf' | 'pj',
    email: '',
    phone: '',
    cpfCnpj: '',
    address: ''
  });

  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);

  const handleOpenNewClientModal = () => {
    setIsEditMode(false);
    setEditingClientId(null);
    setFormData({ name: '', type: 'pf', cpfCnpj: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setIsEditMode(true);
    setEditingClientId(client.id);
    setFormData({
      name: client.name,
      type: client.type,
      cpfCnpj: client.cpfCnpj || '',
      email: client.email,
      phone: client.phone,
      address: client.address
    });
    setIsModalOpen(true);
  };

  const handleCnpjBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length === 14) {
      if (formData.type !== 'pj') setFormData(prev => ({ ...prev, type: 'pj' }));
    } else if (value.length === 11) {
      if (formData.type !== 'pf') setFormData(prev => ({ ...prev, type: 'pf' }));
      return;
    } else return;

    if (value.length !== 14) return;
    setIsLoadingCNPJ(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${value}`);
      if (!response.ok) throw new Error('Falha ao buscar CNPJ');
      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        name: data.razao_social || data.nome_fantasia || prev.name,
        phone: data.telefone_1 || prev.phone,
        email: data.email || prev.email
      }));
      showToast('success', 'Dados do CNPJ carregados!');
    } catch (error) {
      showToast('error', 'Erro ao buscar dados do CNPJ.');
    } finally {
      setIsLoadingCNPJ(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editingClientId) {
      updateClient(editingClientId, formData);
      showToast('success', 'Cliente atualizado!');
    } else {
      addClient(formData);
      showToast('success', 'Cliente adicionado!');
    }
    setIsModalOpen(false);
  };

  const clientContracts = React.useMemo(() => {
    if (!selectedClient) return [];
    return contracts.filter(c => c.clientId === selectedClient.id);
  }, [contracts, selectedClient?.id]);

  return (
    <div className="flex flex-col h-full space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-gray-800/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-[#F97316] rounded-full"></div>
            <p className="text-[#F97316] text-xs font-black uppercase tracking-[0.3em] leading-none">Gestão Centralizada</p>
          </div>
          <h1 className="text-5xl font-black text-[#1e293b] dark:text-white tracking-tighter leading-none mb-3 italic">
            Clientes<span className="text-[#F97316]">.</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest opacity-80">
            Administre seus parceiros, contratos e histórico.
          </p>
        </div>
        <button
          onClick={handleOpenNewClientModal}
          className="h-16 px-10 bg-[#1e293b] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-[#F97316] transition-all shadow-2xl shadow-[#1e293b]/10 hover:shadow-[#F97316]/20 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          <span>Cadastrar Novo</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 flex-1 min-h-0">
        {/* Navigation/Search & List Area */}
        <div className={`flex-[1.2] flex flex-col min-w-0 ${showMobileDetails ? 'hidden lg:flex' : 'flex'}`}>
          {/* Advanced Search */}
          <div className="bg-white dark:bg-[#101622] rounded-[2.5rem] p-5 shadow-sm border border-gray-100 dark:border-gray-800/50 mb-8 flex items-center gap-4 group">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#F97316] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="PROCURAR POR NOME, DOCUMENTO OU CONTATO..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 dark:bg-white/5 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-[#F97316]/5 dark:text-white"
              />
            </div>
            <button className="h-14 w-14 flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 rounded-2xl hover:text-[#F97316] transition-all">
              <Filter className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 flex-1 pb-10 custom-scrollbar">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  setSelectedClient(client);
                  if (window.innerWidth < 1024) setShowMobileDetails(true);
                }}
                className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden
                  ${selectedClient?.id === client.id
                    ? 'bg-slate-50 dark:bg-white/5 border-primary shadow-lg ring-1 ring-primary/20 translate-x-1'
                    : 'bg-white dark:bg-[#101622] border-gray-100 dark:border-gray-800/50 hover:border-primary/30 shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-inner shrink-0
                    ${selectedClient?.id === client.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-primary'}`}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-black text-base italic tracking-tighter uppercase mb-0.5 truncate
                      ${selectedClient?.id === client.id ? 'text-primary dark:text-white' : 'text-[#1e293b] dark:text-white'}`}>
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 opacity-60">
                        {client.type === 'pf' ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                        <span className="text-[8px] font-black uppercase tracking-widest">{client.type === 'pf' ? 'PF' : 'PJ'}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-[9px] font-bold text-gray-400 truncate max-w-[120px]">{client.phone}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest
                      ${client.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-gray-500/10 text-gray-500'}`}>
                      {client.status === 'active' ? 'Ativo' : 'Offline'}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-all
                      ${selectedClient?.id === client.id ? 'text-primary translate-x-1' : 'text-gray-200 group-hover:text-primary'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sophisticated Details Panel */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#101622] rounded-[3.5rem] border border-gray-100 dark:border-gray-800/50 shadow-2xl overflow-hidden relative
          ${showMobileDetails ? 'fixed inset-0 z-50 rounded-none lg:relative lg:inset-auto lg:rounded-[3.5rem]' : 'hidden lg:flex'}`}>

          {selectedClient ? (
            <>
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <User className="w-64 h-64 -rotate-12 translate-x-20 -translate-y-20" />
              </div>

              {/* Panel Header */}
              <div className="p-10 border-b border-gray-50 dark:border-gray-800/50 relative z-10">
                <div className="flex items-center justify-between mb-8 lg:hidden">
                  <button onClick={() => setShowMobileDetails(false)} className="h-12 px-6 bg-[#1e293b] text-white rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar ao Fluxo</span>
                  </button>
                </div>

                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-[#1e293b] to-black flex items-center justify-center text-white text-4xl font-black shadow-2xl relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl opacity-30"></div>
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tighter italic uppercase leading-none mb-3">
                        {selectedClient.name}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest">ID: {selectedClient.id.substring(0, 8)}</span>
                        <span className="px-3 py-1 bg-[#F97316]/10 text-[#F97316] rounded-lg text-[9px] font-black uppercase tracking-widest">Premium Partner</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleOpenEditModal(selectedClient)} className="w-14 h-14 bg-blue-500/5 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                      <Edit2 className="w-6 h-6" />
                    </button>
                    <button onClick={() => { setClientToDelete(selectedClient.id); setIsDeleteDialogOpen(true); }} className="w-14 h-14 bg-red-500/5 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar relative z-10">
                {/* Information Grid */}
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 ml-2">Matriz de Dados</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-[1.8rem] flex items-center gap-5 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl text-[#1e293b] dark:text-[#F97316] flex items-center justify-center shadow-sm"><Mail className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">E-mail Principal</p>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 lowercase">{selectedClient.email}</p>
                      </div>
                    </div>
                    <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-[1.8rem] flex items-center gap-5 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl text-emerald-500 flex items-center justify-center shadow-sm"><Phone className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Linha Segura</p>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedClient.phone}</p>
                      </div>
                    </div>
                    <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-[1.8rem] flex items-center gap-5 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl text-amber-500 flex items-center justify-center shadow-sm"><BadgeCheck className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{selectedClient.type === 'pf' ? 'CPF' : 'CNPJ'}</p>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedClient.cpfCnpj}</p>
                      </div>
                    </div>
                    <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-[1.8rem] flex items-start gap-5 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl text-rose-500 flex items-center justify-center shadow-sm"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Localização</p>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-relaxed">{selectedClient.address}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Intelligent Feed Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <section>
                    <div className="flex items-center justify-between mb-6 ml-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Linha do Tempo</h4>
                      <History className="w-4 h-4 text-gray-200" />
                    </div>
                    {selectedClient.serviceHistory && selectedClient.serviceHistory.length > 0 ? (
                      <div className="space-y-4">
                        {selectedClient.serviceHistory.map((h, i) => (
                          <div key={i} className="group flex gap-5 relative">
                            {i !== selectedClient.serviceHistory!.length - 1 && <div className="absolute left-[9px] top-6 bottom-[-16px] w-[2px] bg-gray-100 dark:bg-gray-800" />}
                            <div className="w-5 h-5 rounded-full bg-white dark:bg-[#1e293b] border-4 border-emerald-500 z-10 mt-1 shadow-sm group-hover:scale-125 transition-transform" />
                            <div className="flex-1 pb-4">
                              <p className="text-xs font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-0.5">{h.description}</p>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{h.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <History className="w-8 h-8 text-gray-200 mb-2" />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sem eventos registrados</p>
                      </div>
                    )}
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-6 ml-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Contratos Ativos</h4>
                      <FileText className="w-4 h-4 text-gray-200" />
                    </div>
                    {clientContracts.length > 0 ? (
                      <div className="space-y-3">
                        {clientContracts.map(c => (
                          <Link key={c.id} to="/contracts" className="block p-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] hover:bg-[#1e293b] hover:text-white transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity"><FileText className="w-12 h-12" /></div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-black uppercase italic tracking-tighter">{c.contractType || 'Master Agreement'}</span>
                              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink className="w-3 h-3" /></div>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-gray-400 group-hover:text-white/50 uppercase tracking-[0.2em]">R$ {c.value.toLocaleString('pt-BR')}</p>
                              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-white transition-colors">{c.status}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Portfólio em Branco</p>
                        <button className="h-10 px-6 bg-[#1e293b] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#F97316] transition-all shadow-lg active:scale-95">
                          + Vender Contrato
                        </button>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-200">
              <div className="w-32 h-32 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-8 border border-gray-100 dark:border-gray-800 animate-pulse">
                <User className="w-12 h-12 opacity-10" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Selecione para auditar</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => { if (clientToDelete) { deleteClient(clientToDelete); showToast('success', 'Nexo com cliente encerrado.'); if (selectedClient?.id === clientToDelete) setSelectedClient(clients.find(c => c.id !== clientToDelete) || null); } setClientToDelete(null); setIsDeleteDialogOpen(false); }}
        title="Encerrar Relacionamento"
        message="Esta ação irá remover permanentemente o registro do cliente. Os dados históricos serão arquivados."
        confirmText="Confirmar Remoção"
        cancelText="Manter Registro"
        type="danger"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'MODULAR EDIT: CLIENT' : 'NEW REGISTRATION: CLIENT'}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-4 w-full px-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            >
              Abortar
            </button>
            <button
              onClick={handleSubmit}
              className="px-10 py-4 bg-[#1e293b] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-[#F97316] transition-all active:scale-95"
            >
              Validar e Salvar
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 font-bold">Natureza da Conta</label>
            <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-white/5 rounded-[1.5rem] border border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'pf' })}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${formData.type === 'pf' ? 'bg-[#1e293b] text-white shadow-xl' : 'text-gray-400'}`}
              >
                Pessoa Física
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'pj' })}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${formData.type === 'pj' ? 'bg-[#1e293b] text-white shadow-xl' : 'text-gray-400'}`}
              >
                Corporativo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{formData.type === 'pf' ? 'CPF' : 'CNPJ'}</label>
              <div className="group relative">
                <input
                  type="text"
                  value={formData.cpfCnpj || ''}
                  onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                  onBlur={handleCnpjBlur}
                  className="w-full h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-bold focus:ring-4 focus:ring-[#F97316]/5 focus:border-[#F97316]/50 dark:text-white px-5 transition-all"
                  placeholder={formData.type === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
                  required
                />
                {isLoadingCNPJ && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2"><div className="w-5 h-5 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin" /></div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{formData.type === 'pf' ? 'Identidade Legal' : 'Nome de Registro'}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-bold focus:ring-4 focus:ring-[#F97316]/5 focus:border-[#F97316]/50 dark:text-white px-5 transition-all"
                placeholder="NOME OU RAZÃO SOCIAL"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Fluxo de E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-bold focus:ring-4 focus:ring-[#F97316]/5 focus:border-[#F97316]/50 dark:text-white px-5 transition-all"
                placeholder="EXEMPLO@EMAIL.COM"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Contato Telefônico</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-bold focus:ring-4 focus:ring-[#F97316]/5 focus:border-[#F97316]/50 dark:text-white px-5 transition-all"
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Endereço Operacional</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full p-5 rounded-[1.8rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-bold focus:ring-4 focus:ring-[#F97316]/5 focus:border-[#F97316]/50 dark:text-white transition-all uppercase placeholder:opacity-20"
              placeholder="RUA, NÚMERO, BAIRRO, CIDADE/UF"
            />
          </div>
        </form>
      </Modal>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Clients;
