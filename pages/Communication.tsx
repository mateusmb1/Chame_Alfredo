import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Conversation, Message } from '../types/communication';

const Communication: React.FC = () => {
    const { clients, technicians, conversations, messages: allMessages, sendMessage, getOrCreateConversation } = useApp();
    const [activeTab, setActiveTab] = useState<'clients' | 'team'>('team');
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [newMessage, setNewMessage] = useState('');
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

    const filteredMessages = currentConversationId
        ? allMessages.filter(m => m.conversationId === currentConversationId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        : [];
    React.useEffect(() => {
        if (selectedContact && activeTab === 'team') {
            getOrCreateConversation(selectedContact.id).then(id => {
                setCurrentConversationId(id);
            });
        } else {
            setCurrentConversationId(null);
        }
    }, [selectedContact, activeTab, getOrCreateConversation]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact || !currentConversationId) return;

        try {
            await sendMessage(currentConversationId, 'admin-id', 'admin', newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ativo': return 'bg-green-500';
            case 'em_servico': return 'bg-blue-500';
            case 'inativo': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ativo': return 'Disponível';
            case 'em_servico': return 'Em Campo';
            case 'inativo': return 'Offline';
            default: return status;
        }
    };

    return (
        <div class="flex h-full bg-white overflow-hidden">
            {/* Left Sidebar */}
            <div class="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                {/* Header with Tabs */}
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Comunicação</h2>

                    {/* Tabs */}
                    <div class="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab('team')}
                            class={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'team'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div class="flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-lg">groups</span>
                                <span>Equipe</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('clients')}
                            class={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'clients'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div class="flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-lg">person</span>
                                <span>Clientes</span>
                            </div>
                        </button>
                    </div>

                    {/* Search */}
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            class="w-full h-10 pl-10 pr-4 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Pesquisar..."
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div class="flex-1 overflow-y-auto">
                    {activeTab === 'team' ? (
                        // Team Members List
                        <div>
                            {technicians.map((tech) => (
                                <div
                                    key={tech.id}
                                    onClick={() => setSelectedContact(tech)}
                                    class={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedContact?.id === tech.id
                                        ? 'bg-primary/10 border-l-4 border-primary'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <div class="relative">
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {tech.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <span class={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(tech.status)}`}></span>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center mb-1">
                                            <h3 class="text-sm font-semibold text-gray-900 truncate">{tech.name}</h3>
                                            <span class="text-xs text-gray-500">Agora</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class={`px-2 py-0.5 rounded-full text-xs font-semibold ${tech.status === 'em_servico'
                                                ? 'bg-blue-100 text-blue-700'
                                                : tech.status === 'ativo'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {getStatusLabel(tech.status)}
                                            </span>
                                            {tech.specialization && tech.specialization.length > 0 && (
                                                <span class="text-xs text-gray-500 truncate">{tech.specialization[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Clients List
                        <div>
                            {clients.map((client) => (
                                <div
                                    key={client.id}
                                    onClick={() => setSelectedContact(client)}
                                    class={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedContact?.id === client.id
                                        ? 'bg-primary/10 border-l-4 border-primary'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                        {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center mb-1">
                                            <h3 class="text-sm font-semibold text-gray-900 truncate">{client.name}</h3>
                                            <span class="text-xs text-gray-500">14:45</span>
                                        </div>
                                        <p class="text-xs text-gray-500 truncate">
                                            {client.type === 'pj' ? 'Condomínio' : 'Pessoa Física'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            {selectedContact ? (
                <div class="flex-1 flex flex-col min-w-0">
                    {/* Chat Header */}
                    <div class="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <div class={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${activeTab === 'team'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                    : 'bg-gradient-to-br from-green-500 to-teal-600'
                                    }`}>
                                    {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                </div>
                                {activeTab === 'team' && (
                                    <span class={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(selectedContact.status)}`}></span>
                                )}
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-gray-900">{selectedContact.name}</h3>
                                {activeTab === 'team' ? (
                                    <p class="text-sm text-gray-600">
                                        {getStatusLabel(selectedContact.status)} • {selectedContact.specialization?.[0] || 'Técnico'}
                                    </p>
                                ) : (
                                    <p class="text-sm text-gray-600">{selectedContact.phone}</p>
                                )}
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <span class="material-symbols-outlined">call</span>
                            </button>
                            <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <span class="material-symbols-outlined">videocam</span>
                            </button>
                            <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <span class="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                class={`flex items-start gap-3 ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.senderType !== 'admin' && (
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                    </div>
                                )}
                                <div class={`flex flex-col ${msg.senderType === 'admin' ? 'items-end' : 'items-start'}`}>
                                    <div class={`p-3 rounded-2xl max-w-md ${msg.senderType === 'admin'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.senderType !== 'admin' && (
                                            <p class="text-xs font-semibold mb-1 opacity-70">{selectedContact.name}</p>
                                        )}
                                        <p class="text-sm">{msg.content}</p>
                                    </div>
                                    <span class="text-xs text-gray-500 mt-1">{formatTime(msg.createdAt)}</span>
                                </div>
                                {msg.senderType === 'admin' && (
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        AD
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} class="p-4 bg-white border-t border-gray-200">
                        <div class="flex items-center gap-2">
                            <button type="button" class="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <span class="material-symbols-outlined">attach_file</span>
                            </button>
                            <button type="button" class="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <span class="material-symbols-outlined">image</span>
                            </button>
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                class="flex-1 bg-gray-100 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Digite sua mensagem..."
                            />
                            <button type="submit" class="p-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                                <span class="material-symbols-outlined text-xl">send</span>
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // No Contact Selected
                <div class="flex-1 flex items-center justify-center bg-gray-50">
                    <div class="text-center">
                        <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">chat</span>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Selecione uma conversa</h3>
                        <p class="text-gray-600">
                            Escolha {activeTab === 'team' ? 'um membro da equipe' : 'um cliente'} para iniciar
                        </p>
                    </div>
                </div>
            )}

            {/* Right Details Panel */}
            {selectedContact && (
                <div class="w-72 bg-white border-l border-gray-200 hidden xl:flex flex-col p-6">
                    <div class="flex flex-col items-center text-center mb-6">
                        <div class={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 ${activeTab === 'team'
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                            : 'bg-gradient-to-br from-green-500 to-teal-600'
                            }`}>
                            {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <h2 class="text-lg font-bold text-gray-900">{selectedContact.name}</h2>
                        {activeTab === 'team' ? (
                            <>
                                <p class="text-sm text-gray-600 mb-2">{selectedContact.specialization?.[0] || 'Técnico'}</p>
                                <span class={`px-3 py-1 rounded-full text-xs font-semibold ${selectedContact.status === 'em_servico'
                                    ? 'bg-blue-100 text-blue-700'
                                    : selectedContact.status === 'ativo'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {getStatusLabel(selectedContact.status)}
                                </span>
                            </>
                        ) : (
                            <p class="text-sm text-gray-600">
                                {selectedContact.type === 'pj' ? 'Condomínio' : 'Pessoa Física'}
                            </p>
                        )}
                    </div>

                    <div class="space-y-4">
                        <div>
                            <h3 class="text-xs font-semibold text-gray-500 uppercase mb-2">Contato</h3>
                            <div class="flex items-center gap-2 text-sm text-gray-700 mb-2">
                                <span class="material-symbols-outlined text-base">mail</span>
                                <span class="truncate">{selectedContact.email}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-700">
                                <span class="material-symbols-outlined text-base">call</span>
                                {selectedContact.phone}
                            </div>
                        </div>

                        {activeTab === 'team' && selectedContact.specialization && (
                            <div class="pt-4 border-t border-gray-200">
                                <h3 class="text-xs font-semibold text-gray-500 uppercase mb-3">Especializações</h3>
                                <div class="flex flex-wrap gap-2">
                                    {selectedContact.specialization.map((spec: string, index: number) => (
                                        <span key={index} class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'clients' && (
                            <div class="pt-4 border-t border-gray-200">
                                <h3 class="text-xs font-semibold text-gray-500 uppercase mb-3">Endereço</h3>
                                <p class="text-sm text-gray-700">{selectedContact.address}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Communication;