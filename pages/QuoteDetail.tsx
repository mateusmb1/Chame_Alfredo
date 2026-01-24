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
    FileText,
    FolderPlus,
    Search,
    ClipboardList
} from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';

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
    const { quotes, clients, addProject, updateQuote, companyProfile, products } = useApp();
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isConverting, setIsConverting] = useState(false);

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
    const [techName, setTechName] = useState('');
    const [techPhone, setTechPhone] = useState('');

    // Quote items
    const [items, setItems] = useState<QuoteItem[]>([
        { qty: '1', description: '', material: 0, labor: 0, other: 0 },
    ]);
    const [suggestions, setSuggestions] = useState<{ idx: number; list: typeof products } | null>(null);

    // Tax rate
    const [taxRate, setTaxRate] = useState(10);

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
    }, [id, quotes, clients]);

    const populateFromQuote = (q: any) => {
        const client = clients.find(c => c.id === q.clientId);

        setClientName(q.clientName || client?.name || '');
        if (client) {
            const addr = [client.street, client.number, client.city, client.state, client.cep].filter(Boolean).join(', ');
            setClientAddress(addr);
            setClientPhone(client.phone || '');
            setClientEmail(client.email || '');
        }

        setEstDate(q.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]);
        setEstNumber(q.quoteNumber || q.id?.slice(0, 8).toUpperCase() || '');
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
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);

        if (field === 'description') {
            const query = String(value).toLowerCase();
            if (query.length > 1) {
                const matches = products.filter(p => p.name.toLowerCase().includes(query));
                setSuggestions({ idx: index, list: matches });
            } else {
                setSuggestions(null);
            }
        }
    };

    const selectProduct = (index: number, product: any) => {
        const updated = [...items];
        updated[index] = {
            ...updated[index],
            description: product.name,
            material: product.price || 0 // Assuming price maps to material cost default
        };
        setItems(updated);
        setSuggestions(null);
    };

    const addItem = () => {
        setItems([...items, { qty: '', description: '', material: 0, labor: 0, other: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleConvertToProject = async () => {
        if (!quote) return;
        setIsConverting(true);
        try {
            const client = clients.find(c => c.id === quote.clientId);
            const projectData = {
                name: `Projeto - ${clientName || quote.clientName}`,
                description: `Projeto criado a partir do orçamento #${estNumber}. ${quote.notes || ''}`,
                type: 'instalacao' as const,
                status: 'planejamento' as const,
                clientId: quote.clientId,
                clientName: clientName || quote.clientName,
                startDate: new Date().toISOString().split('T')[0],
                endDate: estStartDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                budget: estimateTotal,
                progress: 0,
                responsibleId: '',
                responsibleName: techName || '',
                team: [],
                relatedOrders: [],
                quoteId: quote.id,
                quoteName: estNumber,
                documents: [],
                notes: []
            };

            // await the result from addProject which now returns the created project object
            const newProject = await addProject(projectData);

            if (newProject && newProject.id && updateQuote) {
                updateQuote(quote.id, { ...quote, projectId: newProject.id, status: 'approved' });
                showToast('success', 'Projeto criado com sucesso!');
                // Optional: Link quote to project via an activity or separate link
                navigate(`/projects`);
            } else {
                throw new Error("Falha ao criar projeto: Sem ID retornado.");
            }

        } catch (err: any) {
            showToast('error', `Erro ao converter: ${err.message}`);
        } finally {
            setIsConverting(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            showToast('success', 'Orçamento salvo com sucesso!');
        } catch (err: any) {
            showToast('error', `Erro ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = () => window.print();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Carregando orçamento...</span>
                </div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 p-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center max-w-md">
                    <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Orçamento não encontrado</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">O orçamento com ID "{id}" não existe ou foi removido.</p>
                    <button
                        onClick={() => navigate('/quotes')}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                    >
                        Voltar para Orçamentos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-8 px-4 print:bg-white print:p-0">
            {/* Header Actions */}
            <div className="max-w-5xl mx-auto mb-8 print:hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/quotes')}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orçamento</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">#{estNumber}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <Printer className="w-4 h-4" /> Imprimir
                        </button>
                        {!quote.projectId && !quote.sourceOrderId && (
                            <>
                                <button
                                    onClick={() => navigate('/orders/new', { state: { quote } })}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    <ClipboardList className="w-4 h-4" /> Converter em OS
                                </button>
                                <button
                                    onClick={handleConvertToProject}
                                    disabled={isConverting}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    <FolderPlus className="w-4 h-4" /> {isConverting ? 'Convertendo...' : 'Criar Projeto'}
                                </button>
                            </>
                        )}
                        {quote.projectId && (
                            <button
                                onClick={() => navigate('/projects')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                            >
                                <FolderPlus className="w-4 h-4" /> Ver Projeto
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Document */}
            <main className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 print:shadow-none print:border-0 print:rounded-none">
                    <div className="p-8 md:p-12 space-y-10">

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                {companyProfile?.logo_url ? (
                                    <img src={companyProfile.logo_url} alt="Logo" className="h-24 w-auto object-contain" />
                                ) : (
                                    <div className="w-32 h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-400">
                                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl mb-2">A</div>
                                        <span className="text-xs font-medium">Logo</span>
                                    </div>
                                )}
                            </div>

                            {/* Company Info */}
                            <div className="flex-1 space-y-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {companyProfile?.company_name || 'Alfredo'}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {[companyProfile?.street, companyProfile?.number, companyProfile?.city, companyProfile?.state].filter(Boolean).join(', ')}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {companyProfile?.phone}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {companyProfile?.email}
                                </p>
                                {companyProfile?.cnpj && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        CNPJ: {companyProfile.cnpj}
                                    </p>
                                )}
                            </div>

                            {/* Title */}
                            <div className="text-right">
                                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                    ORÇAMENTO
                                </h2>
                                <p className="text-lg font-mono text-slate-500 dark:text-slate-400 mt-1">#{estNumber}</p>
                            </div>
                        </div>

                        {/* Client & Estimate Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Client */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                    Dados do Cliente
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        className="w-full font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Nome do cliente"
                                    />
                                    <input
                                        className="w-full text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                        value={clientAddress}
                                        onChange={(e) => setClientAddress(e.target.value)}
                                        placeholder="Endereço"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            className="w-full text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                            value={clientPhone}
                                            onChange={(e) => setClientPhone(e.target.value)}
                                            placeholder="Telefone"
                                        />
                                        <input
                                            className="w-full text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                            value={clientEmail}
                                            onChange={(e) => setClientEmail(e.target.value)}
                                            placeholder="Email"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Estimate Info */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                    Detalhes do Orçamento
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                        <span className="text-sm font-medium text-slate-500">Data</span>
                                        <input
                                            type="date"
                                            className="text-sm font-medium text-slate-900 dark:text-white bg-transparent border-none text-right focus:ring-0"
                                            value={estDate}
                                            onChange={(e) => setEstDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                        <span className="text-sm font-medium text-slate-500">Número</span>
                                        <input
                                            className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-none text-right focus:ring-0 font-mono"
                                            value={estNumber}
                                            onChange={(e) => setEstNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                        <span className="text-sm font-medium text-slate-500">Validade</span>
                                        <input
                                            type="date"
                                            className="text-sm font-medium text-slate-900 dark:text-white bg-transparent border-none text-right focus:ring-0"
                                            value={estStartDate}
                                            onChange={(e) => setEstStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg px-4 -mx-2">
                                        <span className="text-sm font-bold text-primary">TOTAL</span>
                                        <span className="text-2xl font-black text-primary">{formatCurrency(estimateTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                                        <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-wider w-20">Qtd</th>
                                        <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-wider">Descrição</th>
                                        <th className="py-4 px-4 text-right text-xs font-bold uppercase tracking-wider w-28">Material</th>
                                        <th className="py-4 px-4 text-right text-xs font-bold uppercase tracking-wider w-28">Mão de Obra</th>
                                        <th className="py-4 px-4 text-right text-xs font-bold uppercase tracking-wider w-28">Outros</th>
                                        <th className="py-4 px-4 text-right text-xs font-bold uppercase tracking-wider w-28">Total</th>
                                        <th className="py-4 px-2 w-10 print:hidden"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx} className={`border-b border-slate-100 dark:border-slate-700 ${idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'bg-white dark:bg-slate-800/10'} hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors`}>
                                            <td className="py-3 px-4">
                                                <input
                                                    className="w-full text-center text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-primary focus:ring-0 rounded-lg py-1"
                                                    value={item.qty}
                                                    onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                                                    placeholder="1"
                                                />
                                            </td>
                                            <td className="py-3 px-4 relative">
                                                <input
                                                    className="w-full text-sm text-slate-700 dark:text-slate-300 bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-primary focus:ring-0 rounded-lg py-1 px-2"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                                    placeholder="Descrição do serviço ou material"
                                                    onBlur={() => setTimeout(() => setSuggestions(null), 200)}
                                                />
                                                {suggestions && suggestions.idx === idx && suggestions.list.length > 0 && (
                                                    <div className="absolute top-full left-0 w-full z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                                        {suggestions.list.map(prod => (
                                                            <div
                                                                key={prod.id}
                                                                className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer text-sm"
                                                                onClick={() => selectProduct(idx, prod)}
                                                            >
                                                                <span className="font-bold block">{prod.name}</span>
                                                                <span className="text-xs text-slate-500">R$ {prod.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <CurrencyInput
                                                    className="w-full text-right text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-primary focus:ring-0 rounded-lg py-1"
                                                    value={item.material}
                                                    onChange={(val) => updateItem(idx, 'material', val)}
                                                    placeholder="0,00"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <CurrencyInput
                                                    className="w-full text-right text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-primary focus:ring-0 rounded-lg py-1"
                                                    value={item.labor}
                                                    onChange={(val) => updateItem(idx, 'labor', val)}
                                                    placeholder="0,00"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <CurrencyInput
                                                    className="w-full text-right text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-primary focus:ring-0 rounded-lg py-1"
                                                    value={item.other}
                                                    onChange={(val) => updateItem(idx, 'other', val)}
                                                    placeholder="0,00"
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(calculateItemTotal(item))}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 print:hidden">
                                                <button
                                                    onClick={() => removeItem(idx)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                onClick={addItem}
                                className="w-full py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 print:hidden"
                            >
                                <Plus className="w-4 h-4" /> Adicionar Item
                            </button>
                        </div>

                        {/* Bottom Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Technician + Terms */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-primary rounded-full"></div>
                                        Técnico Responsável
                                    </h3>
                                    <div className="space-y-3">
                                        <input
                                            className="w-full text-sm font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                            value={techName}
                                            onChange={(e) => setTechName(e.target.value)}
                                            placeholder="Nome do técnico"
                                        />
                                        <input
                                            className="w-full text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                            value={techPhone}
                                            onChange={(e) => setTechPhone(e.target.value)}
                                            placeholder="Telefone do técnico"
                                        />
                                    </div>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                                    <p className="font-bold mb-2">Termos de Aceitação:</p>
                                    As informações contidas neste orçamento não constituem uma fatura e servem apenas como estimativa para os serviços descritos. O custo final pode variar dependendo de alterações feitas após a criação do orçamento. Este orçamento é válido por 7 dias a partir da data de emissão.
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="flex flex-col justify-end">
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden">
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Subtotal</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Taxa ({taxRate}%)</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(taxAmount)}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 flex justify-between items-center">
                                        <span className="font-bold text-lg">Total do Orçamento</span>
                                        <span className="font-black text-2xl">{formatCurrency(estimateTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thank You */}
                        <div className="text-center py-6">
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-400 italic">
                                Agradecemos a preferência!
                            </p>
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assinatura do Cliente</p>
                                <div className="h-16 bg-slate-50 dark:bg-slate-900/50 border-b-2 border-slate-300 dark:border-slate-600 rounded-t-lg"></div>
                                <p className="text-xs text-slate-400 mt-2 text-center">Data: ____/____/________</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assinatura do Representante</p>
                                <div className="h-16 bg-slate-50 dark:bg-slate-900/50 border-b-2 border-slate-300 dark:border-slate-600 rounded-t-lg"></div>
                                <p className="text-xs text-slate-400 mt-2 text-center">Data: ____/____/________</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuoteDetail;
