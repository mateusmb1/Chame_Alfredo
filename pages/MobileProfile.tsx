import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Technician } from '../types/technician';
import { useToast } from '../contexts/ToastContext';

const MobileProfile: React.FC = () => {
    const navigate = useNavigate();
    const { orders, companyProfile } = useApp();
    const { showToast } = useToast();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [myOrders, setMyOrders] = useState<any[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

    useEffect(() => {
        const storedTech = localStorage.getItem('technician');
        if (!storedTech) {
            navigate('/mobile/login');
            return;
        }

        const tech: Technician = JSON.parse(storedTech);
        setTechnician(tech);

        const techOrders = orders.filter(order => order.technician === tech.name);
        setMyOrders(techOrders);
    }, [orders, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('technician');
        showToast('success', 'Logout realizado com sucesso');
        navigate('/mobile/login');
    };

    if (!technician) {
        return null;
    }

    const completedOrders = myOrders.filter(o => o.status === 'concluida').length;
    const inProgressOrders = myOrders.filter(o => o.status === 'em_andamento').length;
    const pendingOrders = myOrders.filter(o => o.status === 'nova' || o.status === 'pendente').length;
    const totalOrders = myOrders.length;
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

    return (
        <div class="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div class="bg-gradient-to-r from-primary to-blue-600 text-white p-6 pb-12 rounded-b-3xl shadow-lg">
                <div class="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        class="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 class="text-lg font-bold">Meu Perfil</h1>
                    <button
                        onClick={handleLogout}
                        class="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined">logout</span>
                    </button>
                </div>

                {/* Profile Info */}
                <div class="flex flex-col items-center">
                    <div class="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm shadow-xl flex items-center justify-center mb-4 overflow-hidden border-2 border-white/40">
                        {companyProfile?.logo_url ? (
                            <img src={companyProfile.logo_url} alt="Logo" class="w-full h-full object-contain p-2" />
                        ) : (
                            <span class="material-symbols-outlined text-6xl">person</span>
                        )}
                    </div>
                    <h2 class="text-2xl font-bold mb-1">{technician.name}</h2>
                    <p class="text-white/80 mb-2">{technician.email}</p>
                    <div class="flex flex-wrap gap-2 justify-center">
                        {technician.specialization.map(spec => (
                            <span key={spec} class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                                {spec}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div class="px-4 -mt-6 space-y-4">
                {/* Stats Card */}
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">analytics</span>
                        Estatísticas
                    </h3>

                    {/* Completion Rate */}
                    <div class="mb-6">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700">Taxa de Conclusão</span>
                            <span class="text-2xl font-bold text-primary">{completionRate}%</span>
                        </div>
                        <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                class="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div class="text-3xl font-bold text-green-700 mb-1">{completedOrders}</div>
                            <div class="text-xs text-green-600 font-medium">Concluídas</div>
                        </div>
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div class="text-3xl font-bold text-blue-700 mb-1">{inProgressOrders}</div>
                            <div class="text-xs text-blue-600 font-medium">Em Andamento</div>
                        </div>
                        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                            <div class="text-3xl font-bold text-orange-700 mb-1">{pendingOrders}</div>
                            <div class="text-xs text-orange-600 font-medium">Pendentes</div>
                        </div>
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <div class="text-3xl font-bold text-purple-700 mb-1">{totalOrders}</div>
                            <div class="text-xs text-purple-600 font-medium">Total</div>
                        </div>
                    </div>
                </div>

                {/* Reports */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">assessment</span>
                        Relatórios
                    </h3>

                    {/* Period Selector */}
                    <div class="flex gap-2 mb-4">
                        <button
                            onClick={() => setSelectedPeriod('week')}
                            class={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${selectedPeriod === 'week'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('month')}
                            class={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${selectedPeriod === 'month'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Mês
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('year')}
                            class={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${selectedPeriod === 'year'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Ano
                        </button>
                    </div>

                    {/* Report Items */}
                    <div class="space-y-3">
                        <button class="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-primary">description</span>
                                <div class="text-left">
                                    <div class="font-semibold text-gray-900">Relatório de Serviços</div>
                                    <div class="text-xs text-gray-500">Detalhamento de todas as OS</div>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-gray-400">download</span>
                        </button>

                        <button class="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-primary">schedule</span>
                                <div class="text-left">
                                    <div class="font-semibold text-gray-900">Horas Trabalhadas</div>
                                    <div class="text-xs text-gray-500">Registro de check-in/check-out</div>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-gray-400">download</span>
                        </button>

                        <button class="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-primary">star</span>
                                <div class="text-left">
                                    <div class="font-semibold text-gray-900">Avaliações</div>
                                    <div class="text-xs text-gray-500">Feedback dos clientes</div>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-gray-400">download</span>
                        </button>
                    </div>
                </div>

                {/* Settings */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">settings</span>
                        Configurações
                    </h3>

                    <div class="space-y-3">
                        <button class="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-gray-600">notifications</span>
                                <span class="font-medium text-gray-900">Notificações</span>
                            </div>
                            <span class="material-symbols-outlined text-gray-400">chevron_right</span>
                        </button>

                        <button class="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-gray-600">lock</span>
                                <span class="font-medium text-gray-900">Alterar Senha</span>
                            </div>
                            <span class="material-symbols-outlined text-gray-400">chevron_right</span>
                        </button>

                        <button
                            onClick={() => navigate('/mobile/chat')}
                            class="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-gray-600">chat</span>
                                <span class="font-medium text-gray-900">Chat com Administração</span>
                            </div>
                            <span class="material-symbols-outlined text-gray-400">chevron_right</span>
                        </button>

                        <button class="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-gray-600">help</span>
                                <span class="font-medium text-gray-900">Ajuda e Suporte</span>
                            </div>
                            <span class="material-symbols-outlined text-gray-400">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* App Info */}
                <div class="text-center py-4">
                    <p class="text-sm text-gray-500">Chame Alfredo Mobile v1.0.0</p>
                    <p class="text-xs text-gray-400 mt-1">© 2024 Todos os direitos reservados</p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div class="flex justify-around items-center h-16 px-4">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        class="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span class="material-symbols-outlined text-2xl">home</span>
                        <span class="text-xs font-medium">Início</span>
                    </button>
                    <button
                        onClick={() => navigate('/mobile/agenda')}
                        class="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span class="material-symbols-outlined text-2xl">calendar_month</span>
                        <span class="text-xs font-medium">Agenda</span>
                    </button>
                    <button
                        onClick={() => navigate('/mobile/notifications')}
                        class="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span class="material-symbols-outlined text-2xl">notifications</span>
                        <span class="text-xs font-medium">Avisos</span>
                    </button>
                    <button class="flex flex-col items-center gap-1 text-primary">
                        <span class="material-symbols-outlined text-2xl">person</span>
                        <span class="text-xs font-medium">Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileProfile;
