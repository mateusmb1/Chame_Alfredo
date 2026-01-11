import React, { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp, InventoryItem } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

const Inventory: React.FC = () => {
    const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useApp();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        quantity: '',
        location: '',
        minStock: ''
    });

    const handleOpenNewItemModal = () => {
        setIsEditMode(false);
        setEditingItemId(null);
        setFormData({ name: '', code: '', quantity: '', location: '', minStock: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: InventoryItem) => {
        setIsEditMode(true);
        setEditingItemId(item.id);
        setFormData({
            name: item.name,
            code: item.code,
            quantity: String(item.quantity),
            location: item.location,
            minStock: String(item.minStock)
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && editingItemId) {
            updateInventoryItem(editingItemId, formData);
            showToast('success', 'Item atualizado com sucesso!');
        } else {
            addInventoryItem(formData);
            showToast('success', 'Item adicionado ao estoque com sucesso!');
        }

        setIsModalOpen(false);
        setFormData({ name: '', code: '', quantity: '', location: '', minStock: '' });
    };

    const handleDeleteClick = (itemId: string) => {
        setItemToDelete(itemId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            deleteInventoryItem(itemToDelete);
            showToast('success', 'Item excluído do estoque com sucesso!');
        }
        setItemToDelete(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'em_estoque': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'estoque_baixo': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'esgotado': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'em_estoque': return 'Em Estoque';
            case 'estoque_baixo': return 'Estoque Baixo';
            case 'esgotado': return 'Esgotado';
            default: return status;
        }
    };

    return (
        <div class="flex h-full flex-col">
            <header class="p-6 pb-0">
                <h1 class="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Gerenciamento de Inventário</h1>
            </header>
            <div class="p-6">
                <div class="flex flex-col sm:flex-row gap-4 mb-6">
                    <div class="flex-1">
                        <div class="relative w-full sm:max-w-md">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input class="w-full h-10 pl-10 pr-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" placeholder="Buscar por nome ou código..." />
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="flex h-10 items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</span>
                            <span class="material-symbols-outlined text-gray-500 text-base">filter_list</span>
                        </button>
                        <button
                            onClick={handleOpenNewItemModal}
                            class="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-white hover:bg-primary/90 transition-colors"
                        >
                            <span class="material-symbols-outlined text-lg">add_circle</span>
                            <span class="text-sm font-bold">Adicionar Item</span>
                        </button>
                    </div>
                </div>

                {/* New/Edit Inventory Item Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={isEditMode ? 'Editar Item do Estoque' : 'Adicionar Novo Item ao Estoque'}
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
                                <span>{isEditMode ? 'Atualizar' : 'Adicionar'} Item</span>
                            </button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} class="space-y-4">
                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Item</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Ex: Filtro de Óleo"
                                required
                            />
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Código do Item</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ex: FO-12345"
                                    required
                                />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade {isEditMode ? 'Atual' : 'Inicial'}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Localização</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ex: Armazém A, P-01"
                                    required
                                />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Estoque Mínimo</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.minStock}
                                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                    class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </Modal>

                <div class="overflow-visible rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-[#18202F]">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead class="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nome</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Código</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Qtd. Estoque</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Localização</th>
                                    <th class="relative px-6 py-3"><span class="sr-only">Ações</span></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                                {inventory.map(item => (
                                    <tr key={item.id} class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.code}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.quantity} Un.</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.location}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div class="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(item)}
                                                    class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar"
                                                >
                                                    <span class="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item.id)}
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
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Item do Estoque"
                message="Tem certeza que deseja excluir este item do estoque? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
};

export default Inventory;