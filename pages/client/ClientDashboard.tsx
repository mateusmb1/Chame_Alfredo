import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { FileText, Receipt, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
    const { orders, quotes, invoices, clients } = useApp();

    // For demo, we assume the first client is the logged-in one if none specific
    // In real implementation, this would come from an auth context
    const currentClient = clients[0];

    const clientOrders = orders.filter(o => o.clientId === currentClient?.id);
    const pendingQuotes = quotes.filter(q => q.clientId === currentClient?.id && q.status === 'sent');
    const unpaidInvoices = invoices.filter(i => i.clientId === currentClient?.id && i.status === 'pending');

    const stats = [
        { label: 'Ordens em Aberto', value: clientOrders.filter(o => o.status !== 'concluida').length, icon: <Wrench className="text-blue-600" />, color: 'bg-blue-50' },
        { label: 'Orçamentos Pendentes', value: pendingQuotes.length, icon: <FileText className="text-orange-600" />, color: 'bg-orange-50' },
        { label: 'Faturas em Aberto', value: unpaidInvoices.length, icon: <Receipt className="text-red-600" />, color: 'bg-red-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 leading-tight">Olá, {currentClient?.name}!</h1>
                <p className="text-slate-500 mt-1">Bem-vindo ao seu portal Alfredo. Veja o que está acontecendo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`${stat.color} p-6 rounded-2xl border border-white/50 shadow-sm flex items-center justify-between`}>
                        <div>
                            <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl shadow-sm">
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg">Últimos Serviços</h3>
                        <Link to="/client/orders" className="text-primary text-sm font-bold flex items-center gap-1"> Ver todos <ArrowRight size={14} /></Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {clientOrders.slice(0, 5).map(order => (
                            <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between px-6">
                                <div>
                                    <p className="font-bold text-slate-900">{order.serviceType}</p>
                                    <p className="text-xs text-slate-500">{new Date(order.scheduledDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${order.status === 'concluida' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                        {clientOrders.length === 0 && (
                            <p className="p-10 text-center text-slate-400 italic">Nenhum serviço registrado ainda.</p>
                        )}
                    </div>
                </div>

                {/* Pending Invoices */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg">Aguardando Pagamento</h3>
                        <Link to="/client/invoices" className="text-primary text-sm font-bold flex items-center gap-1"> Ver faturas <ArrowRight size={14} /></Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {unpaidInvoices.map(invoice => (
                            <div key={invoice.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between px-6">
                                <div>
                                    <p className="font-bold text-slate-900">{invoice.invoiceNumber || invoice.id.substring(0, 8)}</p>
                                    <p className="text-xs text-red-500 font-medium">Vence em {new Date(invoice.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">R$ {invoice.total.toLocaleString()}</p>
                                    <button className="text-[10px] font-bold text-primary underline">Pagar via PIX</button>
                                </div>
                            </div>
                        ))}
                        {unpaidInvoices.length === 0 && (
                            <p className="p-10 text-center text-slate-400 italic">Tudo em dia! Nenhuma fatura pendente.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
