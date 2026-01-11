import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, PlayCircle, PlusCircle, AlertTriangle, FileText } from 'lucide-react';
import { Badge } from '../../components/Badge';

export default function ContractDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <Link to="/contracts" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Contrato #12345</h1>
            <Badge color="green">Ativo</Badge>
          </div>
          <p className="mt-1 text-slate-500 ml-9">Detalhes completos do serviço recorrente.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50">
            Suspender
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100">
            Encerrar Contrato
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-700">
            Editar Contrato
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Invoice History */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-900">Histórico de Faturas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Data</th>
                    <th className="px-6 py-3 font-medium">Valor</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">#FAT-2024-007</td>
                    <td className="px-6 py-4 text-slate-600">15/07/2024</td>
                    <td className="px-6 py-4 text-slate-600">R$ 250,00</td>
                    <td className="px-6 py-4"><Badge color="green">Pago</Badge></td>
                    <td className="px-6 py-4 text-right"><Link to="#" className="text-primary hover:underline">Ver</Link></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">#FAT-2024-006</td>
                    <td className="px-6 py-4 text-slate-600">15/06/2024</td>
                    <td className="px-6 py-4 text-slate-600">R$ 250,00</td>
                    <td className="px-6 py-4"><Badge color="green">Pago</Badge></td>
                    <td className="px-6 py-4 text-right"><Link to="#" className="text-primary hover:underline">Ver</Link></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">#FAT-2024-005</td>
                    <td className="px-6 py-4 text-slate-600">15/05/2024</td>
                    <td className="px-6 py-4 text-slate-600">R$ 250,00</td>
                    <td className="px-6 py-4"><Badge color="red">Atrasado</Badge></td>
                    <td className="px-6 py-4 text-right"><Link to="#" className="text-primary hover:underline">Ver</Link></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Histórico de Atividades</h2>
            <div className="space-y-6">
              {[
                { icon: Edit, text: 'Valor alterado de R$ 200 para R$ 250', date: '20/04/2024 - 11:30' },
                { icon: PlayCircle, text: 'Contrato ativado', date: '15/01/2024 - 09:00' },
                { icon: PlusCircle, text: 'Contrato criado', date: '14/01/2024 - 18:21' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    {idx !== 2 && <div className="h-full w-px bg-gray-200 my-1"></div>}
                  </div>
                  <div>
                    <p className="text-sm text-slate-900">{item.text}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           {/* Client Card */}
           <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Cliente</h2>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                  IS
                </div>
                <div>
                  <p className="font-bold text-slate-900">Inovatech Soluções</p>
                  <Link to="#" className="text-sm text-primary hover:underline">Ver Perfil</Link>
                </div>
              </div>
           </section>

           {/* Contract Specs */}
           <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Dados do Contrato</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Serviço</span>
                  <span className="font-medium text-slate-900">Manutenção de TI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valor</span>
                  <span className="font-medium text-slate-900">R$ 250,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cobrança</span>
                  <span className="font-medium text-slate-900">Mensal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Início</span>
                  <span className="font-medium text-slate-900">15/01/2024</span>
                </div>
                 <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Próx. Fatura</span>
                  <span className="font-bold text-primary">15/08/2024</span>
                </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}