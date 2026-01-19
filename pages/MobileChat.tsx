import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../src/lib/supabase';

const MobileChat: React.FC = () => {
    const navigate = useNavigate();
    const { messages, conversations } = useApp();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [technician, setTechnician] = useState<any>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<any[]>([]);

    useEffect(() => {
        const storedTech = localStorage.getItem('technician');
        if (!storedTech) {
            navigate('/mobile/login');
            return;
        }

        const tech = JSON.parse(storedTech);
        setTechnician(tech);

        // Find or create conversation with admin
        initializeConversation(tech.id);
    }, [navigate]);

    useEffect(() => {
        // Filter messages for current conversation
        if (conversationId) {
            const filtered = messages
                .filter(m => m.conversationId === conversationId)
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setChatMessages(filtered);

            // Auto-scroll to bottom
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [messages, conversationId]);

    const initializeConversation = async (techId: string) => {
        // Try to find existing conversation
        const existingConv = conversations.find(c =>
            c.type === 'administrador-tecnico' &&
            c.participants.includes(techId)
        );

        if (existingConv) {
            setConversationId(existingConv.id);
        } else {
            // Create new conversation
            const { data, error } = await supabase
                .from('conversations')
                .insert([{
                    type: 'administrador-tecnico',
                    participants: [techId]
                }])
                .select()
                .single();

            if (data && !error) {
                setConversationId(data.id);
            }
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !technician || !conversationId) return;

        const { error } = await supabase
            .from('messages')
            .insert([{
                conversation_id: conversationId,
                sender_id: technician.id,
                sender_type: 'technician',
                content: newMessage,
                read: false
            }]);

        if (!error) {
            setNewMessage('');

            // Update conversation last_message_at
            await supabase
                .from('conversations')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', conversationId);
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    if (!technician) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Administração</h1>
                            <p className="text-xs text-white/80">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.senderType === 'technician' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[75%] ${message.senderType === 'technician' ? 'order-2' : 'order-1'}`}>
                            {message.senderType === 'admin' && (
                                <p className="text-xs text-gray-500 mb-1 px-3">Administração</p>
                            )}
                            <div
                                className={`rounded-2xl px-4 py-2 ${message.senderType === 'technician'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white text-gray-900 rounded-bl-none shadow-md'
                                    }`}
                            >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${message.senderType === 'technician' ? 'text-white/70' : 'text-gray-500'
                                    }`}>
                                    {formatTime(message.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 h-12 px-4 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none text-gray-900"
                        placeholder="Digite sua mensagem..."
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MobileChat;
