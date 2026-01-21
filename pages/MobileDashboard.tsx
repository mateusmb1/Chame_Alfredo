import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Technician } from '../types/technician';
import { Order } from '../types/order';
import { useToast } from '../contexts/ToastContext';

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
        showToast('success', 'Logout realizado com sucesso');
        navigate('/mobile/login');
    };

    const handleStartOrder = (orderId: string) => {
        updateOrder(orderId, { status: 'em_andamento' });
        showToast('success', 'Ordem iniciada!');
    };

    const handleCompleteOrder = (orderId: string) => {
        updateOrder(orderId, { status: 'concluida' });
        showToast('success', 'Ordem concluída!');
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgente': return 'bg-red-500';
            case 'alta': return 'bg-orange-500';
            case 'normal': return 'bg-blue-500';
            case 'baixa': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'urgente': return 'Urgente';
            case 'alta': return 'Alta';
            case 'normal': return 'Normal';
            case 'baixa': return 'Baixa';
            default: return priority;
        }
    };

    if (!technician) {
        return null;
    }

    const filteredOrders = getFilteredOrders();
    const activeCount = myOrders.filter(o => o.status === 'em_andamento').length;
    const pendingCount = myOrders.filter(o => o.status === 'nova' || o.status === 'pendente').length;
    const completedCount = myOrders.filter(o => o.status === 'concluida').length;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner flex items-center justify-center overflow-hidden border border-white/30">
                            {companyProfile?.logo_url ? (
                                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                            ) : (
                                <span className="material-symbols-outlined text-3xl text-white">person</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black leading-tight">{technician.name}</h1>
                            <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{technician.specialization[0]}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        title="Sair"
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold">{activeCount}</div>
                        <div className="text-xs text-white/80">Em Andamento</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <div className="text-xs text-white/80">Pendentes</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold">{completedCount}</div>
                        <div className="text-xs text-white/80">Concluídas</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 -mt-4 mb-4">
                <div className="bg-white rounded-xl shadow-md p-1 flex gap-1">
                    <button
                        onClick={() => setSelectedTab('active')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${selectedTab === 'active'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Ativas
                    </button>
                    <button
                        onClick={() => setSelectedTab('pending')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${selectedTab === 'pending'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setSelectedTab('completed')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${selectedTab === 'completed'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Concluídas
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className="px-4 space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">inbox</span>
                        <p className="text-gray-500">Nenhuma ordem encontrada</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-primary">
                            {/* Order Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-900">#{order.id}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getPriorityColor(order.priority)}`}>
                                            {getPriorityLabel(order.priority)}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{order.clientName}</h3>
                                    <p className="text-sm text-gray-600">{order.serviceType}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{order.description}</p>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {order.status === 'nova' && (
                                    <button
                                        onClick={() => handleStartOrder(order.id)}
                                        className="flex-1 h-10 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                                        <span>Iniciar</span>
                                    </button>
                                )}
                                {order.status === 'em_andamento' && (
                                    <button
                                        onClick={() => handleCompleteOrder(order.id)}
                                        className="flex-1 h-10 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        <span>Concluir</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate(`/mobile/order/${order.id}`)}
                                    className="h-10 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                    <span>Detalhes</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Buttons */}
            <div className="fixed bottom-20 right-4 flex flex-col gap-3 z-50">
                <button
                    onClick={() => navigate('/mobile/order/new')}
                    className="w-14 h-14 bg-gradient-to-r from-blue-600 to-primary text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                    title="Nova Ordem de Serviço"
                >
                    <span className="material-symbols-outlined text-2xl">add</span>
                </button>
                <button
                    onClick={() => navigate('/mobile/chat')}
                    className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                    title="Chat"
                >
                    <span className="material-symbols-outlined text-2xl">chat</span>
                </button>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex justify-around items-center h-16 px-4">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        className="flex flex-col items-center gap-1 text-primary"
                    >
                        <span className="material-symbols-outlined text-2xl">home</span>
                        <span className="text-xs font-medium">Início</span>
                    </button>
                    <button
                        onClick={() => navigate('/mobile/chat')}
                        className="flex flex-col items-center gap-1 text-gray-400 relative"
                    >
                        <span className="material-symbols-outlined text-2xl">chat</span>
                        <span className="text-xs font-medium">Chat</span>
                        <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button
                        onClick={() => navigate('/mobile/agenda')}
                        className="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span className="material-symbols-outlined text-2xl">calendar_month</span>
                        <span className="text-xs font-medium">Agenda</span>
                    </button>
                    <button
                        onClick={() => navigate('/mobile/notifications')}
                        className="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                        <span className="text-xs font-medium">Avisos</span>
                    </button>
                    <button
                        onClick={() => navigate('/mobile/profile')}
                        className="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span className="material-symbols-outlined text-2xl">person</span>
                        <span className="text-xs font-medium">Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileDashboard;
