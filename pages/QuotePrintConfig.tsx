import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Construction, Plus, Minus, Download } from 'lucide-react';

import { Printer as PrintIcon } from 'lucide-react';

const QuotePrintConfig: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { quotes, clients, companyProfile } = useApp();
    const [quote, setQuote] = useState<any>(null);

    // Config State
    const [template, setTemplate] = useState('moderno');
    const [showLogo, setShowLogo] = useState(true);
    const [showTerms, setShowTerms] = useState(true);
    const [showSignature, setShowSignature] = useState(false);
    const [paperSize, setPaperSize] = useState('a4');
    const [margins, setMargins] = useState({ top: 20, bottom: 20, left: 15, right: 15 });
    const [zoom, setZoom] = useState(100);

    useEffect(() => {
        const found = quotes.find(q => q.id === id);
        if (found) {
            setQuote(found);
        }
    }, [id, quotes]);

    if (!quote) return <div className="p-8">Carregando...</div>;

    const client = clients.find(c => c.id === quote.clientId);
    const issueDate = new Date(quote.createdAt).toLocaleDateString('pt-BR');
    const validityDate = new Date(quote.validityDate).toLocaleDateString('pt-BR');

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex h-screen bg-[#f6f6f8] dark:bg-[#101622] overflow-hidden">
            {/* Sidebar Config */}
            <aside className="w-80 bg-white dark:bg-slate-900/50 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto no-print">
                <div className="p-6 space-y-8">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Configuração de Impressão</h1>

                    {/* Modelo */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Modelo</h2>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecionar Template</label>
                        <select
                            value={template}
                            onChange={e => setTemplate(e.target.value)}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                        >
                            <option value="moderno">Moderno</option>
                            <option value="classico">Clássico</option>
                            <option value="compacto">Compacto</option>
                        </select>
                    </div>

                    {/* Opções */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Opções de Exibição</h2>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar Logotipo</span>
                                <input type="checkbox" checked={showLogo} onChange={e => setShowLogo(e.target.checked)} className="rounded text-primary focus:ring-primary/50" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Incluir Termos e Condições</span>
                                <input type="checkbox" checked={showTerms} onChange={e => setShowTerms(e.target.checked)} className="rounded text-primary focus:ring-primary/50" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Exibir Assinatura</span>
                                <input type="checkbox" checked={showSignature} onChange={e => setShowSignature(e.target.checked)} className="rounded text-primary focus:ring-primary/50" />
                            </label>
                        </div>
                    </div>

                    {/* Layout */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Layout da Página</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Papel</label>
                                <select
                                    value={paperSize}
                                    onChange={e => setPaperSize(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                                >
                                    <option value="a4">A4</option>
                                    <option value="letter">Carta (Letter)</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Margem Sup. (mm)</label>
                                    <input type="number" value={margins.top} onChange={e => setMargins({ ...margins, top: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Margem Inf. (mm)</label>
                                    <input type="number" value={margins.bottom} onChange={e => setMargins({ ...margins, bottom: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Margem Esq. (mm)</label>
                                    <input type="number" value={margins.left} onChange={e => setMargins({ ...margins, left: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Margem Dir. (mm)</label>
                                    <input type="number" value={margins.right} onChange={e => setMargins({ ...margins, right: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                            <PrintIcon className="w-5 h-5" />
                            Imprimir Agora
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <Download className="w-5 h-5" />
                            Baixar PDF
                        </button>
                    </div>
                </div>
            </aside>

            {/* Preview Area */}
            <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-8 flex flex-col items-center">
                {/* Visual Zoom Controls */}
                <div className="w-full max-w-4xl flex justify-end items-center gap-2 mb-4 px-4 no-print">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Zoom:</span>
                    <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Minus className="w-4 h-4" /></button>
                    <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                    <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><Plus className="w-4 h-4" /></button>
                </div>

                {/* Paper */}
                <div
                    className="bg-white shadow-xl transition-all duration-200 origin-top text-black quote-print-container"
                    style={{
                        width: paperSize === 'a4' ? '210mm' : '216mm',
                        minHeight: paperSize === 'a4' ? '297mm' : '279mm',
                        paddingTop: `${margins.top}mm`,
                        paddingBottom: `${margins.bottom}mm`,
                        paddingLeft: `${margins.left}mm`,
                        paddingRight: `${margins.right}mm`,
                        transform: `scale(${zoom / 100})`,
                        marginBottom: '2rem'
                    }}
                >
                    {/* Header */}
                    <header className="flex justify-between items-start pb-8 border-b border-gray-200">
                        <div>
                            <h2 className="text-3xl font-bold text-primary uppercase">ORÇAMENTO</h2>
                            <p className="text-gray-500">#{quote.id}</p>
                        </div>
                        <div className="text-right">
                            {showLogo && (
                                <div className="flex justify-end mb-2">
                                    {companyProfile?.logo_url ? (
                                        <img src={companyProfile.logo_url} alt="Logo" className="h-16 w-auto object-contain" />
                                    ) : (
                                        <div className="bg-primary text-white p-2 rounded">
                                            <Construction className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                            )}
                            <p className="font-bold">{companyProfile?.name || 'Alfredo'}</p>
                            <p className="text-gray-600 text-sm">{companyProfile?.address}</p>
                            {companyProfile?.cnpj && <p className="text-gray-600 text-xs">CNPJ: {companyProfile.cnpj}</p>}
                        </div>
                    </header>

                    {/* Info Grid */}
                    <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                        <div>
                            <h3 className="font-bold mb-2 text-gray-900">Cliente:</h3>
                            <p className="font-semibold">{quote.clientName}</p>
                            {client && (
                                <>
                                    <p className="text-gray-600">{client.street}, {client.number}</p>
                                    <p className="text-gray-600">{client.email}</p>
                                </>
                            )}
                        </div>
                        <div className="text-right">
                            <p><span className="font-bold">Data Emissão:</span> {issueDate}</p>
                            <p><span className="font-bold">Data Validade:</span> {validityDate}</p>
                        </div>
                    </section>

                    {/* Table */}
                    <section className="flex-grow">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-2 font-semibold text-gray-900">Item/Serviço</th>
                                    <th className="p-2 font-semibold text-center text-gray-900">Qtd.</th>
                                    <th className="p-2 font-semibold text-right text-gray-900">Preço Unit.</th>
                                    <th className="p-2 font-semibold text-right text-gray-900">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quote.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-200">
                                        <td className="p-2 text-gray-600">{item.description}</td>
                                        <td className="p-2 text-center text-gray-600">{item.quantity}</td>
                                        <td className="p-2 text-right text-gray-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                                        </td>
                                        <td className="p-2 text-right text-gray-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {/* Footer */}
                    <footer className="mt-8 pt-8 text-sm">
                        <div className="flex flex-col items-end gap-1 mb-8">
                            <div className="flex justify-between w-48 text-gray-600">
                                <span>Subtotal:</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.subtotal || 0)}</span>
                            </div>
                            <div className="flex justify-between w-48 text-gray-600">
                                <span>Desconto:</span>
                                <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.discount || 0)}</span>
                            </div>
                            <div className="flex justify-between w-48 font-bold text-lg mt-2 border-t pt-2 border-gray-200">
                                <span>Total:</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total || 0)}</span>
                            </div>
                        </div>

                        {showTerms && (
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-bold mb-1">Termos e Condições</h4>
                                <p className="text-xs text-gray-500">{quote.paymentTerms || 'Pagamento em até 30 dias. Garantia de 90 dias sobre os serviços prestados.'}</p>
                            </div>
                        )}

                        {showSignature && (
                            <div className="mt-16 flex justify-between gap-8">
                                <div className="border-t border-gray-400 w-1/2 pt-2 text-center text-gray-600 text-xs">Assinatura do Responsável</div>
                                <div className="border-t border-gray-400 w-1/2 pt-2 text-center text-gray-600 text-xs">Assinatura do Cliente</div>
                            </div>
                        )}
                    </footer>

                </div>
            </main>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page {
                        size: ${paperSize};
                        margin: 0;
                    }
                    body {
                        background: white;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .quote-print-container {
                        width: 100% !important;
                        height: 100% !important;
                        min-height: auto !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        transform: none !important;
                        padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default QuotePrintConfig;
