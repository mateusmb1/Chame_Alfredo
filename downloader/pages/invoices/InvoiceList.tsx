import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { useApp } from '../../../contexts/AppContext';
import { useToast } from '../../../contexts/ToastContext';

export default function InvoiceList() {
  const { invoices, generateMonthlyInvoices } = useApp();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Atrasado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleProcessBilling = async () => {
    if (confirm('Deseja processar o faturamento mensal para todos os contratos ativos?')) {
      setIsProcessing(true);
      try {
        const now = new Date();
        await generateMonthlyInvoices(now.getMonth() + 1, now.getFullYear());
        showToast('success', 'Faturamento mensal processado com sucesso!');
      } catch (error) {
        console.error('Error processing billing:', error);
        showToast('error', 'Erro ao processar faturamento mensal.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Faturas</h1>
          <p className="text-sm text-slate-500">Visualize e gerencie todas as faturas emitidas.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleProcessBilling}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Processar Faturamento
          </button>
          <Link
            to="/invoices/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 shadow-sm transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Criar Nova Fatura
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Buscar por ID, Cliente..."
            />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Status
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Período
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Fatura</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emissão</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    Nenhuma fatura encontrada.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{invoice.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(invoice.issueDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={getStatusColor(invoice.status) as any}>{getStatusLabel(invoice.status)}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/invoices/${invoice.id}`} className="text-primary hover:text-primary-800">Visualizar</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}