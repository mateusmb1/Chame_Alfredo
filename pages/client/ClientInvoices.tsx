import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Receipt, Calendar, CreditCard, ExternalLink, QrCode } from 'lucide-react';
import { Badge } from '../../downloader/components/Badge';

export default function ClientInvoices() {
    const { invoices, clients } = useApp();
    const currentClient = clients[0];
    const clientInvoices = invoices.filter(i => i.clientId === currentClient?.id);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'green';
            case 'pending': return 'red';
            case 'overdue': return 'red';
            default: return 'gray';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Minhas Faturas</h1>
                <p className="text-slate-500 mt-1">Gerencie seus pagamentos e consulte o histórico de faturamento.</p>
            </div>

            <div className="space-y-6">
                {clientInvoices.map(invoice => (
                    <div key={invoice.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white rounded-2xl shadow-sm">
                                    <Receipt className="text-primary" size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-slate-900">Fatura #{invoice.invoiceNumber || invoice.id.substring(0, 8)}</h3>
                                        <Badge color={getStatusColor(invoice.status) as any}>{invoice.status === 'paid' ? 'PAGA' : 'PENDENTE'}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> Vencimento: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Valor Total</p>
                                <p className="text-3xl font-black text-slate-900">R$ {invoice.total.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                        Itens Detalhados
                                    </h4>
                                    <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-100 text-slate-600 font-bold">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">Descrição</th>
                                                    <th className="px-4 py-3 text-center">Qtd.</th>
                                                    <th className="px-4 py-3 text-right">Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {invoice.items?.map((item: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3 text-slate-700">{item.description}</td>
                                                        <td className="px-4 py-3 text-center text-slate-500 font-medium">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-right text-slate-900 font-bold">R$ {item.totalPrice.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {invoice.status === 'pending' && (
                                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
                                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                            <CreditCard className="text-primary" size={20} />
                                            Pagar agora
                                        </h4>
                                        <div className="p-4 bg-white rounded-xl flex items-center justify-center border border-primary/10 shadow-sm">
                                            <div className="text-center space-y-2">
                                                <QrCode className="mx-auto text-slate-800" size={120} />
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">QRCode PIX</p>
                                            </div>
                                        </div>
                                        <button className="w-full bg-[#1e293b] text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md">
                                            Copiar código PIX
                                        </button>
                                        <button className="w-full bg-white text-slate-800 border border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                            <ExternalLink size={18} /> Ver Boleto
                                        </button>
                                    </div>
                                )}
                                {invoice.status === 'paid' && (
                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                            <ExternalLink size={24} />
                                        </div>
                                        <h4 className="font-bold text-green-900">Fatura Paga!</h4>
                                        <p className="text-sm text-green-700">Obrigado! O pagamento desta fatura foi confirmado em {new Date(invoice.paidDate || invoice.issueDate).toLocaleDateString()}.</p>
                                        <button className="text-green-700 underline text-sm font-bold">Baixar Comprovante</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {clientInvoices.length === 0 && (
                    <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-slate-300">
                        <Receipt size={64} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-medium">Você ainda não possui faturas geradas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
