import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

const QuoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    // In a real app, useApp() would provide quotes. For now, we'll mock or try to find if available.
    const { quotes } = useApp();

    // Mock data for demo purposes if not found in context
    const [quote, setQuote] = useState<any>(null);

    useEffect(() => {
        // Try to find in context first
        const found = quotes.find(q => q.id === id);

        if (found) {
            setQuote(found);
        } else {
            // Mock data matching the table in Quotes.tsx
            const mocks: Record<string, any> = {
                'QT-2024-001': {
                    id: 'QT-2024-001',
                    clientName: 'Inovatech Soluções',
                    createdAt: '2024-07-15',
                    validityDate: '2024-07-30',
                    status: 'approved',
                    total: 1500.00,
                    subtotal: 1425.00,
                    tax: 75.00,
                    notes: 'Pagamento 50% na aprovação.',
                    items: [
                        { description: 'Consultoria Técnica', quantity: 10, unitPrice: 150.00, total: 1500.00 }
                    ]
                },
                'QT-2024-002': {
                    id: 'QT-2024-002',
                    clientName: 'Construtora Alfa',
                    createdAt: '2024-07-14',
                    validityDate: '2024-08-14',
                    status: 'sent',
                    total: 8750.00,
                    subtotal: 8500.00,
                    tax: 250.00,
                    items: [
                        { description: 'Aluguel de Equipamentos', quantity: 1, unitPrice: 5000.00, total: 5000.00 },
                        { description: 'Mão de Obra Especializada', quantity: 5, unitPrice: 700.00, total: 3500.00 }
                    ]
                },
                // Fallback for others
                'default': {
                    id: id || 'QT-NEW',
                    clientName: 'Cliente Exemplo',
                    createdAt: new Date().toISOString().split('T')[0],
                    status: 'draft',
                    total: 0,
                    items: []
                }
            };

            setQuote(mocks[id as string] || mocks['default']);
        }
    }, [id, quotes]);

    if (!quote) return <div className="p-8">Carregando...</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            approved: 'Aprovado',
            sent: 'Enviado',
            rejected: 'Rejeitado',
            draft: 'Rascunho',
            expired: 'Expirado'
        };
        return labels[status] || status;
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="flex flex-1 flex-col p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">Orçamento #{quote.id}</h1>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(quote.status)}`}>
                                {getStatusLabel(quote.status)}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Detalhes do orçamento emitido.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/quotes')}
                            className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
                            <span className="truncate">Voltar</span>
                        </button>
                        <button
                            onClick={() => showToast('info', 'Funcionalidade de edição em breve.')}
                            className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">edit</span>
                            <span className="truncate">Editar</span>
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 gap-2"
                        >
                            <span className="material-symbols-outlined text-base">print</span>
                            <span>Imprimir</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="p-6 space-y-8">
                        {/* Info */}
                        <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informações Gerais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cliente</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{quote.clientName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Data de Criação</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{new Date(quote.createdAt).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Validade</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{quote.validityDate ? new Date(quote.validityDate).toLocaleDateString('pt-BR') : '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Itens do Orçamento</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            <th className="p-3 font-medium">Descrição</th>
                                            <th className="p-3 font-medium text-right">Qtd</th>
                                            <th className="p-3 font-medium text-right">Valor Unit.</th>
                                            <th className="p-3 font-medium text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-900 dark:text-white divide-y divide-gray-200 dark:divide-gray-800">
                                        {quote.items?.map((item: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="p-3">{item.description}</td>
                                                <td className="p-3 text-right">{item.quantity}</td>
                                                <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                                                <td className="p-3 text-right">{formatCurrency(item.total || item.totalPrice || (item.quantity * item.unitPrice))}</td>
                                            </tr>
                                        ))}
                                        {(!quote.items || quote.items.length === 0) && (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-gray-500">Nenhum item adicionado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="flex flex-col md:flex-row justify-between gap-8">
                            <div className="w-full md:w-1/2">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notas</h3>
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                    {quote.notes || 'Sem observações adicionais.'}
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(quote.subtotal || quote.total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Impostos</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(quote.tax || 0)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
                                        <span className="text-gray-900 dark:text-white">Total</span>
                                        <span className="text-primary">{formatCurrency(quote.total || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetail;
