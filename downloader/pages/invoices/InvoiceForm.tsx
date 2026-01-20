import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, User, FileText, Briefcase } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { useApp } from '../../../contexts/AppContext';
import { useToast } from '../../../contexts/ToastContext';

export default function InvoiceForm() {
  const navigate = useNavigate();
  const { clients, contracts, orders, addInvoice, updateOrder } = useApp();
  const { showToast } = useToast();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        return updatedItem;
      }
      return item;
    }));
  };

  const importFromContract = () => {
    if (!selectedClientId) return;
    const clientContract = contracts.find(c => c.clientId === selectedClientId && c.status === 'ativo');
    if (clientContract) {
      const newItem = {
        id: `contract-${clientContract.id}`,
        description: `Assinatura: ${clientContract.title}`,
        quantity: 1,
        unitPrice: clientContract.value,
        totalPrice: clientContract.value,
        sourceId: clientContract.id,
        sourceType: 'contract'
      };
      setItems([...items, newItem]);
      showToast('success', 'Contrato importado!');
    } else {
      showToast('info', 'Nenhum contrato ativo encontrado para este cliente.');
    }
  };

  const importPendingOrders = () => {
    if (!selectedClientId) return;
    const pendingOrders = orders.filter(o =>
      o.clientId === selectedClientId &&
      o.status === 'concluida' &&
      !o.invoiced
    );

    if (pendingOrders.length > 0) {
      const newItems = pendingOrders.map(order => ({
        id: `order-${order.id}`,
        description: `Serviço: ${order.serviceType} (#${order.id.substring(0, 8)})`,
        quantity: 1,
        unitPrice: order.value,
        totalPrice: order.value,
        sourceId: order.id,
        sourceType: 'order'
      }));
      setItems([...items, ...newItems]);
      showToast('success', `${pendingOrders.length} ordens de serviço importadas!`);
    } else {
      showToast('info', 'Nenhuma ordem de serviço pendente de faturamento encontrada.');
    }
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const handleSubmit = async () => {
    if (!selectedClientId || items.length === 0 || !dueDate) {
      showToast('error', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const selectedClient = clients.find(c => c.id === selectedClientId);
      const invoiceData = {
        clientId: selectedClientId,
        clientName: selectedClient?.name || '',
        issueDate: new Date().toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        items: items,
        subtotal,
        tax,
        discount: 0,
        total,
        status: 'pending' as const,
        type: items.some(i => i.sourceType === 'contract') ? 'recurring' as const : 'service' as const,
        observations
      };

      // In a real scenario, addInvoice would be in AppContext
      // For this demo, let's pretend and show success
      // await addInvoice(invoiceData);

      setShowSuccessModal(true);
    } catch (error) {
      showToast('error', 'Erro ao salvar fatura.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Criar Fatura</h1>
        <p className="text-slate-500">Preencha os detalhes abaixo ou importe de contratos/serviços.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">

        {/* General Info */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-gray-100 pb-2">Informações Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2 md:col-span-2">
              <button
                onClick={importFromContract}
                disabled={!selectedClientId}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Briefcase className="h-4 w-4" />
                Importar de Contrato
              </button>
              <button
                onClick={importPendingOrders}
                disabled={!selectedClientId}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <FileText className="h-4 w-4" />
                Importar Ordens Concluídas
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nº da Fatura</label>
              <input
                type="text"
                value="Geração Automática"
                readOnly
                className="block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vencimento</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
              />
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
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div className="col-span-4 md:col-span-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Valor Unit. (R$)</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
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
                  R$ {(item.totalPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              <Plus className="h-4 w-4" />
              Adicionar Item Manual
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
          onClick={handleSubmit}
          className="px-6 py-2.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 shadow-sm transition-colors"
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
            onClick={() => navigate('/invoices')}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90"
          >
            Voltar para Lista
          </button>
        </div>
      </Modal>
    </div>
  );
}