import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../src/lib/supabase';

interface Technician {
    id: string;
    name: string;
    phone: string;
}

interface Notification {
    id: string;
    type: 'new_order' | 'order_update' | 'message' | 'system';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    orderId?: string;
}

const MobileNotifications: React.FC = () => {
    const navigate = useNavigate();
    const { orders } = useApp();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        const storedTech = localStorage.getItem('technician');
        if (!storedTech) {
            navigate('/mobile/login');
            return;
        }

        const tech = JSON.parse(storedTech);
        setTechnician(tech);

        // Fetch real notifications from Supabase
        fetchNotifications(tech.id);

        // Subscribe to real-time updates
        const channel = supabase
            .channel('notifications_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `technician_id=eq.${tech.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    const newNotif: Notification = {
                        id: payload.new.id,
                        type: payload.new.type,
                        title: payload.new.title,
                        message: payload.new.message,
                        timestamp: payload.new.created_at,
                        read: payload.new.read,
                        orderId: payload.new.order_id
                    };
                    setNotifications(prev => [newNotif, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setNotifications(prev => prev.map(n =>
                        n.id === payload.new.id
                            ? { ...n, read: payload.new.read }
                            : n
                    ));
                } else if (payload.eventType === 'DELETE') {
                    setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [navigate]);

    const fetchNotifications = async (techId: string) => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('technician_id', techId)
            .order('created_at', { ascending: false });

        if (data && !error) {
            setNotifications(data.map(n => ({
                id: n.id,
                type: n.type,
                title: n.title,
                message: n.message,
                timestamp: n.created_at,
                read: n.read,
                orderId: n.order_id
            })));
        }
    };

    const markAsRead = async (notificationId: string) => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);
    };

    const markAllAsRead = async () => {
        if (!technician) return;

        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('technician_id', technician.id);

        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = async (notificationId: string) => {
        await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);

        if (notification.orderId) {
            navigate(`/mobile/order/${notification.orderId}`);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'new_order': return 'assignment';
            case 'order_update': return 'update';
            case 'message': return 'message';
            case 'system': return 'info';
            default: return 'notifications';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'new_order': return 'bg-blue-500';
            case 'order_update': return 'bg-orange-500';
            case 'message': return 'bg-purple-500';
            case 'system': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Agora';
        if (minutes < 60) return `${minutes}m atrás`;
        if (hours < 24) return `${hours}h atrás`;
        return `${days}d atrás`;
    };

    if (!technician) {
        return null;
    }

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold">Notificações</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-white/80">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors"
                        >
                            Marcar todas
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'all'
                            ? 'bg-white text-primary'
                            : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                    >
                        Todas ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'unread'
                            ? 'bg-white text-primary'
                            : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                    >
                        Não Lidas ({unreadCount})
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="p-4 space-y-3">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">notifications_off</span>
                        <p className="text-gray-500">Nenhuma notificação</p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`bg-white rounded-xl shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${!notification.read ? 'border-l-4 border-primary' : ''
                                }`}
                        >
                            <div className="flex gap-3">
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                                    <span className="material-symbols-outlined text-white text-xl">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {formatTimestamp(notification.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                                    {!notification.read && (
                                        <div className="mt-2">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                Nova
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                    }}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                                >
                                    <span className="material-symbols-outlined text-gray-400 text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex justify-around items-center h-16 px-4">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        className="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span className="material-symbols-outlined text-2xl">home</span>
                        <span className="text-xs font-medium">Início</span>
                    </button>
                    <button
                        onClick={() => navigate('/mobile/agenda')}
                        className="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <span className="material-symbols-outlined text-2xl">calendar_month</span>
                        <span className="text-xs font-medium">Agenda</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-primary relative">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                        <span className="text-xs font-medium">Avisos</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
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

export default MobileNotifications;
