import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/Modal';

export default function ProductForm() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [type, setType] = useState('produto');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Adicionar Novo Produto/Serviço</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Item</label>
            <input type="text" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="Ex: Instalação de Ar Condicionado" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada</label>
            <textarea className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" rows={4} placeholder="Descreva os detalhes..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`border rounded-lg p-4 cursor-pointer transition-all ${type === 'servico' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-300 hover:border-gray-400'}`}>
                <input type="radio" name="type" className="text-primary focus:ring-primary" checked={type === 'servico'} onChange={() => setType('servico')} />
                <span className="ml-2 font-medium text-slate-900">Serviço</span>
              </label>
              <label className={`border rounded-lg p-4 cursor-pointer transition-all ${type === 'produto' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-300 hover:border-gray-400'}`}>
                <input type="radio" name="type" className="text-primary focus:ring-primary" checked={type === 'produto'} onChange={() => setType('produto')} />
                <span className="ml-2 font-medium text-slate-900">Produto</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço Unitário</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">R$</span>
                <input type="text" className="w-full rounded-lg border-gray-300 pl-10 focus:ring-primary focus:border-primary" placeholder="0,00" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
              <select className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                <option>Unidade</option>
                <option>Hora</option>
                <option>Metro</option>
                <option>Kg</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stock Details (Conditional) */}
        {type === 'produto' && (
          <div className="border-t border-gray-100 pt-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Detalhes do Estoque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input type="text" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="Ex: 8493-ABC" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
                <input type="text" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="Ex: Corredor A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estoque Inicial</label>
                <input type="number" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estoque Mínimo</label>
                <input type="number" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="5" />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button 
             onClick={() => setShowSuccess(true)}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700"
          >
            Salvar
          </button>
        </div>
      </div>

      <Modal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Produto/Serviço salvo com sucesso!"
        type="success"
      >
        <p className="text-gray-600 mb-6">O novo item foi adicionado ao seu inventário.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/products')} className="w-full py-2 bg-primary text-white rounded-lg font-medium">Ver Item</button>
          <button onClick={() => { setShowSuccess(false); window.location.reload(); }} className="w-full py-2 border border-gray-300 rounded-lg text-gray-700">Adicionar Outro</button>
        </div>
      </Modal>
    </div>
  );
}