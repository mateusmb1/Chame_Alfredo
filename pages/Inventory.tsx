import React, { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { InventoryItem } from '../types/inventory';

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
        sku: '',
        quantity: '',
        location: '',
        minQuantity: '',
        unit: '',
        category: '',
        price: '',
        supplier: ''
    });

    const handleOpenNewItemModal = () => {
        setIsEditMode(false);
        setEditingItemId(null);
        setFormData({ name: '', sku: '', quantity: '', location: '', minQuantity: '', unit: '', category: '', price: '', supplier: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: InventoryItem) => {
        setIsEditMode(true);
        setEditingItemId(item.id);
        setFormData({
            name: item.name,
            sku: item.sku,
            quantity: String(item.quantity),
            location: item.location,
            minQuantity: String(item.minQuantity),
            unit: item.unit || '',
            category: item.category || '',
            price: String(item.price || 0),
            supplier: item.supplier || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const itemData = {
            name: formData.name,
            sku: formData.sku,
            quantity: Number(formData.quantity),
            location: formData.location,
            minQuantity: Number(formData.minQuantity),
            unit: formData.unit || 'un',
            category: formData.category || 'geral',
            price: Number(formData.price) || 0,
            supplier: formData.supplier || '',
            lastRestockDate: new Date().toISOString().split('T')[0]
        };

        if (isEditMode && editingItemId) {
            updateInventoryItem(editingItemId, itemData);
            showToast('success', 'Item atualizado com sucesso!');
        } else {
            addInventoryItem(itemData);
            showToast('success', 'Item adicionado ao estoque com sucesso!');
        }

        setIsModalOpen(false);
        setFormData({ name: '', sku: '', quantity: '', location: '', minQuantity: '', unit: '', category: '', price: '', supplier: '' });
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

    // Helper to calculate stock status based on quantity and minQuantity
    const getStockStatus = (item: InventoryItem) => {
        if (item.quantity === 0) return 'esgotado';
        if (item.quantity <= item.minQuantity) return 'estoque_baixo';
        return 'em_estoque';
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
        <div className="flex h-full flex-col">
            <header className="p-6 pb-0">
                <h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Gerenciamento de Inventário</h1>
            </header>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative w-full sm:max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input className="w-full h-10 pl-10 pr-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" placeholder="Buscar por nome ou SKU..." />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</span>
                            <span className="material-symbols-outlined text-gray-500 text-base">filter_list</span>
                        </button>
                        <button
                            onClick={handleOpenNewItemModal}
                            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-white hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            <span className="text-sm font-bold">Adicionar Item</span>
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
                                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined text-lg">save</span>
                                <span>{isEditMode ? 'Atualizar' : 'Adicionar'} Item</span>
                            </button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Item</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Ex: Filtro de Óleo"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">SKU / Código</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ex: FO-12345"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade {isEditMode ? 'Atual' : 'Inicial'}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Localização</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ex: Armazém A, P-01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Estoque Mínimo</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.minQuantity}
                                    onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Unidade</label>
                                <input
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ex: un, kg, m"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ex: Peças, Material"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Preço Unitário</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Fornecedor</label>
                            <input
                                type="text"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Nome do fornecedor"
                            />
                        </div>
                    </form>
                </Modal>

                {/* Empty State */}
                {inventory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <span className="text-6xl mb-4">📦</span>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhum item no estoque</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Comece adicionando seu primeiro item ao inventário.</p>
                        <button
                            onClick={handleOpenNewItemModal}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Adicionar Item
                        </button>
                    </div>
                ) : (
                    <div className="overflow-visible rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-[#18202F]">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">SKU</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Qtd. Estoque</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Localização</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Preço</th>
                                        <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {inventory.map(item => {
                                        const status = getStockStatus(item);
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.sku}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}>
                                                        {getStatusLabel(status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.quantity} {item.unit || 'Un.'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.location}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price || 0)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenEditModal(item)}
                                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(item.id)}
                                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <span className="material-symbols-outlined text-lg text-red-600 dark:text-red-400">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
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