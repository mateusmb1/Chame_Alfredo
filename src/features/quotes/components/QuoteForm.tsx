import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Quote, QuoteItem, CreateQuoteData, QuoteAttachment } from '../types/quote';
import { useToast } from '../contexts/ToastContext';
import {
    LayoutDashboard,
    Receipt,
    ClipboardList,
    Users,
    Package,
    Settings,
    HelpCircle,
    Plus,
    Trash2,
    PlusCircle,
    UploadCloud,
    X,
    FileText
} from 'lucide-react';
import OrderItemSelector, { OrderLineItem } from './OrderItemSelector';

interface QuoteFormProps {
    initialData?: Quote;
    isEditing?: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ initialData, isEditing = false }) => {
    const navigate = useNavigate();
    const location = useLocation(); // uses existing import if available or I need to add it
    const { clients, addQuote, updateQuote, uploadFile, inventory, products } = useApp();
    const { showToast } = useToast();

    // Pre-fill from navigation state (lead)
    const navState = location.state as { lead?: any } | null;
    const leadData = navState?.lead;

    const [clientId, setClientId] = useState(initialData?.clientId || '');
    const [validityDate, setValidityDate] = useState(
        initialData?.validityDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [issueDate, setIssueDate] = useState(
        initialData?.createdAt ? new Date(initialData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    );

    // Initial effect to handle lead data if present and matching client exists
    useEffect(() => {
        if (leadData && !initialData) {
            // Try to match client
            // If lead has client_id, use it. Else try name match.
            if (leadData.client_id) {
                setClientId(leadData.client_id);
            } else if (leadData.name) {
                const matched = clients.find(c => c.name.toLowerCase() === leadData.name.toLowerCase());
                if (matched) setClientId(matched.id);
            }

            // Pre-fill notes
            if (leadData.description) {
                setNotes(prev => leadData.description + (prev ? `\n\n${prev}` : ''));
            }
        }
    }, [leadData, initialData, clients]);

    // Convert initial QuoteItems to OrderLineItems for the selector
    const [items, setItems] = useState<OrderLineItem[]>(
        initialData?.items.map((i, idx) => ({
            id: i.id || `item-${idx}`,
            type: 'product', // Default to product if unknown, or infer logic if needed
            name: i.description,
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.quantity * i.unitPrice,
            sourceId: undefined // quote items might not have sourceId stored initially
        })) || []
    );

    const [paymentTerms, setPaymentTerms] = useState(initialData?.paymentTerms || 'Pagamento em até 30 dias após a emissão da fatura.');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [discount, setDiscount] = useState(initialData?.discount || 0);
    const [tax, setTax] = useState(initialData?.tax || 0);
    const [attachments, setAttachments] = useState<QuoteAttachment[]>(initialData?.attachments || []);
    const [isUploading, setIsUploading] = useState(false);

    // Derived state
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal - discount + (subtotal * (tax / 100));

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            try {
                const publicUrl = await uploadFile(file, 'quotes', `attachments/${Date.now()}_${file.name}`);
                if (publicUrl) {
                    setAttachments([
                        ...attachments,
                        {
                            name: file.name,
                            url: publicUrl,
                            size: file.size,
                            type: file.type
                        }
                    ]);
                    showToast('Arquivo anexado com sucesso!', 'success');
                } else {
                    showToast('Erro ao fazer upload do arquivo.', 'error');
                }
            } catch (error) {
                console.error('Upload error:', error);
                showToast('Erro ao fazer upload do arquivo.', 'error');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemoveAttachment = (index: number) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    };

    const handleSubmit = async (status: 'draft' | 'sent') => {
        if (!clientId) {
            showToast('Selecione um cliente.', 'error');
            return;
        }

        // Convert OrderLineItems back to QuoteItems
        const quoteItems: QuoteItem[] = items.map(i => ({
            id: i.id.startsWith('item-') ? undefined : i.id, // Remove temp IDs
            description: i.name, // or combine name + description
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.total
        }));

        const quoteData: any = {
            clientId,
            items: quoteItems,
            validityDate,
            paymentTerms,
            notes,
            discount,
            tax,
            attachments,
            status: isEditing ? initialData?.status : status,
            // For create
            ...(isEditing ? {} : { createdAt: new Date().toISOString() })
        };

        try {
            if (isEditing && initialData) {
                await updateQuote(initialData.id, quoteData);
                showToast('Orçamento atualizado com sucesso!', 'success');
            } else {
                await addQuote({
                    ...quoteData,
                    clientName: clients.find(c => c.id === clientId)?.name || 'Cliente Desconhecido',
                    subtotal,
                    total,
                    updatedAt: new Date().toISOString(),
                });
                showToast('Orçamento criado com sucesso!', 'success');
            }
            navigate('/quotes');
        } catch (error) {
            console.error('Save error:', error);
            showToast('Erro ao salvar orçamento.', 'error');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Section: Informações Gerais */}
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">Informações Gerais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="flex flex-col w-full">
                            <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">Cliente</p>
                            <div className="relative flex items-center">
                                <select
                                    className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-[#f6f6f8] dark:bg-[#101622] focus:border-primary h-12 placeholder:text-slate-400 px-3 text-base font-normal leading-normal"
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value)}
                                >
                                    <option value="">Buscar ou selecionar um cliente existente</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="absolute right-2 flex items-center justify-center size-8 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                    onClick={() => navigate('/clients/new')}
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className="flex flex-col w-full">
                            <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">ID do Orçamento</p>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-500 dark:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 h-12 placeholder:text-slate-400 px-3 text-base font-normal leading-normal cursor-not-allowed"
                                readOnly
                                value={initialData?.id || 'Gerado Automaticamente'}
                            />
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                            <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">Data de Emissão</p>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-[#f6f6f8] dark:bg-[#101622] focus:border-primary h-12 placeholder:text-slate-400 px-3 text-base font-normal leading-normal"
                                type="date"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col w-full">
                            <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">Data de Validade</p>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-[#f6f6f8] dark:bg-[#101622] focus:border-primary h-12 placeholder:text-slate-400 px-3 text-base font-normal leading-normal"
                                type="date"
                                value={validityDate}
                                onChange={(e) => setValidityDate(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Section: Itens do Orçamento */}
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <OrderItemSelector
                    items={items}
                    onItemsChange={setItems}
                    inventory={inventory}
                    productsServices={products}
                />
            </div>

            {/* Section: Totais e Condições */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">Condições e Detalhes</h2>
                    <div className="flex flex-col gap-6">
                        <label className="flex flex-col w-full">
                            <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">Condições de Pagamento</p>
                            <textarea
                                className="form-textarea w-full rounded-lg border-slate-300 dark:border-slate-700 bg-[#f6f6f8] dark:bg-[#101622] focus:ring-2 focus:ring-primary/50 focus:border-primary p-3 dark:text-white"
                                placeholder="Ex: 50% de entrada, 50% na conclusão."
                                rows={3}
                                value={paymentTerms}
                                onChange={(e) => setPaymentTerms(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col w-full">
                            <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">Observações</p>
                            <textarea
                                className="form-textarea w-full rounded-lg border-slate-300 dark:border-slate-700 bg-[#f6f6f8] dark:bg-[#101622] focus:ring-2 focus:ring-primary/50 focus:border-primary p-3 dark:text-white"
                                placeholder="Qualquer informação adicional..."
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                            <span className="text-slate-800 dark:text-slate-200 font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <label className="text-slate-500 dark:text-slate-400" htmlFor="desconto">Desconto (R$)</label>
                            <input
                                className="form-input w-32 rounded-lg border-slate-300 dark:border-slate-700 bg-[#f6f6f8] dark:bg-[#101622] h-10 text-right text-sm px-3 dark:text-white"
                                id="desconto"
                                placeholder="0.00"
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <label className="text-slate-500 dark:text-slate-400" htmlFor="impostos">Impostos (%)</label>
                            <input
                                className="form-input w-32 rounded-lg border-slate-300 dark:border-slate-700 bg-[#f6f6f8] dark:bg-[#101622] h-10 text-right text-sm px-3 dark:text-white"
                                id="impostos"
                                placeholder="0%"
                                type="number"
                                value={tax}
                                onChange={(e) => setTax(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-900 dark:text-white font-bold text-lg">Valor Total</span>
                            <span className="text-primary font-black text-2xl">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Anexos */}
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">Anexos</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500 dark:text-slate-400">
                                <UploadCloud className="w-10 h-10 mb-3" />
                                <p className="mb-2 text-sm">{isUploading ? 'Enviando...' : <><span className="font-semibold">Clique para enviar</span> ou arraste e solte</>}</p>
                                <p className="text-xs">PDF, PNG, JPG ou DOCX</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                    </div>
                    {attachments.length > 0 && (
                        <div className="space-y-2">
                            {attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{file.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                                        onClick={() => handleRemoveAttachment(index)}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate('/quotes')}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 text-slate-800 dark:text-slate-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <span className="truncate">Cancelar</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit('draft')}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 dark:hover:bg-slate-700"
                >
                    <span className="truncate">Salvar Rascunho</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit('sent')}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
                >
                    <span className="truncate">Salvar e Enviar</span>
                </button>
            </div>
        </div>
    );
};

export default QuoteForm;
