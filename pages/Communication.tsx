import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Conversation, Message } from '../types/communication';

const Communication: React.FC = () => {
    const { clients, technicians, conversations, messages: allMessages, sendMessage, getOrCreateConversation, uploadChatFile } = useApp();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'clients' | 'team'>('team');
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [newMessage, setNewMessage] = useState('');
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const imageInputRef = React.useRef<HTMLInputElement>(null);

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

    const handleSendMessage = async (e: React.FormEvent, attachmentUrl?: string, attachmentType?: 'image' | 'file') => {
        if (e) e.preventDefault();
        if ((!newMessage.trim() && !attachmentUrl) || !selectedContact || !currentConversationId) return;

        try {
            await sendMessage(currentConversationId, '00000000-0000-0000-0000-000000000000', 'admin', newMessage, attachmentUrl, attachmentType);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('error', 'Erro ao enviar mensagem');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
        const file = e.target.files?.[0];
        if (!file || !currentConversationId) return;

        setIsUploading(true);
        try {
            const url = await uploadChatFile(file);
            if (url) {
                await handleSendMessage(null as any, url, type);
                showToast('success', 'Arquivo enviado!');
            } else {
                showToast('error', 'Erro no upload do arquivo');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showToast('error', 'Erro ao processar arquivo');
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
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
        <div className="flex h-full bg-white overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                {/* Header with Tabs */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Comunicação</h2>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab('team')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'team'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">groups</span>
                                <span>Equipe</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'clients'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">person</span>
                                <span>Clientes</span>
                            </div>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Pesquisar..."
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'team' ? (
                        // Team Members List
                        <div>
                            {technicians.map((tech) => (
                                <div
                                    key={tech.id}
                                    onClick={() => setSelectedContact(tech)}
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedContact?.id === tech.id
                                        ? 'bg-primary/10 border-l-4 border-primary'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {tech.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(tech.status)}`}></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{tech.name}</h3>
                                            <span className="text-xs text-gray-500">Agora</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tech.status === 'em_servico'
                                                ? 'bg-blue-100 text-blue-700'
                                                : tech.status === 'ativo'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {getStatusLabel(tech.status)}
                                            </span>
                                            {tech.specialization && tech.specialization.length > 0 && (
                                                <span className="text-xs text-gray-500 truncate">{tech.specialization[0]}</span>
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
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedContact?.id === client.id
                                        ? 'bg-primary/10 border-l-4 border-primary'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                        {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{client.name}</h3>
                                            <span className="text-xs text-gray-500">14:45</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">
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
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Chat Header */}
                    <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${activeTab === 'team'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                    : 'bg-gradient-to-br from-green-500 to-teal-600'
                                    }`}>
                                    {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                </div>
                                {activeTab === 'team' && (
                                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(selectedContact.status)}`}></span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{selectedContact.name}</h3>
                                {activeTab === 'team' ? (
                                    <p className="text-sm text-gray-600">
                                        {getStatusLabel(selectedContact.status)} • {selectedContact.specialization?.[0] || 'Técnico'}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-600">{selectedContact.phone}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <span className="material-symbols-outlined">call</span>
                            </button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <span className="material-symbols-outlined">videocam</span>
                            </button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-3 ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.senderType !== 'admin' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                    </div>
                                )}
                                <div className={`flex flex-col ${msg.senderType === 'admin' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-2xl max-w-md ${msg.senderType === 'admin'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.senderType !== 'admin' && (
                                            <p className="text-xs font-semibold mb-1 opacity-70">{selectedContact.name}</p>
                                        )}
                                        {msg.attachmentUrl && (
                                            <div className="mb-2">
                                                {msg.attachmentType === 'image' ? (
                                                    <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                                        <img src={msg.attachmentUrl} alt="Anexo" className="max-w-full rounded-lg shadow-sm cursor-zoom-in" />
                                                    </a>
                                                ) : (
                                                    <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors">
                                                        <span className="material-symbols-outlined">description</span>
                                                        <span className="text-xs truncate max-w-[150px]">Documento</span>
                                                        <span className="material-symbols-outlined text-sm">download</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        {msg.content && <p className="text-sm">{msg.content}</p>}
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">{formatTime(msg.createdAt)}</span>
                                </div>
                                {msg.senderType === 'admin' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        AD
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileUpload(e, 'file')}
                                className="hidden"
                            />
                            <input
                                type="file"
                                ref={imageInputRef}
                                onChange={(e) => handleFileUpload(e, 'image')}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">attach_file</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={isUploading}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">image</span>
                            </button>
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={isUploading}
                                className="flex-1 bg-gray-100 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                placeholder={isUploading ? "Enviando arquivo..." : "Digite sua mensagem..."}
                            />
                            <button type="submit" disabled={isUploading || !newMessage.trim()} className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
                                <span className="material-symbols-outlined text-xl">send</span>
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // No Contact Selected
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">chat</span>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecione uma conversa</h3>
                        <p className="text-gray-600">
                            Escolha {activeTab === 'team' ? 'um membro da equipe' : 'um cliente'} para iniciar
                        </p>
                    </div>
                </div>
            )}

            {/* Right Details Panel */}
            {selectedContact && (
                <div className="w-72 bg-white border-l border-gray-200 hidden xl:flex flex-col p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 ${activeTab === 'team'
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                            : 'bg-gradient-to-br from-green-500 to-teal-600'
                            }`}>
                            {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">{selectedContact.name}</h2>
                        {activeTab === 'team' ? (
                            <>
                                <p className="text-sm text-gray-600 mb-2">{selectedContact.specialization?.[0] || 'Técnico'}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedContact.status === 'em_servico'
                                    ? 'bg-blue-100 text-blue-700'
                                    : selectedContact.status === 'ativo'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {getStatusLabel(selectedContact.status)}
                                </span>
                            </>
                        ) : (
                            <p className="text-sm text-gray-600">
                                {selectedContact.type === 'pj' ? 'Condomínio' : 'Pessoa Física'}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Contato</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                                <span className="material-symbols-outlined text-base">mail</span>
                                <span className="truncate">{selectedContact.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="material-symbols-outlined text-base">call</span>
                                {selectedContact.phone}
                            </div>
                        </div>

                        {activeTab === 'team' && selectedContact.specialization && (
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Especializações</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedContact.specialization.map((spec: string, index: number) => (
                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'clients' && (
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Endereço</h3>
                                <p className="text-sm text-gray-700">{selectedContact.address}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Communication;