import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Technician } from '../types/technician';
import { Order } from '../types/order';
import { useToast } from '../contexts/ToastContext';
import { TrendingUp, LogOut, ChevronRight, Inbox } from 'lucide-react';

const MobileDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { orders, updateOrder, companyProfile } = useApp();
    const { showToast } = useToast();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [myOrders, setMyOrders] = useState<Order[]>([]);
    const [selectedTab, setSelectedTab] = useState<'active' | 'pending' | 'completed'>('active');

    useEffect(() => {
        const storedTech = localStorage.getItem('technician');
        if (!storedTech) {
            navigate('/mobile/login');
            return;
        }

        const tech: Technician = JSON.parse(storedTech);
        setTechnician(tech);

        const techOrders = orders.filter(order => order.technicianId === tech.id);
        setMyOrders(techOrders);
    }, [orders, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('technician');
        showToast('success', 'Tchau! Até a próxima.');
        navigate('/mobile/login');
    };

    const getFilteredOrders = () => {
        switch (selectedTab) {
            case 'active':
                return myOrders.filter(o => o.status === 'em_andamento');
            case 'pending':
                return myOrders.filter(o => o.status === 'nova' || o.status === 'pendente');
            case 'completed':
                return myOrders.filter(o => o.status === 'concluida');
            default:
                return myOrders;
        }
    };

    if (!technician) return null;

    const filteredOrders = getFilteredOrders();
    const activeCount = myOrders.filter(o => o.status === 'em_andamento').length;
    const pendingCount = myOrders.filter(o => o.status === 'nova' || o.status === 'pendente').length;
    const completedCount = myOrders.filter(o => o.status === 'concluida').length;

    return (
        <div className="min-h-screen bg-gray-50 pb-28">
            {/* Premium Header */}
            <div className="bg-[#1e293b] text-white p-6 pb-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <TrendingUp className="w-48 h-48 -rotate-12 translate-x-10 -translate-y-10" />
                </div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl shadow-inner flex items-center justify-center overflow-hidden border border-white/20 p-1">
                            {companyProfile?.logo_url ? (
                                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <img src="/alfredo.png" alt="Alfredo" className="w-full h-full object-contain" />
                            )}
                        </div>
                        <div>
                            <p className="text-[#F97316] text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1.5">Bem-vindo, Alfredo</p>
                            <h1 className="text-xl font-black leading-tight tracking-tighter">{technician.name}</h1>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 active:bg-red-500 active:text-white transition-all active:scale-95"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="flex items-center justify-between relative z-10 bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 shadow-inner">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Em curso</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-orange-500 ${activeCount > 0 ? 'animate-pulse' : 'opacity-20'}`}></div>
                            <span className="text-2xl font-black tracking-tighter">{activeCount}</span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Novas</span>
                        <span className="text-2xl font-black tracking-tighter">{pendingCount}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Mês</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-black tracking-tighter">{completedCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Premium Tabs */}
            <div className="px-6 -mt-8 mb-6 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-1.5 flex gap-1 border border-gray-100/50">
                    {(['active', 'pending', 'completed'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedTab === tab
                                    ? 'bg-[#1e293b] text-white shadow-lg shadow-gray-400/20'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab === 'active' ? 'Ativas' : tab === 'pending' ? 'Novas' : 'Feitas'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Feed */}
            <div className="px-6 space-y-4">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-1">
                    {selectedTab === 'active' ? 'Execução em tempo real' : selectedTab === 'pending' ? 'Ordens aguardando início' : 'Histórico de finalizadas'}
                </h2>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Inbox className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Tudo limpo por aqui</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <button
                            key={order.id}
                            onClick={() => navigate(`/mobile/order/${order.id}`)}
                            className="w-full text-left bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-4 active:scale-[0.98] transition-all hover:bg-gray-50/50"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${order.priority === 'urgente' ? 'bg-red-500 shadow-red-200' : 'bg-blue-500 shadow-blue-200'} shadow-lg`}></div>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">OS #{order.id.split('-')[0]}</span>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-[#F97316] bg-orange-50 px-2 py-1 rounded-md">
                                    {order.priority}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-gray-900 leading-tight tracking-tighter mb-1 uppercase">{order.clientName}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-gray-400">home_repair_service</span>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{order.serviceType}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400 font-bold">schedule</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acessar Processo</span>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Bottom Floating Status Bar */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <div className="bg-[#1e293b] text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1 text-white/50">Status Operacional</p>
                            <p className="text-xs font-black uppercase tracking-widest text-white">Online & Disponível</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-2 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">GPS OK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileDashboard;
