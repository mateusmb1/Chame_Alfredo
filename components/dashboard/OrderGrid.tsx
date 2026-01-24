import React from 'react';
import { Order } from '../../types/order';
import { Clock, User, HardHat, Calendar, ExternalLink, MoreVertical } from 'lucide-react';

interface OrderGridProps {
    orders: Order[];
    onOrderClick: (order: Order) => void;
    getStatusConfig: (status: string) => { color: string; label: string };
}

const OrderGrid: React.FC<OrderGridProps> = ({ orders, onOrderClick, getStatusConfig }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);

                return (
                    <div
                        key={order.id}
                        onClick={() => onOrderClick(order)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">
                                    OS #{order.id.substring(0, 8)}
                                </span>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase italic truncate max-w-[200px]">
                                    {order.clientName}
                                </h3>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusConfig.color} border border-current`}>
                                {statusConfig.label}
                            </span>
                        </div>

                        <div className="space-y-3 mb-5">
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <HardHat size={14} className="text-slate-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase text-slate-400 leading-none mb-1">Serviço</span>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase">{order.serviceType}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <User size={14} className="text-slate-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase text-slate-400 leading-none mb-1">Técnico</span>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase">{order.technicianName}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <Calendar size={14} className="text-slate-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase text-slate-400 leading-none mb-1">Previsão</span>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase">
                                        {new Date(order.scheduledDate).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase text-slate-400 leading-none mb-1">Budget</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white italic">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value)}
                                </span>
                            </div>
                            <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderGrid;
