import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreHorizontal, Search } from 'lucide-react';
import { Badge } from '../../components/Badge';

const contracts = [
  { id: 1, client: 'InnovateTech Soluções', service: 'Manutenção de TI', value: 'R$ 1.200,00', period: 'Mensal', nextBilling: '01/08/2024', status: 'Ativo' },
  { id: 2, client: 'DataCorp Analytics', service: 'Licença de Software', value: 'R$ 850,00', period: 'Mensal', nextBilling: '15/07/2024', status: 'Ativo' },
  { id: 3, client: 'Marketing Criativo Ltda.', service: 'Gestão de Redes', value: 'R$ 2.500,00', period: 'Mensal', nextBilling: '10/08/2024', status: 'Suspenso' },
  { id: 4, client: 'Logística Express', service: 'Rastreamento', value: 'R$ 980,00', period: 'Mensal', nextBilling: '20/07/2024', status: 'Ativo' },
  { id: 5, client: 'Consultoria Visionária', service: 'Consultoria Fin.', value: 'R$ 3.000,00', period: 'Mensal', nextBilling: '-', status: 'Encerrado' },
];

export default function ContractList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'green';
      case 'Suspenso': return 'yellow';
      case 'Encerrado': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Contratos</h1>
          <p className="text-sm text-slate-500">Gerencie assinaturas e serviços recorrentes.</p>
        </div>
        <Link 
          to="/contracts/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 shadow-sm transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" />
          Novo Contrato
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Pesquisar por cliente ou tipo de serviço..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Cobrança</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{contract.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contract.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contract.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contract.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contract.nextBilling}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={getStatusColor(contract.status) as any}>{contract.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <Link to={`/contracts/${contract.id}`} className="text-gray-400 hover:text-primary">
                      <MoreHorizontal className="h-5 w-5 inline" />
                    </Link>
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