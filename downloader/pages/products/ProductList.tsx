import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package, Wrench, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../src/lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'product' | 'service';
  stock: number | null;
  sku?: string;
  unit?: string;
  source: 'inventory' | 'services';
}

export default function ProductList() {
  const navigate = useNavigate();
  const { inventory } = useApp();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'product' | 'service'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load services from products_services table
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('products_services')
          .select('*')
          .order('name');

        if (error) throw error;

        const mappedServices: Product[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price || 0,
          type: item.type === 'service' ? 'service' : 'product',
          stock: null,
          unit: item.unit || 'un',
          source: 'services' as const,
        }));

        setServices(mappedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    fetchServices();
  }, []);

  // Map inventory items to products
  useEffect(() => {
    const inventoryProducts: Product[] = inventory.map(item => ({
      id: item.id,
      name: item.name,
      description: `SKU: ${item.sku || '-'}`,
      price: item.price || 0,
      type: 'product' as const,
      stock: item.quantity,
      sku: item.sku,
      unit: item.unit || 'un',
      source: 'inventory' as const,
    }));

    setProducts(inventoryProducts);
    setIsLoading(false);
  }, [inventory]);

  // Combined and filtered list
  const allItems = [...products, ...services];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleDelete = async (item: Product) => {
    if (!confirm(`Deseja excluir "${item.name}"?`)) return;

    try {
      if (item.source === 'services') {
        await supabase.from('products_services').delete().eq('id', item.id);
        setServices(prev => prev.filter(s => s.id !== item.id));
      }
      showToast('success', 'Item excluído com sucesso!');
    } catch (err: any) {
      showToast('error', `Erro ao excluir: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando produtos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Produtos e Serviços</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {products.length} produtos do estoque • {services.length} serviços cadastrados
          </p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Adicionar Novo
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all ${filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('product')}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${filterType === 'product'
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
          >
            <Package className="w-4 h-4" /> Produtos
          </button>
          <button
            onClick={() => setFilterType('service')}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${filterType === 'service'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
          >
            <Wrench className="w-4 h-4" /> Serviços
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estoque</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p>Nenhum item encontrado</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={`${item.source}-${item.id}`}
                      onClick={() => setSelectedProduct(item)}
                      className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${selectedProduct?.id === item.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                        }`}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {formatCurrency(item.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${item.type === 'service'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                          {item.type === 'service' ? (
                            <><Wrench className="w-3 h-3" /> Serviço</>
                          ) : (
                            <><Package className="w-3 h-3" /> Produto</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.stock !== null ? (
                          <span className={`text-sm font-medium ${item.stock <= 5 ? 'text-red-600' : item.stock <= 20 ? 'text-amber-600' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                            {item.stock} {item.unit}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); }}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Side Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6 shadow-sm">
            {selectedProduct ? (
              <>
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${selectedProduct.type === 'service'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-green-100 dark:bg-green-900/30'
                    }`}>
                    {selectedProduct.type === 'service'
                      ? <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      : <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                    }
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedProduct.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedProduct.description}</p>
                </div>

                <div className="flex gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedProduct.type === 'service'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                    {selectedProduct.type === 'service' ? 'Serviço' : 'Produto'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {selectedProduct.source === 'inventory' ? 'Do Estoque' : 'Cadastrado'}
                  </span>
                </div>

                <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Preço Unitário</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(selectedProduct.price)}</span>
                  </div>
                  {selectedProduct.stock !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Estoque</span>
                      <span className={`font-bold ${selectedProduct.stock <= 5 ? 'text-red-600' : 'text-slate-900 dark:text-white'
                        }`}>
                        {selectedProduct.stock} {selectedProduct.unit}
                      </span>
                    </div>
                  )}
                  {selectedProduct.sku && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">SKU</span>
                      <span className="font-mono text-slate-900 dark:text-white">{selectedProduct.sku}</span>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <button className="w-full py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                    Editar Item
                  </button>
                  {selectedProduct.source === 'inventory' && (
                    <button
                      onClick={() => navigate('/inventory')}
                      className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Ver no Estoque
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Selecione um item para ver detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}