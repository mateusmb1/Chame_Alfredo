import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useApp } from '../contexts/AppContext';
import { Plus, Trash2, Save, ShoppingCart, Search, FileText, ArrowLeft, Calendar, User, DollarSign } from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';

const CreateQuote: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { clients, products, addQuote, companyProfile } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState('');
  const [validityDate, setValidityDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  const [items, setItems] = useState([
    { id: Date.now(), description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  // Product search state
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered clients for search
  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients;
    return clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()));
  }, [clients, clientSearch]);

  // Filtered products for search
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0); // Optional tax rate
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal - discount + taxAmount;

  // Handlers
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'quantity') {
      item.quantity = Number(value);
    } else if (field === 'unitPrice') {
      item.unitPrice = Number(value);
    } else if (field === 'description') {
      item.description = value;
      setSearchTerm(value);
      setActiveSearchIndex(index);
    }

    item.total = item.quantity * item.unitPrice;
    newItems[index] = item;
    setItems(newItems);
  };

  const handleSelectProduct = (index: number, product: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      description: product.name,
      unitPrice: product.price || 0,
      quantity: 1,
      total: (product.price || 0) * 1
    };
    setItems(newItems);
    setActiveSearchIndex(null);
    setSearchTerm('');
  };

  const handleSave = async () => {
    if (!clientId) {
      showToast('error', 'Por favor, selecione um cliente.');
      return;
    }

    if (items.some(i => !i.description)) {
      showToast('error', 'Preencha a descrição de todos os itens.');
      return;
    }

    setIsLoading(true);

    try {
      const selectedClient = clients.find(c => c.id === clientId);

      const quoteData = {
        clientId,
        clientName: selectedClient?.name || 'Cliente',
        items: items.map(i => ({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total
        })),
        subtotal,
        discount,
        tax: taxAmount,
        total,
        status: 'draft' as const,
        validityDate: validityDate ? new Date(validityDate).toISOString() : undefined,
        paymentTerms,
        notes
      };

      const newQuote = await addQuote(quoteData);

      if (newQuote) {
        showToast('success', 'Orçamento criado com sucesso!');
        navigate(`/quotes`);
      } else {
        showToast('error', 'Erro ao criar orçamento.');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/quotes')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <ArrowLeft className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Novo Orçamento</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Preencha os dados abaixo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/quotes')}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Salvar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Client Section */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Dados do Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente *</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data de Validade</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={validityDate}
                      onChange={(e) => setValidityDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condições de Pagamento</label>
                  <input
                    type="text"
                    placeholder="Ex: 30 dias"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Items Section */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Itens do Orçamento
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 w-1/2">Descrição</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 w-24">Qtd.</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 w-40">Valor Unit.</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 w-40">Total</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {items.map((item, index) => (
                    <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-slate-700/30 transition">
                      <td className="py-4 px-4 relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition" />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Busque por produto ou serviço..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-transparent bg-transparent hover:bg-white dark:hover:bg-slate-900 hover:border-gray-200 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-gray-900 dark:text-white placeholder-gray-400"
                          />
                          {activeSearchIndex === index && filteredProducts.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 max-h-60 overflow-y-auto">
                              {filteredProducts.map(product => (
                                <button
                                  key={product.id}
                                  onClick={() => handleSelectProduct(index, product)}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 flex justify-between items-center group/item"
                                >
                                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover/item:text-primary">{product.name}</span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{formatCurrency(product.price || 0)}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full text-center py-2 rounded-lg border border-transparent bg-transparent hover:bg-white dark:hover:bg-slate-900 hover:border-gray-200 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <CurrencyInput
                          value={item.unitPrice}
                          onChange={(val) => handleItemChange(index, 'unitPrice', val)}
                          className="w-full text-right py-2 rounded-lg border border-transparent bg-transparent hover:bg-white dark:hover:bg-slate-900 hover:border-gray-200 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-gray-900 dark:text-white font-mono"
                        />
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-gray-900 dark:text-white font-mono">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleAddItem}
              className="mt-6 flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Adicionar Item
            </button>
          </div>

          {/* Totals Section */}
          <div className="bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 p-8">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notas / Observações</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações visíveis para o cliente..."
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                />
              </div>
              <div className="w-full md:w-96 space-y-4">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Desconto</span>
                  <div className="w-32">
                    <CurrencyInput
                      value={discount}
                      onChange={setDiscount}
                      className="w-full text-right bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Impostos (Auto 0%)</span>
                  <span className="font-mono">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-primary font-mono">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateQuote;
