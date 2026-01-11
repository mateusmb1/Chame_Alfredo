import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Badge } from '../../components/Badge';

const invoices = [
  { id: 'INV-2024-001', client: 'Tech Solutions Inc.', issueDate: '01/08/2024', dueDate: '15/08/2024', total: 'R$ 2.500,00', status: 'Pago', type: 'Serviço' },
  { id: 'INV-2024-002', client: 'Global Web Services', issueDate: '02/08/2024', dueDate: '16/08/2024', total: 'R$ 1.200,00', status: 'Pendente', type: 'Recorrência' },
  { id: 'INV-2024-003', client: 'Creative Minds Agency', issueDate: '25/07/2024', dueDate: '05/08/2024', total: 'R$ 5.800,00', status: 'Atrasado', type: 'Serviço' },
  { id: 'INV-2024-004', client: 'Innovate Forward', issueDate: '05/08/2024', dueDate: '20/08/2024', total: 'R$ 750,00', status: 'Pendente', type: 'Recorrência' },
  { id: 'INV-2024-005', client: 'Data Analytics Co.', issueDate: '15/07/2024', dueDate: '30/07/2024', total: 'R$ 3.150,00', status: 'Pago', type: 'Serviço' },
];

export default function InvoiceList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'green';
      case 'Pendente': return 'yellow';
      case 'Atrasado': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Faturas</h1>
          <p className="text-sm text-slate-500">Visualize e gerencie todas as faturas emitidas.</p>
        </div>
        <Link 
          to="/invoices/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 shadow-sm transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" />
          Criar Nova Fatura
        </Link>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emissão</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{invoice.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{invoice.issueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{invoice.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={getStatusColor(invoice.status) as any}>{invoice.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/invoices/${invoice.id}`} className="text-primary hover:text-primary-800">Visualizar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}