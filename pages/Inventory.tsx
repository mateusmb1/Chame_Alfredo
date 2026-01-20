import React, { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { InventoryItem } from '../types/inventory';
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    Package,
    AlertTriangle,
    DollarSign,
    ChevronRight,
    Archive,
    MapPin,
    TrendingDown,
    Layers,
    CheckCircle2,
    XCircle
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Inventory: React.FC = () => {
    const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useApp();
    const { showToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '', sku: '', quantity: '', location: '', minQuantity: '', unit: '', category: '', price: '', supplier: ''
    });

    const filteredItems = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(i => i.quantity > 0 && i.quantity <= i.minQuantity).length;
    const outOfStock = inventory.filter(i => i.quantity === 0).length;
    const totalValue = inventory.reduce((sum, i) => sum + (i.quantity * (i.price || 0)), 0);

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
            name: item.name, sku: item.sku, quantity: String(item.quantity), location: item.location,
            minQuantity: String(item.minQuantity), unit: item.unit || '', category: item.category || '',
            price: String(item.price || 0), supplier: item.supplier || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const itemData = {
            name: formData.name, sku: formData.sku, quantity: Number(formData.quantity),
            location: formData.location, minQuantity: Number(formData.minQuantity),
            unit: formData.unit || 'un', category: formData.category || 'geral',
            price: Number(formData.price) || 0, supplier: formData.supplier || '',
            lastRestockDate: new Date().toISOString().split('T')[0]
        };

        if (isEditMode && editingItemId) {
            updateInventoryItem(editingItemId, itemData);
            showToast('success', 'Item atualizado!');
        } else {
            addInventoryItem(itemData);
            showToast('success', 'Item adicionado!');
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = (itemId: string) => {
        setItemToDelete(itemId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            deleteInventoryItem(itemToDelete);
            showToast('success', 'Item excluído!');
        }
        setItemToDelete(null);
    };

    const getStockStatus = (item: InventoryItem) => {
        if (item.quantity === 0) return { label: 'Esgotado', color: 'text-red-600 bg-red-50 dark:bg-red-500/10', icon: XCircle };
        if (item.quantity <= item.minQuantity) return { label: 'Estoque Baixo', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10', icon: TrendingDown };
        return { label: 'Em Estoque', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10', icon: CheckCircle2 };
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0d121b] dark:text-white tracking-tight">Inventário</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Controle de peças, ferramentas e equipamentos.</p>
                </div>
                <button
                    onClick={handleOpenNewItemModal}
                    className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Novo Item</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Itens', value: totalItems, icon: Package, color: 'text-blue-600', bg: 'bg-blue-500/10' },
                    { label: 'Estoque Baixo', value: lowStockItems, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-500/10' },
                    { label: 'Esgotados', value: outOfStock, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
                    { label: 'Valor Total', value: formatCurrency(totalValue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#101622] p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider leading-none mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-[#0d121b] dark:text-white leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Tabs Overlay */}
            <div className="bg-white dark:bg-[#101622] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        placeholder="Buscar por nome ou SKU..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                </button>
            </div>

            {/* Grid of Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {paginatedItems.length === 0 ? (
                    <div className="col-span-full py-20 bg-white dark:bg-[#101622] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400">
                        <Archive className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium text-sm text-gray-500">Nenhum item encontrado</p>
                    </div>
                ) : (
                    paginatedItems.map(item => {
                        const status = getStockStatus(item);
                        return (
                            <div
                                key={item.id}
                                className="group bg-white dark:bg-[#101622] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${status.color}`}>
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEditModal(item)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-xl transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h3 className="font-bold text-[#0d121b] dark:text-white leading-tight truncate">{item.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sku}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-800" />
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.category}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1">Quantidade</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-black text-[#0d121b] dark:text-white">{item.quantity}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{item.unit || 'un'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1">Preço Un.</span>
                                        <p className="text-sm font-bold text-emerald-600">{formatCurrency(item.price || 0)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-500">{item.location || 'Sem local'}</span>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.color} border-transparent`}>
                                        {status.label}
                                    </span>
                                </div>

                                {/* Min Quantity Indicator */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
                                    <div
                                        className={`h-full transition-all duration-500 ${item.quantity <= item.minQuantity ? 'bg-amber-500' : 'bg-primary'}`}
                                        style={{ width: `${Math.min(100, (item.quantity / (item.minQuantity * 2 || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-2xl font-bold text-sm transition-all
                 ${currentPage === page
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white dark:bg-[#101622] text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-gray-800'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Item"
                message="Deseja realmente excluir este item do inventário? Esta ação é irreversível."
                confirmText="Sim, Excluir"
                cancelText="Manter Item"
                type="danger"
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? 'Editar Item' : 'Novo Item'}
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
                            <Layers className="w-4 h-4" />
                            <span>{isEditMode ? 'Salvar Alterações' : 'Adicionar Item'}</span>
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome do Produto</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                            placeholder="Ex: Câmera Intelbras"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">SKU / Código</label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                                placeholder="PROD-001"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Quantidade</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Localização</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                                placeholder="Ex: Prateleira A1"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Estoque Mínimo</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.minQuantity}
                                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Unidade</label>
                            <input
                                type="text"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                                placeholder="un, kg, m"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Preço</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
                            />
                        </div>
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

export default Inventory;