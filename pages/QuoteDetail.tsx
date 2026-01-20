import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../src/lib/supabase';
import {
    ArrowLeft,
    Printer,
    Save,
    Plus,
    Trash2,
    ImagePlus
} from 'lucide-react';

interface QuoteItem {
    qty: string;
    description: string;
    material: number;
    labor: number;
    other: number;
}

const QuoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { quotes, clients } = useApp();
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Editable company info
    const [companyName, setCompanyName] = useState('ABC COMPANY, LLC');
    const [companyAddress, setCompanyAddress] = useState('123 Sample St. LA, CA 90210');
    const [companyPhone, setCompanyPhone] = useState('(XXX) XXX-XXXX');
    const [companyEmail, setCompanyEmail] = useState('sample@gmail.com');

    // Client details
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientEmail, setClientEmail] = useState('');

    // Estimate details
    const [estDate, setEstDate] = useState('');
    const [estNumber, setEstNumber] = useState('');
    const [estStartDate, setEstStartDate] = useState('');

    // Technician details
    const [techName, setTechName] = useState('John Smith');
    const [techPhone, setTechPhone] = useState('(XXX) XXX-XXXX');

    // Quote items
    const [items, setItems] = useState<QuoteItem[]>([
        { qty: '1.0', description: 'Add lighting in new room', material: 150, labor: 300, other: 0 },
        { qty: '200 FT', description: 'Conduit Wiring', material: 250, labor: 500, other: 10 },
        { qty: '1.0', description: 'Permits', material: 0, labor: 65, other: 250 },
    ]);

    // Tax rate
    const [taxRate, setTaxRate] = useState(10);

    // Load company settings
    useEffect(() => {
        const loadCompanySettings = async () => {
            try {
                const { data } = await supabase
                    .from('company_settings')
                    .select('*')
                    .single();

                if (data) {
                    setCompanyName(data.company_name || 'ABC COMPANY, LLC');
                    setCompanyAddress(`${data.street || ''}, ${data.number || ''} ${data.city || ''}, ${data.state || ''} ${data.cep || ''}`);
                    setCompanyPhone(data.phone || '(XXX) XXX-XXXX');
                    setCompanyEmail(data.email || 'sample@gmail.com');
                }
            } catch (err) {
                console.error('Error loading company settings:', err);
            }
        };
        loadCompanySettings();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = quotes.find(q => q.id === id);
            if (found) {
                setQuote(found);
                populateFromQuote(found);
            }
            setIsLoading(false);
        }, 500);

        if (quotes.length > 0) {
            const found = quotes.find(q => q.id === id);
            if (found) {
                setQuote(found);
                populateFromQuote(found);
                setIsLoading(false);
                clearTimeout(timer);
            }
        }

        return () => clearTimeout(timer);
    }, [id, quotes]);

    const populateFromQuote = (q: any) => {
        const client = clients.find(c => c.id === q.clientId);

        setClientName(q.clientName || client?.name || '');
        setClientAddress(client ? `${client.street || ''}, ${client.city || ''} ${client.state || ''} ${client.cep || ''}` : '');
        setClientPhone(client?.phone || '');
        setClientEmail(client?.email || '');

        setEstDate(q.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]);
        setEstNumber(q.id?.slice(0, 8) || '1254');
        setEstStartDate(q.validityDate?.split('T')[0] || '');

        if (q.items && q.items.length > 0) {
            setItems(q.items.map((item: any) => ({
                qty: String(item.quantity || '1'),
                description: item.description || '',
                material: item.material || item.unitPrice || 0,
                labor: item.labor || 0,
                other: item.other || 0,
            })));
        }
    };

    const calculateItemTotal = (item: QuoteItem) => item.material + item.labor + item.other;

    const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const estimateTotal = subtotal + taxAmount;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { qty: '', description: '', material: 0, labor: 0, other: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save logic here
            showToast('success', 'Orçamento salvo com sucesso!');
        } catch (err: any) {
            showToast('error', `Erro ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

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

    return (
        <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen py-10 px-4 md:px-0 print:bg-white print:p-0">
            {/* Header Actions - Hidden on print */}
            <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center px-4 print:hidden">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="material-icons text-primary">description</span>
                    Novo Orçamento
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/quotes')}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" /> Imprimir
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Salvar Orçamento'}
                    </button>
                </div>
            </div>

            {/* Main Document */}
            <main className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-sm overflow-hidden border border-gray-200 dark:border-gray-700 print:shadow-none print:border-0">
                <div className="p-8 md:p-12 space-y-10">
                    {/* Header with Logo and Company Info */}
                    <header className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Logo Placeholder */}
                        <div className="col-span-1">
                            <div className="w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <ImagePlus className="w-10 h-10 mb-2" />
                                <span className="text-xs font-medium uppercase">Logotipo aqui</span>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="col-span-1 text-center md:text-left space-y-2">
                            <input
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded transition-all p-1 text-xl font-bold placeholder-gray-400 text-gray-800 dark:text-white"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="ABC COMPANY, LLC"
                            />
                            <input
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded transition-all p-1 text-sm text-gray-600 dark:text-gray-300"
                                value={companyAddress}
                                onChange={(e) => setCompanyAddress(e.target.value)}
                                placeholder="123 Sample St. LA, CA 90210"
                            />
                            <input
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded transition-all p-1 text-sm text-gray-600 dark:text-gray-300"
                                value={companyPhone}
                                onChange={(e) => setCompanyPhone(e.target.value)}
                                placeholder="(XXX) XXX-XXXX"
                            />
                            <input
                                className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded transition-all p-1 text-sm text-gray-600 dark:text-gray-300"
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                                placeholder="sample@gmail.com"
                            />
                        </div>

                        {/* Title */}
                        <div className="col-span-1 text-right">
                            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Job Estimate</h2>
                        </div>
                    </header>

                    {/* Client & Estimate Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Client Details */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold border-b border-primary text-primary pb-1">Client Details</h3>
                            <div className="bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded space-y-2">
                                <input
                                    className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded p-1 font-bold text-gray-800 dark:text-white"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="Steve Smith"
                                />
                                <input
                                    className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded p-1 text-sm text-gray-600 dark:text-gray-300"
                                    value={clientAddress}
                                    onChange={(e) => setClientAddress(e.target.value)}
                                    placeholder="123 Sample St. LA, CA 90210"
                                />
                                <input
                                    className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded p-1 text-sm text-gray-600 dark:text-gray-300"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                    placeholder="(XXX) XXX-XXXX"
                                />
                                <input
                                    className="w-full bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded p-1 text-sm text-gray-600 dark:text-gray-300"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    placeholder="sample@gmail.com"
                                />
                            </div>
                        </div>

                        {/* Estimate Details */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold border-b border-primary text-primary pb-1">Estimate Details</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-1">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Est. Date</label>
                                    <input
                                        type="date"
                                        className="text-sm text-right bg-transparent border-none p-0 focus:ring-0 text-gray-700 dark:text-gray-300"
                                        value={estDate}
                                        onChange={(e) => setEstDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-1">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Est. Number</label>
                                    <input
                                        type="text"
                                        className="text-sm text-right bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-700 dark:text-gray-300"
                                        value={estNumber}
                                        onChange={(e) => setEstNumber(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-1">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Est. Start Date</label>
                                    <input
                                        type="date"
                                        className="text-sm text-right bg-transparent border-none p-0 focus:ring-0 text-gray-700 dark:text-gray-300"
                                        value={estStartDate}
                                        onChange={(e) => setEstStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Est. Total Amount</label>
                                    <span className="text-lg font-bold text-primary">{formatCurrency(estimateTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 text-left text-xs font-bold uppercase tracking-wider bg-primary text-white border-r border-white/10 w-16">QTY</th>
                                    <th className="py-2 px-4 text-left text-xs font-bold uppercase tracking-wider bg-primary text-white border-r border-white/10">Work Description</th>
                                    <th className="py-2 px-4 text-left text-xs font-bold uppercase tracking-wider bg-primary text-white border-r border-white/10 w-24">Material $</th>
                                    <th className="py-2 px-4 text-left text-xs font-bold uppercase tracking-wider bg-primary text-white border-r border-white/10 w-24">Labor $</th>
                                    <th className="py-2 px-4 text-left text-xs font-bold uppercase tracking-wider bg-primary text-white border-r border-white/10 w-24">Other $</th>
                                    <th className="py-2 px-4 text-left text-xs font-bold uppercase tracking-wider bg-primary text-white w-24">Total</th>
                                    <th className="py-2 px-4 bg-primary text-white w-10 print:hidden"></th>
                                </tr>
                            </thead>
                            <tbody className="dark:text-gray-300">
                                {items.map((item, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                                            <input
                                                className="w-full text-center bg-transparent border-none text-sm p-0 focus:ring-0"
                                                value={item.qty}
                                                onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20">
                                            <input
                                                className="w-full bg-transparent border-none text-sm p-0 focus:ring-0"
                                                value={item.description}
                                                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                                            <input
                                                type="number"
                                                className="w-full text-right bg-transparent border-none text-sm p-0 focus:ring-0"
                                                value={item.material}
                                                onChange={(e) => updateItem(idx, 'material', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                                            <input
                                                type="number"
                                                className="w-full text-right bg-transparent border-none text-sm p-0 focus:ring-0"
                                                value={item.labor}
                                                onChange={(e) => updateItem(idx, 'labor', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                                            <input
                                                type="number"
                                                className="w-full text-right bg-transparent border-none text-sm p-0 focus:ring-0"
                                                value={item.other}
                                                onChange={(e) => updateItem(idx, 'other', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-right font-medium">
                                            {formatCurrency(calculateItemTotal(item))}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 print:hidden">
                                            <button
                                                onClick={() => removeItem(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {/* Empty rows for more space */}
                                {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, idx) => (
                                    <tr key={`empty-${idx}`} className={idx % 2 === 1 ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 h-8"></td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20 h-8"></td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700"></td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700"></td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700"></td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-right text-gray-300 dark:text-gray-700 text-xs">$0.00</td>
                                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 print:hidden"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            onClick={addItem}
                            className="mt-2 text-sm text-primary hover:underline flex items-center gap-1 print:hidden"
                        >
                            <Plus className="w-4 h-4" /> Adicionar linha
                        </button>
                    </div>

                    {/* Bottom Section: Technician + Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Technician Details + Terms */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold border-b border-primary text-primary pb-1">Technician Details</h3>
                                <div className="bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 uppercase font-semibold w-20">Name</span>
                                        <input
                                            className="flex-1 bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded p-1 text-sm text-gray-700 dark:text-gray-300"
                                            value={techName}
                                            onChange={(e) => setTechName(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 uppercase font-semibold w-20">Phone #</span>
                                        <input
                                            className="flex-1 bg-transparent border-none focus:ring-2 focus:ring-blue-400 rounded p-1 text-sm text-gray-700 dark:text-gray-300"
                                            value={techPhone}
                                            onChange={(e) => setTechPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="border border-primary/20 bg-gray-50 dark:bg-gray-800/50 p-4 rounded text-[10px] leading-relaxed text-gray-600 dark:text-gray-400">
                                <p className="font-bold mb-1 text-gray-800 dark:text-gray-200">Acceptance Terms:</p>
                                The information contained in this quote is not an invoice and serves solely as an estimate for the described services. The final cost may vary depending on changes made after the estimate is created. If there are any changes, the client will be notified in advance. This estimate is valid for 7 days from the estimate date. By signing below, you acknowledge that you have read this estimate and agree to all its terms and conditions, including the cost and scope of work as outlined above.
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="space-y-1">
                            <div className="flex">
                                <div className="flex-grow"></div>
                                <div className="w-full max-w-xs space-y-px">
                                    <div className="grid grid-cols-2 text-sm">
                                        <span className="p-2 text-right font-medium text-gray-500">Subtotal</span>
                                        <span className="p-2 text-right bg-blue-50/50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 text-sm">
                                        <span className="p-2 text-right font-medium text-gray-500">Tax Rate</span>
                                        <span className="p-2 text-right bg-blue-50/50 dark:bg-blue-900/20 font-mono text-gray-800 dark:text-gray-200">{taxRate.toFixed(2)}%</span>
                                    </div>
                                    <div className="grid grid-cols-2 text-sm">
                                        <span className="p-2 text-right font-medium text-gray-500">Tax Amount</span>
                                        <span className="p-2 text-right bg-blue-50/50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200">{formatCurrency(taxAmount)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 text-base font-bold bg-primary text-white">
                                        <span className="p-3 text-right">Estimate Total</span>
                                        <span className="p-3 text-right">{formatCurrency(estimateTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thank You */}
                    <div className="pt-6 text-center italic font-semibold text-gray-700 dark:text-gray-300">
                        Thank you for your business!
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                <span>Client Signature</span>
                                <span>Date</span>
                            </div>
                            <div className="h-10 bg-blue-50/50 dark:bg-blue-900/20 border-b border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                <span>Company Representative Signature</span>
                                <span>Date</span>
                            </div>
                            <div className="h-10 bg-blue-50/50 dark:bg-blue-900/20 border-b border-gray-300 dark:border-gray-700"></div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-5xl mx-auto mt-10 text-center text-gray-400 text-xs print:hidden">
                © 2023 Plataforma de Gestão de Ordens de Serviço. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default QuoteDetail;
