import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Search, Package, Wrench, X, Check } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { ProductService } from '../types/productService';

export interface OrderLineItem {
    id: string;
    type: 'product' | 'service';
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
    sourceId?: string; // ID from inventory or products_services
}

interface OrderItemSelectorProps {
    items: OrderLineItem[];
    onItemsChange: (items: OrderLineItem[]) => void;
    inventory: InventoryItem[];
    productsServices: ProductService[];
    onAddNewProduct?: (product: Partial<InventoryItem>) => void;
    onAddNewService?: (service: Partial<ProductService>) => void;
}

const OrderItemSelector: React.FC<OrderItemSelectorProps> = ({
    items,
    onItemsChange,
    inventory,
    productsServices,
    onAddNewProduct,
    onAddNewService
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNewItemForm, setShowNewItemForm] = useState(false);
    const [newItemType, setNewItemType] = useState<'product' | 'service'>('product');
    const [newItemData, setNewItemData] = useState({ name: '', description: '', price: '', unit: 'un' });

    // Combine inventory and services for search
    const allAvailableItems = useMemo(() => {
        const inventoryItems = inventory.map(item => ({
            id: item.id,
            type: 'product' as const,
            name: item.name,
            description: item.category || '',
            price: item.price || 0,
            unit: item.unit || 'un',
            inStock: item.quantity
        }));

        const serviceItems = productsServices
            .filter(ps => ps.active)
            .map(item => ({
                id: item.id,
                type: item.category === 'produto' ? 'product' as const : 'service' as const,
                name: item.name,
                description: item.description || '',
                price: item.price || 0,
                unit: item.unit || 'un',
                inStock: null
            }));

        return [...inventoryItems, ...serviceItems];
    }, [inventory, productsServices]);

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return allAvailableItems.slice(0, 10);
        const term = searchTerm.toLowerCase();
        return allAvailableItems.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.description?.toLowerCase().includes(term)
        ).slice(0, 10);
    }, [allAvailableItems, searchTerm]);

    const addItem = (item: typeof allAvailableItems[0]) => {
        const existingIndex = items.findIndex(i => i.sourceId === item.id && i.type === item.type);

        if (existingIndex >= 0) {
            // Increment quantity
            const updated = [...items];
            updated[existingIndex].quantity += 1;
            updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
            onItemsChange(updated);
        } else {
            // Add new item
            const newItem: OrderLineItem = {
                id: `item-${Date.now()}`,
                type: item.type,
                name: item.name,
                description: item.description,
                quantity: 1,
                unitPrice: item.price,
                total: item.price,
                sourceId: item.id
            };
            onItemsChange([...items, newItem]);
        }
        setSearchTerm('');
        setShowDropdown(false);
    };

    const updateItemQuantity = (index: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(index);
            return;
        }
        const updated = [...items];
        updated[index].quantity = quantity;
        updated[index].total = quantity * updated[index].unitPrice;
        onItemsChange(updated);
    };

    const updateItemPrice = (index: number, price: number) => {
        const updated = [...items];
        updated[index].unitPrice = price;
        updated[index].total = updated[index].quantity * price;
        onItemsChange(updated);
    };

    const removeItem = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
    };

    const handleAddNewItem = () => {
        if (!newItemData.name.trim() || !newItemData.price) return;

        const price = parseFloat(newItemData.price);

        // Add to order
        const newItem: OrderLineItem = {
            id: `item-${Date.now()}`,
            type: newItemType,
            name: newItemData.name,
            description: newItemData.description,
            quantity: 1,
            unitPrice: price,
            total: price
        };
        onItemsChange([...items, newItem]);

        // Also add to database
        if (newItemType === 'product' && onAddNewProduct) {
            onAddNewProduct({
                name: newItemData.name,
                sku: `SKU-${Date.now()}`,
                quantity: 0,
                location: '',
                minQuantity: 0,
                unit: newItemData.unit,
                category: 'geral',
                price: price
            });
        } else if (newItemType === 'service' && onAddNewService) {
            onAddNewService({
                name: newItemData.name,
                description: newItemData.description,
                category: 'servico',
                price: price,
                unit: newItemData.unit,
                active: true
            });
        }

        setNewItemData({ name: '', description: '', price: '', unit: 'un' });
        setShowNewItemForm(false);
    };

    const totalValue = items.reduce((sum, item) => sum + item.total, 0);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Produtos e Serviços
                </label>
                <button
                    type="button"
                    onClick={() => setShowNewItemForm(true)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Criar novo
                </button>
            </div>

            {/* Search Box */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        placeholder="Buscar produto ou serviço..."
                    />
                </div>

                {/* Dropdown */}
                {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {filteredItems.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                Nenhum item encontrado
                                <button
                                    type="button"
                                    onClick={() => { setShowNewItemForm(true); setShowDropdown(false); }}
                                    className="block mx-auto mt-2 text-primary hover:underline"
                                >
                                    Criar novo item
                                </button>
                            </div>
                        ) : (
                            <>
                                {filteredItems.map(item => (
                                    <button
                                        key={`${item.type}-${item.id}`}
                                        type="button"
                                        onClick={() => addItem(item)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg ${item.type === 'product' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                                            {item.type === 'product' ? (
                                                <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            ) : (
                                                <Wrench className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {item.type === 'product' ? 'Produto' : 'Serviço'}
                                                {item.inStock !== null && ` • ${item.inStock} em estoque`}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-primary">{formatCurrency(item.price)}</span>
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setShowDropdown(false)}
                                    className="w-full p-2 text-xs text-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
                                >
                                    Fechar
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Items */}
            {items.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">Qtd</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">Preço</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">Total</th>
                                <th className="px-2 py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {items.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            {item.type === 'product' ? (
                                                <Package className="w-4 h-4 text-blue-500" />
                                            ) : (
                                                <Wrench className="w-4 h-4 text-green-500" />
                                            )}
                                            <span className="text-gray-900 dark:text-white">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItemQuantity(idx, parseInt(e.target.value) || 0)}
                                            className="w-16 h-8 text-center rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.unitPrice}
                                            onChange={(e) => updateItemPrice(idx, parseFloat(e.target.value) || 0)}
                                            className="w-20 h-8 text-right rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                        />
                                    </td>
                                    <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(item.total)}
                                    </td>
                                    <td className="px-2 py-2">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <td colSpan={3} className="px-3 py-3 text-right font-bold text-gray-700 dark:text-gray-300">
                                    Total da OS:
                                </td>
                                <td className="px-3 py-3 text-right font-bold text-lg text-primary">
                                    {formatCurrency(totalValue)}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* New Item Form Modal */}
            {showNewItemForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Criar Novo Item</h3>
                            <button type="button" onClick={() => setShowNewItemForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNewItemType('product')}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${newItemType === 'product' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                                >
                                    <Package className="w-4 h-4 inline mr-2" /> Produto
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewItemType('service')}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${newItemType === 'service' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                                >
                                    <Wrench className="w-4 h-4 inline mr-2" /> Serviço
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={newItemData.name}
                                    onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                    placeholder="Ex: Câmera de Segurança HD"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                                <input
                                    type="text"
                                    value={newItemData.description}
                                    onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                    placeholder="Descrição opcional"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newItemData.price}
                                        onChange={(e) => setNewItemData({ ...newItemData, price: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidade</label>
                                    <select
                                        value={newItemData.unit}
                                        onChange={(e) => setNewItemData({ ...newItemData, unit: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                    >
                                        <option value="un">Unidade</option>
                                        <option value="hora">Hora</option>
                                        <option value="m">Metro</option>
                                        <option value="m²">Metro²</option>
                                        <option value="kg">Kg</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewItemForm(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddNewItem}
                                    disabled={!newItemData.name.trim() || !newItemData.price}
                                    className="flex-1 py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderItemSelector;
