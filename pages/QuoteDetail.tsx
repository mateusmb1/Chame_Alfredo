import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import {
    Construction,
    Mail,
    Link as LinkIcon,
    Download,
    ArrowLeft,
    Printer
} from 'lucide-react';

const QuoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { quotes, clients } = useApp();
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Give time for quotes to load from Supabase
        const timer = setTimeout(() => {
            const found = quotes.find(q => q.id === id);
            if (found) {
                setQuote(found);
            }
            setIsLoading(false);
        }, 500);

        // Also check immediately if quotes are already loaded
        if (quotes.length > 0) {
            const found = quotes.find(q => q.id === id);
            if (found) {
                setQuote(found);
                setIsLoading(false);
                clearTimeout(timer);
            }
        }

        return () => clearTimeout(timer);
    }, [id, quotes]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando orçamento...</span>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <span className="text-6xl mb-4">📄</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Orçamento não encontrado</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">O orçamento com ID "{id}" não existe ou foi removido.</p>
                <button
                    onClick={() => navigate('/quotes')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Voltar para Orçamentos
                </button>
            </div>
        );
    }

    const client = clients.find(c => c.id === quote.clientId);
    const issueDate = new Date(quote.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    const validityDate = new Date(quote.validityDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#f6f6f8] dark:bg-[#101622] min-h-screen">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Content: Quote Preview */}
                <div className="lg:col-span-2">
                    {/* Breadcrumbs */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <button onClick={() => navigate('/quotes')} className="text-[#4c669a] dark:text-gray-400 text-sm font-medium leading-normal hover:underline">Orçamentos</button>
                        <span className="text-[#4c669a] dark:text-gray-500 text-sm font-medium leading-normal">/</span>
                        <span className="text-[#4c669a] dark:text-gray-400 text-sm font-medium leading-normal">Orçamento #{quote.id}</span>
                        <span className="text-[#4c669a] dark:text-gray-500 text-sm font-medium leading-normal">/</span>
                        <span className="text-[#0d121b] dark:text-gray-200 text-sm font-medium leading-normal">Pré-visualizar</span>
                    </div>
                    {/* Page Heading */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Pré-visualizar Orçamento</h1>
                    </div>
                    {/* Quote Preview Panel */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                        <div className="p-8 sm:p-12">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                                            <Construction className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[#0d121b] dark:text-white">Sua Empresa de Serviços</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Rua Exemplo, 123<br />
                                        Cidade, Estado, 12345-678<br />
                                        contato@suaempresa.com<br />
                                        (11) 98765-4321
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Orçamento para:</h3>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">{quote.clientName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {client?.street}, {client?.number}<br />
                                        {client?.city}, {client?.state}, {client?.cep}<br />
                                        {client?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">Número do Orçamento:</p>
                                        <p className="text-gray-500 dark:text-gray-400">#{quote.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">Data de Emissão:</p>
                                        <p className="text-gray-500 dark:text-gray-400">{issueDate}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">Validade:</p>
                                        <p className="text-gray-500 dark:text-gray-400">{validityDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-0">Serviço / Produto</th>
                                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">Qtd.</th>
                                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">Preço Unit.</th>
                                                    <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pr-0">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                {quote.items.map((item: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-0">{item.description}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">{item.quantity}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm text-gray-500 dark:text-gray-400 sm:pr-0">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <div className="w-full max-w-sm space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.subtotal || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Desconto:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.discount || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Impostos / Taxas:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{quote.tax || 0}%</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 text-base">
                                        <span className="font-bold text-gray-900 dark:text-white">Total Geral:</span>
                                        <span className="font-bold text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total || 0)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">Termos e Condições</h4>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{quote.paymentTerms || 'Pagamento a ser realizado em até 15 dias após a aprovação do orçamento. Qualquer serviço adicional será cobrado separadamente.'}</p>
                                {quote.notes && (
                                    <>
                                        <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-4">Observações</h4>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{quote.notes}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Sticky Action Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="text-[#0d121b] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">Ações</h2>
                            <div className="flex flex-col gap-3">
                                <button className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white hover:bg-primary/90">
                                    <Mail className="w-5 h-5" />
                                    <span className="truncate">Enviar por E-mail</span>
                                </button>
                                <button className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#e7ebf3] px-5 text-base font-bold leading-normal tracking-[0.015em] text-[#0d121b] hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                                    <LinkIcon className="w-5 h-5" />
                                    <span className="truncate">Gerar Link Compartilhável</span>
                                </button>
                                <button
                                    onClick={() => navigate(`/quotes/${quote.id}/print-config`)} // New route!
                                    className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#e7ebf3] px-5 text-base font-bold leading-normal tracking-[0.015em] text-[#0d121b] hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                    <Printer className="w-5 h-5" />
                                    <span className="truncate">Imprimir / Baixar PDF</span>
                                </button>
                                <button
                                    onClick={() => navigate(`/quotes/${quote.id}/edit`)}
                                    className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-transparent px-5 text-base font-bold leading-normal tracking-[0.015em] text-[#0d121b] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span className="truncate">Voltar para Edição</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetail;
