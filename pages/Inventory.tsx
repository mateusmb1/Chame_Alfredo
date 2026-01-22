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
    Layers,
    CheckCircle2,
    XCircle,
    HardDrive,
    Zap,
    TrendingUp,
    Shield
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
            showToast('success', 'Hardware catalogado e atualizado.');
        } else {
            addInventoryItem(itemData);
            showToast('success', 'Novo ativo incorporado ao patrimônio.');
        }
        setIsModalOpen(false);
    };

    const getStockStatus = (item: InventoryItem) => {
        if (item.quantity === 0) return { label: 'Liquidado', color: 'text-red-500 bg-red-500/10', icon: XCircle };
        if (item.quantity <= item.minQuantity) return { label: 'Estoque Mínimo', color: 'text-[#F97316] bg-[#F97316]/10', icon: AlertTriangle };
        return { label: 'Disponível', color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle2 };
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            deleteInventoryItem(itemToDelete);
            showToast('success', 'Hardware purgado do sistema.');
        }
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

    return (
        <div className="max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Premium Header Container */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-gray-800/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                        <p className="text-primary text-xs font-black uppercase tracking-[0.3em] leading-none">Gestão de Ativos</p>
                    </div>
                    <h1 className="text-5xl font-black text-[#1e293b] dark:text-white tracking-tighter leading-none mb-3 italic">
                        Patrimônio<span className="text-primary">.</span>
                    </h1>
                    <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest opacity-80">
                        Controle total de peças, sistemas e hardware operacional.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="h-16 px-6 bg-white dark:bg-[#101622] text-[#1e293b] dark:text-white rounded-2xl border border-gray-100 dark:border-gray-800 font-black uppercase tracking-widest text-[9px] hover:bg-gray-50 transition-all shadow-sm">
                        <Archive className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleOpenNewItemModal}
                        className="h-16 px-10 bg-[#1e293b] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 hover:bg-primary transition-all shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Novo Ativo</span>
                    </button>
                </div>
            </div>

            {/* Tactical Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Custódia Total', value: totalItems, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Alerta Crítico', value: lowStockItems, icon: AlertTriangle, color: 'text-[#F97316]', bg: 'bg-[#F97316]/10' },
                    { label: 'Base Liquidada', value: outOfStock, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
                    { label: 'Avaliação Patrimonial', value: formatCurrency(totalValue), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#101622] p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/50 shadow-sm group hover:border-primary/20 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                            <stat.icon className="w-20 h-20 rotate-12" />
                        </div>
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] leading-none mb-1">{stat.label}</p>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-[#1e293b] dark:text-white leading-none tracking-tighter relative z-10">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Global Search & Filters */}
            <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                <div className="flex-1 bg-white dark:bg-[#101622] rounded-[2.5rem] p-4 shadow-sm border border-gray-100 dark:border-gray-800/50 flex items-center gap-4 group">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="PESQUISAR HARDWARE POR NOME OU SKU..."
                            className="w-full pl-14 pr-6 py-4 bg-gray-50/50 dark:bg-white/5 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 dark:text-white"
                        />
                    </div>
                    <button className="h-14 w-14 flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 rounded-2xl hover:text-primary transition-all">
                        <Filter className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Inventory Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">
                {paginatedItems.length === 0 ? (
                    <div className="col-span-full py-32 bg-white dark:bg-[#101622] rounded-[3rem] border-4 border-dashed border-gray-50 dark:border-gray-800 flex flex-col items-center justify-center text-gray-200">
                        <HardDrive className="w-20 h-20 mb-6 opacity-40" />
                        <p className="font-black text-xs uppercase tracking-[0.3em]">Patrimônio em Branco</p>
                    </div>
                ) : (
                    paginatedItems.map(item => {
                        const status = getStockStatus(item);
                        return (
                            <div
                                key={item.id}
                                className="group relative bg-white dark:bg-[#101622] rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`p-4 rounded-2xl ${status.color} shadow-inner`}>
                                        <Package className="w-7 h-7" />
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEditModal(item)} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all shadow-sm">
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => { setItemToDelete(item.id); setIsDeleteDialogOpen(true); }} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">SKU: {item.sku}</span>
                                        <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">{item.category}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-[#1e293b] dark:text-white leading-tight tracking-tighter italic uppercase group-hover:text-primary transition-colors truncate">{item.name}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 mb-8 items-center text-center">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block mb-1">Custódia</span>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-2xl font-black text-[#1e293b] dark:text-white leading-none italic">{item.quantity}</span>
                                            <span className="text-[10px] font-black text-gray-300 uppercase">{item.unit || 'un'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 border-l border-gray-100 dark:border-gray-800">
                                        <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block mb-1">Custo Un.</span>
                                        <p className="text-sm font-black text-emerald-600 leading-none">{formatCurrency(item.price || 0)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-300" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.location || 'Local Não Definido'}</span>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                {/* Smart Progress Bar for Stock */}
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-50 dark:bg-gray-900">
                                    <div
                                        className={`h-full transition-all duration-700 ${item.quantity <= item.minQuantity ? 'bg-[#F97316]' : 'bg-primary'}`}
                                        style={{ width: `${Math.min(100, (item.quantity / (item.minQuantity * 3 || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Tactical Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-14 h-14 rounded-2xl font-black text-xs transition-all
                            ${currentPage === page
                                    ? 'bg-[#1e293b] text-white shadow-2xl'
                                    : 'bg-white dark:bg-[#101622] text-gray-400 hover:border-primary/50 border border-gray-100 dark:border-gray-800'}`}
                        >
                            {page < 10 ? `0${page}` : page}
                        </button>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="REMOVER ATIVO"
                message="Esta ação irá purgar o item permanentemente da base patrimonial. Deseja prosseguir?"
                confirmText="Confirmar Purgue"
                cancelText="Arquivar Registro"
                type="danger"
            />

            {/* Premium Modular Asset Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? 'ATUALIZAÇÃO DE ATIVO : HARDWARE' : 'INCORPORAÇÃO DE NOVO ITEM'}
                size="md"
                footer={
                    <div className="flex items-center justify-end gap-3 w-full px-10 pb-8">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                        >
                            Abortar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-10 py-4 bg-[#1e293b] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-primary transition-all active:scale-95 flex items-center gap-3"
                        >
                            <Shield className="w-5 h-5" />
                            <span>Validar Ativo</span>
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-8 p-10 max-h-[70vh] overflow-y-auto no-scrollbar">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Nomenclatura Técnica</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black focus:ring-8 focus:ring-primary/5 dark:text-white px-6 transition-all uppercase"
                            placeholder="EX: CÂMERA IP DOMO 4K"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">SKU / Identificador</label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black focus:ring-8 focus:ring-primary/5 dark:text-white px-6 transition-all"
                                placeholder="ALF-001"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Carga Inicial</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black focus:ring-8 focus:ring-primary/5 dark:text-white px-6 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Mapeamento de Local</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black focus:ring-8 focus:ring-primary/5 dark:text-white px-6 transition-all uppercase"
                                placeholder="EX: ALMOXARIFADO CENTRAL"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Estoque Crítico</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.minQuantity}
                                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black focus:ring-8 focus:ring-primary/5 dark:text-white px-6 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Unidade</label>
                            <input
                                type="text"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black focus:ring-8 focus:ring-primary/5 dark:text-white px-6 transition-all uppercase"
                                placeholder="UN/KG/M"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Categoria</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black focus:ring-8 focus:ring-primary/5 dark:text-white px-6 transition-all uppercase"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Custo Base</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black focus:ring-8 focus:ring-primary/5 dark:text-white px-6 transition-all"
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