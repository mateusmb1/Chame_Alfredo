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
  MoreVertical,
  ArrowLeft,
  Briefcase,
  User,
  History,
  FileText
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

  // Memoize filtered clients for performance and robustness
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

  // Auto-select first client if none selected or if selected client no longer exists
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
        phone: (() => {
          const ddd = String(data.ddd_telefone_1 || '').trim();
          const num = String(data.telefone_1 || '').trim();
          if (ddd.length > 2 && !num) {
            const cleanFull = ddd.replace(/\D/g, '');
            if (cleanFull.length >= 10) {
              const area = cleanFull.substring(0, 2);
              const mainNum = cleanFull.substring(2);
              const formattedNum = mainNum.length === 9
                ? `${mainNum.substring(0, 5)}-${mainNum.substring(5)}`
                : `${mainNum.substring(0, 4)}-${mainNum.substring(4)}`;
              return `(${area}) ${formattedNum}`;
            }
          }
          if (ddd && num) {
            const cleanNum = num.replace(/\D/g, '');
            const formattedNum = cleanNum.length === 9
              ? `${cleanNum.substring(0, 5)}-${cleanNum.substring(5)}`
              : `${cleanNum.substring(0, 4)}-${cleanNum.substring(4)}`;
            return `(${ddd}) ${formattedNum}`;
          }
          return prev.phone;
        })(),
        email: data.email || prev.email
      }));
      showToast('success', 'Dados do CNPJ carregados!');
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
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

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      showToast('success', 'Cliente excluído!');
      if (selectedClient?.id === clientToDelete) {
        const remainingClients = clients.filter(c => c.id !== clientToDelete);
        setSelectedClient(remainingClients[0] || null);
      }
    }
    setClientToDelete(null);
  };

  const clientContracts = React.useMemo(() => {
    if (!selectedClient) return [];
    return contracts.filter(c => c.clientId === selectedClient.id);
  }, [contracts, selectedClient?.id]);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0d121b] dark:text-white tracking-tight">Gestão de Clientes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Controle sua base de clientes e contratos.</p>
        </div>
        <button
          onClick={handleOpenNewClientModal}
          className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar/List Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${showMobileDetails ? 'hidden lg:flex' : 'flex'}`}>
          {/* Search Bar */}
          <div className="bg-white dark:bg-[#101622] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, e-mail ou telefone..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
              />
            </div>
            <button className="p-2.5 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-xl">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* List/Cards */}
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  setSelectedClient(client);
                  if (window.innerWidth < 1024) setShowMobileDetails(true);
                }}
                className={`group p-4 bg-white dark:bg-[#101622] rounded-3xl border transition-all cursor-pointer
                  ${selectedClient?.id === client.id
                    ? 'border-primary ring-4 ring-primary/5'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-primary font-bold text-lg">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0d121b] dark:text-white truncate">{client.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        {client.type === 'pf' ? <User className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                        {client.type === 'pf' ? 'PF' : 'PJ'}
                      </span>
                      <span className="text-xs text-gray-400 truncate max-w-[150px]">{client.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest
                      ${client.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-gray-500/10 text-gray-500'}`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-300 transition-colors group-hover:text-primary ${selectedClient?.id === client.id ? 'text-primary' : ''}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Area */}
        <div className={`lg:w-[450px] flex flex-col bg-white dark:bg-[#101622] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden
          ${showMobileDetails ? 'fixed inset-0 z-50 rounded-none lg:relative lg:inset-auto lg:rounded-3xl' : 'hidden lg:flex'}`}>

          {selectedClient ? (
            <>
              {/* Details Header */}
              <div className="p-6 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <button onClick={() => setShowMobileDetails(false)} className="flex items-center gap-2 text-primary font-bold">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Voltar</span>
                  </button>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detalhes do Cliente</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#0d121b] dark:text-white leading-tight mb-1">{selectedClient.name}</h2>
                      <p className="text-xs text-gray-400 font-medium">ID #{selectedClient.id.substring(0, 8)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(selectedClient)} className="p-2.5 bg-blue-500/5 text-blue-500 rounded-xl hover:bg-blue-500/10 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(selectedClient.id)} className="p-2.5 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                {/* Contact Section */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-1">Contato e Dados</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-primary shadow-sm"><Mail className="w-4 h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">E-mail</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedClient.email}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-emerald-500 shadow-sm"><Phone className="w-4 h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Telefone</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedClient.phone}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-amber-500 shadow-sm"><BadgeCheck className="w-4 h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{selectedClient.type === 'pf' ? 'CPF' : 'CNPJ'}</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedClient.cpfCnpj}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-rose-500 shadow-sm"><MapPin className="w-4 h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Endereço</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-snug">{selectedClient.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History Section */}
                <div>
                  <div className="flex items-center justify-between mb-4 ml-1">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Histórico de Ordens</h4>
                    <History className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                  {selectedClient.serviceHistory && selectedClient.serviceHistory.length > 0 ? (
                    <div className="space-y-3">
                      {selectedClient.serviceHistory.map((h, i) => (
                        <div key={i} className="flex gap-4 relative">
                          {i !== selectedClient.serviceHistory!.length - 1 && <div className="absolute left-2 top-6 bottom-0 w-px bg-gray-100 dark:bg-gray-800" />}
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500 z-10 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-700 dark:text-white truncate">{h.description}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{h.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 px-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                      <p className="text-xs text-gray-400">Nenhum histórico encontrado</p>
                    </div>
                  )}
                </div>

                {/* Contracts Section */}
                <div>
                  <div className="flex items-center justify-between mb-4 ml-1">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contratos Ativos</h4>
                    <FileText className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                  {clientContracts.length > 0 ? (
                    <div className="space-y-3">
                      {clientContracts.map(c => (
                        <Link key={c.id} to="/contracts" className="block p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-800">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-700 dark:text-white capitalize">{c.contractType || 'Contrato'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${c.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-500'}`}>
                              {c.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium">Faturamento mensal: R$ {c.value.toLocaleString('pt-BR')}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 text-center bg-gray-50/30 dark:bg-white/5">
                      <p className="text-xs text-gray-400 mb-3">Sem contratos registrados</p>
                      <Link to="/contracts" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                        <UserPlus className="w-3.5 h-3.5" /> Adicionar Contrato
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <User className="w-16 h-16 opacity-10 mb-4" />
              <p className="text-sm font-medium">Selecione um cliente para ver detalhes</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
            >
              <BadgeCheck className="w-4 h-4" />
              <span>Salvar Cliente</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tipo de Cliente</label>
            <div className="flex gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'pf' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all
                  ${formData.type === 'pf' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-gray-400'}`}
              >
                Pessoa Física
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'pj' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all
                  ${formData.type === 'pj' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-gray-400'}`}
              >
                Pessoa Jurídica
              </button>
            </div>
          </div>

          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{formData.type === 'pf' ? 'CPF' : 'CNPJ'}</label>
            <input
              type="text"
              value={formData.cpfCnpj || ''}
              onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
              onBlur={handleCnpjBlur}
              className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
              placeholder={formData.type === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
              required
            />
            {isLoadingCNPJ && (
              <div className="absolute right-4 bottom-3 flex items-center"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            )}
            {formData.type === 'pj' && <p className="text-[10px] text-gray-400 mt-1 ml-1">Digite o CNPJ para preenchimento automático.</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{formData.type === 'pf' ? 'Nome Completo' : 'Razão Social'}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
              placeholder="Digite o nome..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                placeholder="exemplo@email.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Endereço</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
              placeholder="Rua, número, bairro..."
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
