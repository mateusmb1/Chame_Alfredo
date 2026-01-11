import React from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: 1, name: 'Instalação de Ar Condicionado', desc: 'Serviço completo', price: 'R$ 450,00', type: 'Serviço', stock: null },
  { id: 2, name: 'Filtro de Ar Universal', desc: 'Para modelos Split 9000 BTUs', price: 'R$ 75,90', type: 'Produto', stock: 112 },
  { id: 3, name: 'Manutenção Preventiva', desc: 'Limpeza e verificação', price: 'R$ 180,00', type: 'Serviço', stock: null },
  { id: 4, name: 'Tubo de Cobre 1/4"', desc: 'Metro', price: 'R$ 22,50', type: 'Produto', stock: 350 },
];

export default function ProductList() {
    const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Produtos e Serviços</h1>
          <button 
             onClick={() => navigate('/products/new')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
          >
            <Plus className="h-5 w-5" />
            Adicionar Novo
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou descrição..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-slate-700 hover:bg-gray-50">
               Filtrar Tipo
               <Filter className="h-4 w-4" />
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Preço</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estoque</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600">{item.price}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge color={item.type === 'Serviço' ? 'blue' : 'green'}>{item.type}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {item.stock !== null ? `${item.stock} un.` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-primary"><Edit className="h-4 w-4" /></button>
                      <button className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Side Panel (Mocking a selection) */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Filtro de Ar Universal</h2>
            <p className="text-sm text-gray-500">ID: #PROD-789456</p>
          </div>
          
          <div className="flex gap-2 mb-6">
            <Badge color="green">Produto</Badge>
            <Badge color="gray">Peças</Badge>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Preço Unitário</span>
               <span className="font-semibold text-slate-900">R$ 75,90</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Estoque</span>
               <span className="font-semibold text-slate-900">112 unidades</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">SKU</span>
               <span className="font-semibold text-slate-900">AC-FLT-U9000</span>
             </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-slate-900 mb-2">Descrição</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Filtro de ar de alta eficiência compatível com a maioria dos modelos de ar condicionado Split de 9000 a 12000 BTUs.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700">Editar Produto</button>
            <button className="w-full py-2 bg-white border border-gray-300 text-red-600 rounded-lg font-medium hover:bg-red-50">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
}