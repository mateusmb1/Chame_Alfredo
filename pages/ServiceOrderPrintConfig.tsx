import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Printer as PrintIcon, Download, Plus, Minus } from 'lucide-react';
import ServiceOrderReport from '../components/ServiceOrderReport';

const ServiceOrderPrintConfig: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { orders, clients } = useApp();
    const [order, setOrder] = useState<any>(null);

    // Config State
    const [template, setTemplate] = useState('relatorio');
    const [showLogo, setShowLogo] = useState(true);
    const [showSignatures, setShowSignatures] = useState(true);
    const [includeDiagnosis, setIncludeDiagnosis] = useState(true);
    const [paperSize, setPaperSize] = useState('a4');
    const [margins, setMargins] = useState({ top: 10, bottom: 10, left: 10, right: 10 });
    const [zoom, setZoom] = useState(90);

    useEffect(() => {
        const found = orders.find(o => o.id === id);
        if (found) {
            setOrder(found);
        }
    }, [id, orders]);

    if (!order) return <div className="p-8">Carregando...</div>;

    const client = clients.find(c => c.id === order.clientId || c.name === order.clientName);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex h-screen bg-[#f6f6f8] dark:bg-[#101622] overflow-hidden">
            {/* Sidebar Config */}
            <aside className="w-80 bg-white dark:bg-slate-900/50 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto no-print">
                <div className="p-6 space-y-8">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Configuração de Impressão: Modelo Relatório</h1>

                    {/* Modelo */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Modelo</h2>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecionar Template</label>
                        <select
                            value={template}
                            onChange={e => setTemplate(e.target.value)}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                        >
                            <option value="relatorio">Modelo Relatório</option>
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
                                <span className="text-sm text-gray-700 dark:text-gray-300">Exibir Assinaturas</span>
                                <input type="checkbox" checked={showSignatures} onChange={e => setShowSignatures(e.target.checked)} className="rounded text-primary focus:ring-primary/50" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Incluir Diagnóstico com Fotos</span>
                                <input type="checkbox" checked={includeDiagnosis} onChange={e => setIncludeDiagnosis(e.target.checked)} className="rounded text-primary focus:ring-primary/50" />
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

                {/* Paper Container */}
                <div
                    className="bg-white shadow-xl transition-all duration-200 origin-top text-black quote-print-container"
                    style={{
                        width: paperSize === 'a4' ? '210mm' : '216mm',
                        minHeight: paperSize === 'a4' ? '297mm' : '279mm',
                        // Margins are handled by child component p-8, but we can override or wrap
                        paddingTop: `${margins.top}mm`,
                        paddingBottom: `${margins.bottom}mm`,
                        // We rely on ServiceOrderReport's internal structure but wrap it to simulate paper
                        transform: `scale(${zoom / 100})`,
                        marginBottom: '2rem'
                    }}
                >
                    <ServiceOrderReport order={order} client={client} />
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
                        padding-top: ${margins.top}mm !important;
                        padding-bottom: ${margins.bottom}mm !important;
                    }
                    /* Hide elements based on state if needed, though typically we conditionally render in React */
                    ${!showLogo ? '.report-logo { display: none; }' : ''}
                    ${!showSignatures ? '.report-signatures { display: none; }' : ''}
                }
            `}</style>
        </div>
    );
};

export default ServiceOrderPrintConfig;
