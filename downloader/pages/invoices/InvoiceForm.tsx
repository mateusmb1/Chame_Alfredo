import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, User } from 'lucide-react';
import { Modal } from '../../components/Modal';

export default function InvoiceForm() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [items, setItems] = useState([
    { id: 1, description: 'Desenvolvimento de Landing Page', qty: 1, price: 1500 }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', qty: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Criar Fatura</h1>
        <p className="text-slate-500">Preencha os detalhes abaixo para gerar uma nova fatura.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
        
        {/* General Info */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-gray-100 pb-2">Informações Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
              <select className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5">
                <option>Selecione um cliente</option>
                <option>Tech Solutions Inc.</option>
                <option>Global Web Services</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nº da Fatura</label>
              <input 
                type="text" 
                value="AUTO-2024-00123" 
                readOnly 
                className="block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 text-gray-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Emissão</label>
                <input 
                  type="date" 
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vencimento</label>
                <input 
                  type="date" 
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Invoice Items */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-gray-100 pb-2">Itens da Fatura</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Descrição</label>
                  <input 
                    type="text" 
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Qtd.</label>
                  <input 
                    type="number" 
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div className="col-span-4 md:col-span-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Valor Unit. (R$)</label>
                  <input 
                    type="number" 
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div className="col-span-3 md:col-span-1 flex justify-center pb-2">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="col-span-12 md:col-span-1 text-right font-medium text-slate-900">
                  R$ {(item.qty * item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
            
            <button 
              onClick={addItem}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-700"
            >
              <Plus className="h-4 w-4" />
              Adicionar Item
            </button>
          </div>
        </section>

        {/* Totals */}
        <section className="flex justify-end pt-4 border-t border-gray-100">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Impostos (5%)</span>
              <span>R$ {tax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </section>

      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button 
          onClick={() => navigate('/invoices')}
          className="px-6 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={() => setShowSuccessModal(true)}
          className="px-6 py-2.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-700 shadow-sm transition-colors"
        >
          Salvar e Enviar
        </button>
      </div>

      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Fatura Criada com Sucesso!"
        type="success"
      >
        <p className="text-gray-600 mb-6">A fatura foi gerada e salva no sistema. O que deseja fazer agora?</p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/invoices/INV-2024-00123/preview')}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-700"
          >
            Visualizar Fatura
          </button>
          <button 
            onClick={() => navigate('/invoices')}
            className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          >
            Voltar para Lista
          </button>
        </div>
      </Modal>
    </div>
  );
}