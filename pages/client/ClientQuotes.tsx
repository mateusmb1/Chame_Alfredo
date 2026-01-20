import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Badge } from '../../downloader/components/Badge';
import { Modal } from '../../downloader/components/Modal';
import { SignaturePad } from '../../components/SignaturePad';
import { useToast } from '../../contexts/ToastContext';
import { FileText, CheckCircle, Download } from 'lucide-react';

export default function ClientQuotes() {
    const { quotes, clients, saveQuoteSignature } = useApp();
    const { showToast } = useToast();

    const currentClient = clients[0];
    const clientQuotes = quotes.filter(q => q.clientId === currentClient?.id);

    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'green';
            case 'sent': return 'blue';
            case 'draft': return 'gray';
            case 'rejected': return 'red';
            default: return 'gray';
        }
    };

    const handleApprove = (id: string) => {
        setSelectedQuoteId(id);
        setIsSignatureModalOpen(true);
    };

    const onSaveSignature = async (signatureData: string) => {
        if (selectedQuoteId) {
            try {
                await saveQuoteSignature(selectedQuoteId, signatureData);
                showToast('success', 'Orçamento aprovado com sucesso!');
                setIsSignatureModalOpen(false);
            } catch (error) {
                showToast('error', 'Erro ao salvar assinatura.');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Meus Orçamentos</h1>
                <p className="text-slate-500 mt-1">Revise e aprove as propostas enviadas pelo Alfredo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clientQuotes.map(quote => (
                    <div key={quote.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <FileText className="text-slate-500" />
                                </div>
                                <Badge color={getStatusColor(quote.status) as any}>
                                    {quote.status.toUpperCase()}
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Orçamento #{quote.id.substring(0, 8)}</h3>
                            <p className="text-sm text-slate-500 mb-4">Emitido em {new Date(quote.createdAt).toLocaleDateString()}</p>

                            <div className="space-y-2">
                                {quote.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-slate-600">{item.description} (x{item.quantity})</span>
                                        <span className="font-medium">R$ {item.totalPrice.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</p>
                                <p className="text-2xl font-black text-[#F97316]">R$ {quote.total.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                                    <Download size={20} />
                                </button>
                                {quote.status === 'sent' && (
                                    <button
                                        onClick={() => handleApprove(quote.id)}
                                        className="bg-[#F97316] text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Aprovar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                title="Assinar para Aprovação"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Ao assinar abaixo, você confirma a aprovação do orçamento e autoriza o início dos serviços descritos.
                    </p>
                    <SignaturePad
                        onSave={onSaveSignature}
                        onCancel={() => setIsSignatureModalOpen(false)}
                    />
                </div>
            </Modal>
        </div>
    );
}
