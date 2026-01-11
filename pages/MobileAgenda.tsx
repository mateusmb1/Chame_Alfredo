import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Technician, Order } from '../contexts/AppContext';

const MobileAgenda: React.FC = () => {
    const navigate = useNavigate();
    const { orders } = useApp();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [myOrders, setMyOrders] = useState<Order[]>([]);

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

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const getOrdersForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return myOrders.filter(order => order.createdAt === dateStr);
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setSelectedDate(newDate);
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
    const monthName = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const todayOrders = getOrdersForDate(selectedDate);

    if (!technician) {
        return null;
    }

    return (
        <div class="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div class="bg-gradient-to-r from-primary to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
                <div class="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        class="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 class="text-lg font-bold">Minha Agenda</h1>
                </div>

                {/* Month Navigation */}
                <div class="flex items-center justify-between">
                    <button
                        onClick={() => changeMonth(-1)}
                        class="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h2 class="text-lg font-semibold capitalize">{monthName}</h2>
                    <button
                        onClick={() => changeMonth(1)}
                        class="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div class="p-4 space-y-4">
                {/* Calendar */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    {/* Weekday Headers */}
                    <div class="grid grid-cols-7 gap-2 mb-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                            <div key={day} class="text-center text-xs font-semibold text-gray-600">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div class="grid grid-cols-7 gap-2">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} class="aspect-square" />
                        ))}

                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                            const dateStr = date.toISOString().split('T')[0];
                            const ordersOnDay = myOrders.filter(order => order.createdAt === dateStr);
                            const isToday = date.toDateString() === new Date().toDateString();
                            const isSelected = date.toDateString() === selectedDate.toDateString();

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(date)}
                                    class={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition-all ${isSelected
                                            ? 'bg-primary text-white shadow-lg scale-105'
                                            : isToday
                                                ? 'bg-blue-100 text-primary'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <span>{day}</span>
                                    {ordersOnDay.length > 0 && (
                                        <div class={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-primary'
                                            }`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Orders for Selected Date */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">event</span>
                        Ordens para {selectedDate.toLocaleDateString('pt-BR')}
                    </h3>

                    {todayOrders.length === 0 ? (
                        <div class="text-center py-8">
                            <span class="material-symbols-outlined text-6xl text-gray-300 mb-2">event_available</span>
                            <p class="text-gray-500">Nenhuma ordem agendada</p>
                        </div>
                    ) : (
                        <div class="space-y-3">
                            {todayOrders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => navigate(`/mobile/order/${order.id}`)}
                                    class="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors cursor-pointer"
                                >
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="flex-1">
                                            <span class="font-bold text-gray-900">#{order.id}</span>
                                            <h4 class="font-semibold text-gray-900">{order.clientName}</h4>
                                            <p class="text-sm text-gray-600">{order.serviceType}</p>
                                        </div>
                                        <span class={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'concluida'
                                                ? 'bg-green-100 text-green-700'
                                                : order.status === 'em_andamento'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.status === 'concluida' ? 'Concluída' : order.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md p-4 text-white">
                    <h3 class="font-bold mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined">analytics</span>
                        Resumo do Mês
                    </h3>
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div class="text-2xl font-bold">{myOrders.filter(o => o.status === 'concluida').length}</div>
                            <div class="text-xs">Concluídas</div>
                        </div>
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div class="text-2xl font-bold">{myOrders.filter(o => o.status === 'em_andamento').length}</div>
                            <div class="text-xs">Em Andamento</div>
                        </div>
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div class="text-2xl font-bold">{myOrders.filter(o => o.status === 'nova').length}</div>
                            <div class="text-xs">Pendentes</div>
                        </div>
                    </div>
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
                    <button class="flex flex-col items-center gap-1 text-primary">
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
                    <button
                        onClick={() => navigate('/mobile/profile')}
                        class="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span class="material-symbols-outlined text-2xl">person</span>
                        <span class="text-xs font-medium">Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileAgenda;
