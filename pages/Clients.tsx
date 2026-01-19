import React, { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../contexts/AppContext';
import { Client } from '../types/client';
import { useToast } from '../contexts/ToastContext';

const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useApp();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Auto-select first client if none selected
  React.useEffect(() => {
    if (!selectedClient && clients.length > 0) {
      setSelectedClient(clients[0]);
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
    // Remove non-digits
    const value = e.target.value.replace(/\D/g, '');

    // Auto-detect PF/PJ based on length (11=CPF, 14=CNPJ)
    if (value.length === 14) {
      if (formData.type !== 'pj') {
        setFormData(prev => ({ ...prev, type: 'pj' }));
      }
    } else if (value.length === 11) {
      if (formData.type !== 'pf') {
        setFormData(prev => ({ ...prev, type: 'pf' }));
      }
      return; // Don't fetch for CPF
    } else {
      return; // Invalid length
    }

    // Only fetch if it looks like a CNPJ (14 digits)
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
          // Normalize fields
          const ddd = String(data.ddd_telefone_1 || '').trim();
          const num = String(data.telefone_1 || '').trim();

          // Scenario 1: DDD field has the full number (e.g., "8188417003") and num is empty
          if (ddd.length > 2 && !num) {
            const cleanFull = ddd.replace(/\D/g, '');
            if (cleanFull.length >= 10) {
              const area = cleanFull.substring(0, 2);
              const mainNum = cleanFull.substring(2);
              // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
              const formattedNum = mainNum.length === 9
                ? `${mainNum.substring(0, 5)}-${mainNum.substring(5)}`
                : `${mainNum.substring(0, 4)}-${mainNum.substring(4)}`;
              return `(${area}) ${formattedNum}`;
            }
          }

          // Scenario 2: Standard case (DDD="81", Num="88417003")
          if (ddd && num) {
            const cleanNum = num.replace(/\D/g, '');
            const formattedNum = cleanNum.length === 9
              ? `${cleanNum.substring(0, 5)}-${cleanNum.substring(5)}`
              : `${cleanNum.substring(0, 4)}-${cleanNum.substring(4)}`;
            return `(${ddd}) ${formattedNum}`;
          }

          // Fallback
          return prev.phone;
        })(),
        email: data.email || prev.email
      }));

      showToast('success', 'Dados do CNPJ carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      showToast('error', 'Erro ao buscar dados do CNPJ. Verifique o número digitado.');
    } finally {
      setIsLoadingCNPJ(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && editingClientId) {
      updateClient(editingClientId, formData);
      showToast('success', 'Cliente atualizado com sucesso!');
    } else {
      addClient(formData);
      showToast('success', 'Cliente adicionado com sucesso!');
    }

    setIsModalOpen(false);
    setFormData({ name: '', type: 'pf', cpfCnpj: '', email: '', phone: '', address: '' });
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      showToast('success', 'Cliente excluído com sucesso!');

      // If deleted client was selected, select another one
      if (selectedClient?.id === clientToDelete) {
        const remainingClients = clients.filter(c => c.id !== clientToDelete);
        setSelectedClient(remainingClients[0] || null);
      }
    }
    setClientToDelete(null);
  };

  return (
    <div class="flex h-full flex-col">
      <header class="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between whitespace-nowrap border-b border-gray-200 bg-background-light/80 px-8 backdrop-blur-sm dark:border-gray-800 dark:bg-background-dark/80">
        <div class="flex items-center gap-8">
          <h2 class="text-xl font-bold leading-tight text-[#333333] dark:text-white">Gestão de Clientes</h2>
        </div>
        <div class="flex flex-1 items-center justify-end gap-4">
          <button
            onClick={handleOpenNewClientModal}
            class="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
          >
            <span class="material-symbols-outlined text-xl">add</span>
            <span>Novo Cliente</span>
          </button>
        </div>
      </header>

      {/* New/Edit Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              class="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              class="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
            >
              <span class="material-symbols-outlined text-lg">save</span>
              <span>Salvar Cliente</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} class="space-y-4">
          {/* Client Type */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Cliente
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="pf"
                  checked={formData.type === 'pf'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'pf' | 'pj' })}
                  class="h-4 w-4 text-primary focus:ring-primary"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">Pessoa Física</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="pj"
                  checked={formData.type === 'pj'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'pf' | 'pj' })}
                  class="h-4 w-4 text-primary focus:ring-primary"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">Pessoa Jurídica</span>
              </label>
            </div>
          </div>

          {/* CPF/CNPJ */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {formData.type === 'pf' ? 'CPF' : 'CNPJ'}
            </label>
            <div class="relative">
              <input
                type="text"
                value={formData.cpfCnpj || ''}
                onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                onBlur={handleCnpjBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission
                    handleCnpjBlur(e as any); // Trigger existing logic
                  }
                }}
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder={formData.type === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
                required
              />
              {isLoadingCNPJ && (
                <div class="absolute right-3 top-1/2 -translate-y-1/2">
                  <div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
            {formData.type === 'pj' && <p class="mt-1 text-xs text-gray-500">Digite o CNPJ para preencher os dados automaticamente.</p>}
          </div>

          {/* Name */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {formData.type === 'pf' ? 'Nome Completo' : 'Razão Social'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder={formData.type === 'pf' ? 'Digite o nome completo' : 'Digite a razão social'}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="exemplo@email.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Endereço
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Rua, número, bairro, cidade, estado"
            />
          </div>
        </form>
      </Modal>

      <div class="flex-1 overflow-y-auto p-8">
        <div class="mb-6 flex items-center justify-between gap-4">
          <label class="relative flex min-w-80 max-w-sm flex-col">
            <div class="flex h-10 w-full flex-1 items-stretch rounded-lg">
              <span class="material-symbols-outlined text-[#666666] dark:text-gray-400 flex items-center justify-center rounded-l-lg border-y border-l border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 pl-3">search</span>
              <input class="form-input h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-gray-300 bg-white px-3 text-sm text-[#333333] placeholder:text-[#666666] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary" placeholder="Buscar por nome, email ou telefone..." />
            </div>
          </label>
          <div class="flex items-center gap-4">
            <button class="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[#333333] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <span class="material-symbols-outlined text-xl">filter_list</span>
              <span>Filtros</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18202F]">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead class="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" scope="col">Nome</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" scope="col">Contato</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" scope="col">Status</th>
                    <th class="relative px-6 py-3" scope="col"><span class="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                  {clients.map((client, index) => (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      class={`group cursor-pointer ${selectedClient?.id === client.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                      <td class="whitespace-nowrap px-6 py-4">
                        <div class="flex items-center">
                          <div class="size-10 shrink-0">
                            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{client.name}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{client.type === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</div>
                          </div>
                        </div>
                      </td>
                      <td class="whitespace-nowrap px-6 py-4">
                        <div class="text-sm text-gray-900 dark:text-white">{client.phone}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
                      </td>
                      <td class="whitespace-nowrap px-6 py-4">
                        <span class={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${client.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                          }`}>
                          {client.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(client);
                            }}
                            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Editar"
                          >
                            <span class="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(client.id);
                            }}
                            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Excluir"
                          >
                            <span class="material-symbols-outlined text-lg text-red-600 dark:text-red-400">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside class="flex w-full lg:max-w-[400px] shrink-0 flex-col rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#18202F]">
            {selectedClient ? (
              <>
                <div class="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
                  <div class="flex items-center gap-4">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-lg font-bold text-white">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 class="text-base font-semibold text-gray-900 dark:text-white">{selectedClient.name}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">ID #{selectedClient.id.substring(0, 8)}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(selectedClient)}
                      class="flex size-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <span class="material-symbols-outlined text-base">edit</span>
                    </button>
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto p-6">
                  <div class="space-y-6">
                    <div>
                      <h4 class="mb-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Informações de Contato</h4>
                      <div class="space-y-2 text-sm">
                        <div class="flex items-center gap-3">
                          <span class="material-symbols-outlined text-base text-gray-400">phone</span>
                          <span class="text-gray-700 dark:text-gray-300">{selectedClient.phone || 'N/A'}</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <span class="material-symbols-outlined text-base text-gray-400">mail</span>
                          <span class="text-gray-700 dark:text-gray-300">{selectedClient.email || 'N/A'}</span>
                        </div>
                        <div class="flex items-start gap-3">
                          <span class="material-symbols-outlined mt-0.5 text-base text-gray-400">location_on</span>
                          <span class="text-gray-700 dark:text-gray-300">{selectedClient.address || 'Endereço não informado'}</span>
                        </div>
                        <div class="flex items-start gap-3">
                          <span class="material-symbols-outlined mt-0.5 text-base text-gray-400">badge</span>
                          <span class="text-gray-700 dark:text-gray-300">{selectedClient.cpfCnpj || 'CPF/CNPJ não informado'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Service History - Dynamic if available, else generic placeholder message */}
                    <div>
                      <h4 class="mb-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Histórico de Serviços</h4>
                      {selectedClient.serviceHistory && selectedClient.serviceHistory.length > 0 ? (
                        <div class="flow-root">
                          <ul class="-mb-4">
                            {selectedClient.serviceHistory.map((service, idx) => (
                              <li key={idx}>
                                <div class="relative pb-4">
                                  {idx !== selectedClient.serviceHistory!.length - 1 && <span class="absolute left-2.5 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>}
                                  <div class="relative flex items-start space-x-3">
                                    <div class="relative px-1">
                                      <div class="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 ring-4 ring-white dark:ring-[#18202F]">
                                        <span class="material-symbols-outlined text-xs text-white">check</span>
                                      </div>
                                    </div>
                                    <div class="min-w-0 flex-1 py-0">
                                      <div class="text-sm text-gray-500 dark:text-gray-400">
                                        <span class="font-medium text-gray-900 dark:text-white">{service.description}</span>
                                        <div class="text-xs">{service.date}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p class="text-sm text-gray-500 italic">Nenhum serviço registrado.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div class="flex h-full flex-col items-center justify-center p-8 text-center text-gray-500">
                <span class="material-symbols-outlined mb-2 text-4xl opacity-50">person_off</span>
                <p>Nenhum cliente selecionado</p>
              </div>
            )}
          </aside>
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
    </div>
  );
};

export default Clients;
