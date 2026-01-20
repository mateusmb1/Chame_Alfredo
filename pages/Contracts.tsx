import React, { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../contexts/AppContext';
import { Contract } from '../types/contract';
import { useToast } from '../contexts/ToastContext';

const Contracts: React.FC = () => {
    const { contracts, clients, addContract, updateContract, deleteContract } = useApp();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingContractId, setEditingContractId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<string | null>(null);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(contracts[0] || null);

    const [formData, setFormData] = useState({
        clientId: '',
        contractType: 'manutencao' as 'manutencao' | 'instalacao' | 'consultoria' | 'suporte' | 'outro',
        description: '',
        value: '',
        billingFrequency: 'mensal' as 'mensal' | 'trimestral' | 'semestral' | 'anual',
        startDate: '',
        endDate: '',
        status: 'ativo' as 'ativo' | 'suspenso' | 'cancelado' | 'expirado',
        autoRenewal: true,
        paymentDay: '10',
        notes: ''
    });

    const handleOpenNewContractModal = () => {
        setIsEditMode(false);
        setEditingContractId(null);
        setFormData({
            clientId: '',
            contractType: 'manutencao',
            description: '',
            value: '',
            periodicity: 'mensal',
            startDate: '',
            endDate: '',
            status: 'ativo',
            autoRenewal: true,
            paymentDay: '10',
            notes: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (contract: Contract) => {
        setIsEditMode(true);
        setEditingContractId(contract.id);
        setFormData({
            clientId: contract.clientId,
            contractType: contract.contractType,
            description: contract.description,
            value: String(contract.value),
            billingFrequency: contract.periodicity || contract.billingFrequency,
            startDate: contract.startDate,
            endDate: contract.endDate,
            status: contract.status,
            autoRenewal: contract.autoRenewal,
            paymentDay: String(contract.paymentDay),
            notes: contract.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedClient = clients.find(c => c.id === formData.clientId);
        if (!selectedClient) {
            showToast('error', 'Cliente não encontrado!');
            return;
        }

        const contractData = {
            ...formData,
            clientName: selectedClient.name,
            clientType: selectedClient.type,
            value: Number(formData.value),
            paymentDay: Number(formData.paymentDay)
        };

        if (isEditMode && editingContractId) {
            updateContract(editingContractId, contractData);
            showToast('success', 'Contrato atualizado com sucesso!');
        } else {
            addContract(contractData);
            showToast('success', 'Contrato criado com sucesso!');
        }

        setIsModalOpen(false);
    };

    const handleDeleteClick = (contractId: string) => {
        setContractToDelete(contractId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (contractToDelete) {
            deleteContract(contractToDelete);
            showToast('success', 'Contrato excluído com sucesso!');
            if (selectedContract?.id === contractToDelete) {
                setSelectedContract(contracts[0] || null);
            }
        }
        setContractToDelete(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ativo': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'suspenso': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'cancelado': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'expirado': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ativo': return 'Ativo';
            case 'suspenso': return 'Suspenso';
            case 'cancelado': return 'Cancelado';
            case 'expirado': return 'Expirado';
            default: return status;
        }
    };

    const getContractTypeLabel = (type: string) => {
        switch (type) {
            case 'manutencao': return 'Manutenção';
            case 'instalacao': return 'Instalação';
            case 'consultoria': return 'Consultoria';
            case 'suporte': return 'Suporte';
            case 'outro': return 'Outro';
            default: return type;
        }
    };

    const getPeriodicityLabel = (billingFrequency: string) => {
        switch (billingFrequency) {
            case 'mensal': return 'Mensal';
            case 'trimestral': return 'Trimestral';
            case 'semestral': return 'Semestral';
            case 'anual': return 'Anual';
            default: return billingFrequency;
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    return (
        <div class="flex h-full flex-col bg-gray-50 dark:bg-[#0D1117]">
            {/* Header */}
            <div class="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-[#18202F]">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gerenciamento de Contratos</h1>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Gerencie contratos de manutenção e serviços para condomínios e clientes
                        </p>
                    </div>
                    <button
                        onClick={handleOpenNewContractModal}
                        class="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-white hover:bg-primary/90 transition-colors"
                    >
                        <span class="material-symbols-outlined text-lg">add</span>
                        <span class="text-sm font-bold">Novo Contrato</span>
                    </button>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? 'Editar Contrato' : 'Novo Contrato'}
                size="lg"
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
                            <span>{isEditMode ? 'Atualizar' : 'Criar'} Contrato</span>
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} class="space-y-4">
                    {/* Cliente */}
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Cliente *</label>
                        <select
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            required
                        >
                            <option value="">Selecione um cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name} ({client.type === 'pf' ? 'Pessoa Física' : 'Condomínio/Empresa'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo e Periodicidade */}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Contrato *</label>
                            <select
                                value={formData.contractType}
                                onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
                                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                required
                            >
                                <option value="manutencao">Manutenção</option>
                                <option value="instalacao">Instalação</option>
                                <option value="consultoria">Consultoria</option>
                                <option value="suporte">Suporte</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Periodicidade *</label>
                            <select
                                value={formData.billingFrequency}
                                onChange={(e) => setFormData({ ...formData, billingFrequency: e.target.value as any })}
                                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                required
                            >
                                <option value="mensal">Mensal</option>
                                <option value="trimestral">Trimestral</option>
                                <option value="semestral">Semestral</option>
                                <option value="anual">Anual</option>
                            </select>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição do Contrato *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder="Descreva os serviços incluídos no contrato..."
                            required
                        />
                    </div>

                    {/* Valor e Dia de Pagamento */}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Valor (R$) *</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Dia de Pagamento *</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                value={formData.paymentDay}
                                onChange={(e) => setFormData({ ...formData, paymentDay: e.target.value })}
                                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Datas */}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Início *</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Término *</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Status e Renovação Automática */}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="ativo">Ativo</option>
                                <option value="suspenso">Suspenso</option>
                                <option value="cancelado">Cancelado</option>
                                <option value="expirado">Expirado</option>
                            </select>
                        </div>

                        <div class="flex items-center pt-8">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.autoRenewal}
                                    onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
                                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span class="text-sm text-gray-700 dark:text-gray-300">Renovação Automática</span>
                            </label>
                        </div>
                    </div>

                    {/* Observações */}
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={2}
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder="Informações adicionais sobre o contrato..."
                        />
                    </div>
                </form>
            </Modal>

            {/* Content */}
            <div class="flex flex-1 overflow-hidden">
                {/* Contracts List */}
                <div class="w-full lg:w-2/5 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#18202F]">
                    <div class="p-4">
                        <div class="relative mb-4">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                class="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                placeholder="Buscar contrato..."
                            />
                        </div>

                        <div class="space-y-2">
                            {contracts.map(contract => (
                                <div
                                    key={contract.id}
                                    onClick={() => setSelectedContract(contract)}
                                    class={`p-4 rounded-lg border cursor-pointer transition-all ${selectedContract?.id === contract.id
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                                        }`}
                                >
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="flex-1">
                                            <h3 class="font-semibold text-gray-900 dark:text-white">{contract.contractNumber}</h3>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">{contract.clientName}</p>
                                        </div>
                                        <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(contract.status)}`}>
                                            {getStatusLabel(contract.status)}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">{getContractTypeLabel(contract.contractType)}</span>
                                        <span class="font-semibold text-primary">{formatCurrency(contract.value)}/{getPeriodicityLabel(contract.billingFrequency || contract.periodicity)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contract Details */}
                {selectedContract && (
                    <div class="flex-1 overflow-y-auto bg-white dark:bg-[#18202F] p-6">
                        <div class="max-w-3xl mx-auto">
                            {/* Header */}
                            <div class="flex items-start justify-between mb-6">
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedContract.contractNumber}</h2>
                                    <p class="text-gray-600 dark:text-gray-400">{selectedContract.clientName}</p>
                                </div>
                                <div class="flex gap-2">
                                    <button
                                        onClick={() => handleOpenEditModal(selectedContract)}
                                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Editar"
                                    >
                                        <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(selectedContract.id)}
                                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Excluir"
                                    >
                                        <span class="material-symbols-outlined text-red-600 dark:text-red-400">delete</span>
                                    </button>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div class="space-y-4">
                                    <div>
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de Contrato</label>
                                        <p class="text-base font-semibold text-gray-900 dark:text-white">{getContractTypeLabel(selectedContract.contractType)}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Valor</label>
                                        <p class="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedContract.value)}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Periodicidade</label>
                                        <p class="text-base font-semibold text-gray-900 dark:text-white">{getPeriodicityLabel(selectedContract.billingFrequency || selectedContract.periodicity)}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Dia de Pagamento</label>
                                        <p class="text-base font-semibold text-gray-900 dark:text-white">Dia {selectedContract.paymentDay}</p>
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <div>
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Início</label>
                                        <p class="text-base font-semibold text-gray-900 dark:text-white">{formatDate(selectedContract.startDate)}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Término</label>
                                        <p class="text-base font-semibold text-gray-900 dark:text-white">{formatDate(selectedContract.endDate)}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                        <p>
                                            <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(selectedContract.status)}`}>
                                                {getStatusLabel(selectedContract.status)}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Renovação Automática</label>
                                        <p class="text-base font-semibold text-gray-900 dark:text-white">{selectedContract.autoRenewal ? 'Sim' : 'Não'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div class="mb-6">
                                <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Descrição</label>
                                <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <p class="text-gray-900 dark:text-white">{selectedContract.description}</p>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedContract.notes && (
                                <div>
                                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Observações</label>
                                    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <p class="text-gray-900 dark:text-white">{selectedContract.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Contrato"
                message="Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
};

export default Contracts;
