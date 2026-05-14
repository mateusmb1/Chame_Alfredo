import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import OrderItemSelector, { OrderLineItem } from '../OrderItemSelector';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Order } from '../../types/order';

interface ServiceOrderDrawerProps {
    open: boolean;
    orderId?: string;
    onClose: () => void;
}

const ServiceOrderDrawer: React.FC<ServiceOrderDrawerProps> = ({ open, orderId, onClose }) => {
    const { orders, clients, technicians, inventory, addOrder, updateOrder, addInventoryItem } = useApp();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        clientId: '',
        clientName: '',
        serviceType: '',
        technicianId: '',
        technicianName: '',
        description: '',
        priority: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
        observations: ''
    });

    const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (orderId && orderId !== 'new') {
            const order = orders.find(o => o.id === orderId);
            if (order) {
                setFormData({
                    clientId: order.clientId,
                    clientName: order.clientName,
                    serviceType: order.serviceType,
                    technicianId: order.technicianId,
                    technicianName: order.technicianName,
                    description: order.description,
                    priority: order.priority as any,
                    observations: order.observations || ''
                });
                setOrderItems(order.items?.map((item: any) => ({
                    id: item.id || `item-${Date.now()}`,
                    type: item.type || 'service',
                    name: item.name || item.description || '',
                    description: item.description,
                    quantity: item.quantity || 1,
                    unitPrice: item.unitPrice || 0,
                    total: item.total || (item.quantity * item.unitPrice) || 0,
                    sourceId: item.sourceId
                })) || []);
            }
        } else {
            setFormData({
                clientId: '', clientName: '', serviceType: '', technicianId: '',
                technicianName: '', description: '', priority: 'media', observations: ''
            });
            setOrderItems([]);
        }
    }, [orderId, orders, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const selectedClient = clients.find(c => c.id === formData.clientId);
            const selectedTech = technicians.find(t => t.id === formData.technicianId);
            const totalValue = orderItems.reduce((sum, item) => sum + item.total, 0);

            const orderData: any = {
                ...formData,
                clientName: selectedClient?.name || formData.clientName,
                technicianName: selectedTech?.name || formData.technicianName,
                value: totalValue,
                items: orderItems.map(item => ({
                    id: item.id, type: item.type, name: item.name, description: item.description,
                    quantity: item.quantity, unitPrice: item.unitPrice, total: item.total, sourceId: item.sourceId
                }))
            };

            if (orderId && orderId !== 'new') {
                await updateOrder(orderId, orderData);
                showToast('success', 'OS atualizada com sucesso.');
            } else {
                await addOrder(orderData);
                showToast('success', 'Nova ordem criada.');
            }
            onClose();
        } catch (err) {
            showToast('error', 'Erro ao processar OS.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-1">
                            {orderId && orderId !== 'new' ? 'Edição Operacional' : 'Lançamento Rápido'}
                        </span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight leading-none">
                            {orderId && orderId !== 'new' ? `OS #${orderId.substring(0, 8)}` : 'Nova Ordem de Serviço'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <form id="order-drawer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {/* Section 1: Core Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cliente</label>
                            <select
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                                required
                            >
                                <option value="">Selecionar Cliente</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Responsável</label>
                            <select
                                value={formData.technicianId}
                                onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                            >
                                <option value="">Delegar Técnico</option>
                                {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Serviço</label>
                            <select
                                value={formData.serviceType}
                                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                                required
                            >
                                <option value="">Tipo de Intervenção</option>
                                <option value="Manutenção Preventiva">Preventiva</option>
                                <option value="Instalação">Instalação</option>
                                <option value="Reparo">Reparo</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prioridade</label>
                            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                                {['baixa', 'media', 'alta', 'urgente'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p as any })}
                                        className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all
                        ${formData.priority === p ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                                    >
                                        {p === 'urgente' ? 'CRÍTICO' : p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white placeholder:text-slate-400"
                            placeholder="Detalhes técnicos da execução..."
                        />
                    </div>

                    {/* Items Selector */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-primary rounded-full" />
                            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider italic">Itens e Insumos</h3>
                        </div>
                        <OrderItemSelector
                            items={orderItems}
                            onItemsChange={setOrderItems}
                            inventory={inventory}
                            productsServices={[]}
                            onAddNewProduct={(p) => addInventoryItem(p)}
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>

                    <button
                        form="order-drawer-form"
                        type="submit"
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {isSaving ? (
                            <span className="animate-spin flex items-center justify-center"><AlertCircle size={14} /></span>
                        ) : (
                            <>
                                <ShieldCheck size={16} />
                                <span>Salvar Registro</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceOrderDrawer;
