import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { BarChart3, Wrench, Receipt, Clock, ArrowUpRight } from 'lucide-react';

export default function ClientReports() {
    const { orders, invoices, clients } = useApp();
    const currentClient = clients[0];

    const clientOrders = orders.filter(o => o.clientId === currentClient?.id);
    const clientInvoices = invoices.filter(i => i.clientId === currentClient?.id);

    const totalSpent = clientInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
    const totalServices = clientOrders.filter(o => o.status === 'concluida').length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
                <p className="text-slate-500 mt-1">Visão geral de todos os serviços realizados e investimentos feitos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Investido</p>
                    <p className="text-2xl font-black text-slate-900">R$ {totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Serviços Executados</p>
                    <p className="text-2xl font-black text-slate-900">{totalServices}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Wrench className="text-primary" size={20} />
                    <h3 className="font-bold text-slate-800 text-lg">Histórico de Atividade</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4 text-left">Data</th>
                                <th className="px-6 py-4 text-left">Serviço</th>
                                <th className="px-6 py-4 text-left">Técnico</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {clientOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.scheduledDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-900">{order.serviceType}</p>
                                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{order.description}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{order.technicianName}</td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">R$ {order.value.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center text-[10px] font-black uppercase text-green-600">
                                        {order.status === 'concluida' ? 'Executado' : order.status}
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
