import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Technician } from '../contexts/AppContext';

interface Message {
    id: string;
    sender: 'technician' | 'admin';
    senderName: string;
    message: string;
    timestamp: string;
    read: boolean;
}

const MobileChat: React.FC = () => {
    const navigate = useNavigate();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const storedTech = localStorage.getItem('technician');
        if (!storedTech) {
            navigate('/mobile/login');
            return;
        }

        setTechnician(JSON.parse(storedTech));

        // Mock messages
        const mockMessages: Message[] = [
            {
                id: '1',
                sender: 'admin',
                senderName: 'Administração',
                message: 'Olá! Como está o andamento da OS-002?',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                read: true
            },
            {
                id: '2',
                sender: 'technician',
                senderName: 'Você',
                message: 'Boa tarde! A instalação está 80% concluída. Devo finalizar ainda hoje.',
                timestamp: new Date(Date.now() - 3000000).toISOString(),
                read: true
            },
            {
                id: '3',
                sender: 'admin',
                senderName: 'Administração',
                message: 'Ótimo! O cliente pediu para instalar uma câmera adicional. Você tem o equipamento?',
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                read: true
            },
            {
                id: '4',
                sender: 'technician',
                senderName: 'Você',
                message: 'Sim, tenho uma câmera extra no veículo. Vou incluir na instalação.',
                timestamp: new Date(Date.now() - 900000).toISOString(),
                read: true
            }
        ];

        setMessages(mockMessages);
    }, [navigate]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !technician) return;

        const message: Message = {
            id: `msg-${Date.now()}`,
            sender: 'technician',
            senderName: 'Você',
            message: newMessage,
            timestamp: new Date().toISOString(),
            read: true
        };

        setMessages([...messages, message]);
        setNewMessage('');

        // Simulate admin response after 2 seconds
        setTimeout(() => {
            const adminResponse: Message = {
                id: `msg-${Date.now()}`,
                sender: 'admin',
                senderName: 'Administração',
                message: 'Mensagem recebida! Vou atualizar o orçamento.',
                timestamp: new Date().toISOString(),
                read: false
            };
            setMessages(prev => [...prev, adminResponse]);
        }, 2000);
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    if (!technician) {
        return null;
    }

    return (
        <div class="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div class="bg-gradient-to-r from-primary to-blue-600 text-white p-4 shadow-lg">
                <div class="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        class="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div class="flex items-center gap-3 flex-1">
                        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <span class="material-symbols-outlined">support_agent</span>
                        </div>
                        <div>
                            <h1 class="text-lg font-bold">Administração</h1>
                            <p class="text-xs text-white/80">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div class="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(message => (
                    <div
                        key={message.id}
                        class={`flex ${message.sender === 'technician' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div class={`max-w-[75%] ${message.sender === 'technician' ? 'order-2' : 'order-1'}`}>
                            {message.sender === 'admin' && (
                                <p class="text-xs text-gray-500 mb-1 px-3">{message.senderName}</p>
                            )}
                            <div
                                class={`rounded-2xl px-4 py-2 ${message.sender === 'technician'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-900 rounded-bl-none shadow-md'
                                    }`}
                            >
                                <p class="text-sm">{message.message}</p>
                                <p class={`text-xs mt-1 ${message.sender === 'technician' ? 'text-white/70' : 'text-gray-500'
                                    }`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div class="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} class="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        class="flex-1 h-12 px-4 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none text-gray-900"
                        placeholder="Digite sua mensagem..."
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MobileChat;
