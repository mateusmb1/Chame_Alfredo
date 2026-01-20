import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { MessageSquare, Send, User, ShieldCheck, Wrench, Search } from 'lucide-react';

export default function ClientChat() {
    const { conversations, messages, sendMessage, technicians, orders, clients } = useApp();
    const currentClient = clients[0];

    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');

    const clientConvs = conversations.filter(c =>
        c.type === 'administrador-cliente' ||
        (c.type === 'grupo' && c.participants.includes(currentClient?.id))
    );

    const activeMessages = messages.filter(m => m.conversationId === selectedConvId);
    const selectedConv = conversations.find(c => c.id === selectedConvId);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedConvId || !newMessage.trim()) return;

        try {
            await sendMessage(selectedConvId, currentClient?.id, 'client', newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getConvName = (conv: any) => {
        if (conv.type === 'administrador-cliente') return 'Administrador Alfredo';
        // If it's a group, find the order or tech
        const techId = conv.participants.find((p: string) => p !== currentClient?.id);
        const tech = technicians.find(t => t.id === techId);
        return tech ? `Técnico: ${tech.name}` : 'Chat';
    };

    return (
        <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-80px)] flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Search & List */}
            <aside className={`w-full md:w-80 border-r border-slate-100 flex-col ${selectedConvId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900 text-lg mb-4">Conversas</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-2 space-y-1">
                    {clientConvs.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConvId(conv.id)}
                            className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${selectedConvId === conv.id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                {conv.type === 'administrador-cliente' ? <ShieldCheck className="text-primary" /> : <Wrench className="text-slate-500" />}
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="font-bold text-slate-900 text-sm truncate">{getConvName(conv)}</p>
                                <p className="text-xs text-slate-500 truncate">{conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Novo'}</p>
                            </div>
                        </button>
                    ))}
                    {clientConvs.length === 0 && (
                        <div className="p-8 text-center">
                            <MessageSquare className="mx-auto text-slate-200 mb-2" size={32} />
                            <p className="text-xs text-slate-400">Nenhuma conversa iniciada.</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Chat Area */}
            <main className={`flex-1 flex flex-col ${!selectedConvId ? 'hidden md:flex' : 'flex'}`}>
                {selectedConvId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                            <button onClick={() => setSelectedConvId(null)} className="md:hidden p-2 text-slate-400">
                                <ShieldCheck />
                            </button>
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                {selectedConv?.type === 'administrador-cliente' ? <ShieldCheck className="text-primary" /> : <Wrench className="text-slate-500" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{getConvName(selectedConv)}</h3>
                                <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-auto p-6 space-y-4 bg-slate-50/30">
                            {activeMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderType === 'client' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${msg.senderType === 'client'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 ${msg.senderType === 'client' ? 'text-primary-foreground/70' : 'text-slate-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {activeMessages.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-slate-400 text-sm">Início da conversa com {getConvName(selectedConv)}</p>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escreva sua mensagem..."
                                    className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-slate-50/50">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                            <MessageSquare className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Selecione uma conversa</h3>
                        <p className="text-slate-500 max-w-sm">Escolha uma conversa ao lado para falar com o administrador ou o técnico responsável pelo seu serviço.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
