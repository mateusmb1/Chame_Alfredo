import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    const [showMobileChat, setShowMobileChat] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Filter and sort messages
    const filteredMessages = useMemo(() => {
        if (!currentConversationId) return [];
        return allMessages
            .filter(m => m.conversationId === currentConversationId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [currentConversationId, allMessages]);

    // Group messages by date
    const groupedMessages = useMemo(() => {
        const groups: { date: string; label: string; messages: Message[] }[] = [];
        let currentDate = '';

        filteredMessages.forEach(msg => {
            const msgDate = new Date(msg.createdAt).toLocaleDateString('pt-BR');
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                const today = new Date().toLocaleDateString('pt-BR');
                const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('pt-BR');
                let label = msgDate;
                if (msgDate === today) label = 'Hoje';
                else if (msgDate === yesterday) label = 'Ontem';
                groups.push({ date: msgDate, label, messages: [msg] });
            } else {
                groups[groups.length - 1].messages.push(msg);
            }
        });
        return groups;
    }, [filteredMessages]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [filteredMessages.length]);

    useEffect(() => {
        if (selectedContact && activeTab === 'team') {
            getOrCreateConversation(selectedContact.id).then(id => {
                setCurrentConversationId(id);
            });
        } else {
            setCurrentConversationId(null);
        }
    }, [selectedContact, activeTab, getOrCreateConversation]);

    const handleSelectContact = (contact: any) => {
        setSelectedContact(contact);
        setShowMobileChat(true);
    };

    const handleBackToList = () => {
        setShowMobileChat(false);
    };

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
        <div className="flex h-full bg-white dark:bg-gray-900 overflow-hidden">
            {/* Left Sidebar - Hidden on mobile when chat is open */}
            <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                {/* Header with Tabs */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comunicação</h2>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab('team')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'team'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-lg">groups</span>
                                <span>Equipe</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'clients'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-lg">person</span>
                                <span>Clientes</span>
                            </div>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Pesquisar..."
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'team' ? (
                        <div>
                            {technicians.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-4xl mb-2">groups</span>
                                    <p>Nenhum técnico cadastrado</p>
                                </div>
                            ) : (
                                technicians.map((tech) => (
                                    <div
                                        key={tech.id}
                                        onClick={() => handleSelectContact(tech)}
                                        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedContact?.id === tech.id && showMobileChat
                                            ? 'bg-primary/10 border-l-4 border-primary'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {tech.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(tech.status)}`}></span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{tech.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tech.status === 'em_servico'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                    : tech.status === 'ativo'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                    }`}>
                                                    {getStatusLabel(tech.status)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-400 md:hidden">chevron_right</span>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div>
                            {clients.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-4xl mb-2">person</span>
                                    <p>Nenhum cliente cadastrado</p>
                                </div>
                            ) : (
                                clients.map((client) => (
                                    <div
                                        key={client.id}
                                        onClick={() => handleSelectContact(client)}
                                        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedContact?.id === client.id && showMobileChat
                                            ? 'bg-primary/10 border-l-4 border-primary'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{client.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {client.type === 'pj' ? 'Condomínio' : 'Pessoa Física'}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-400 md:hidden">chevron_right</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area - Full screen on mobile when open */}
            <div className={`flex-1 flex flex-col min-w-0 ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 md:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Back button for mobile */}
                                <button
                                    onClick={handleBackToList}
                                    className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full md:hidden"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div className="relative">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold ${activeTab === 'team'
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                        : 'bg-gradient-to-br from-green-500 to-teal-600'
                                        }`}>
                                        {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                    </div>
                                    {activeTab === 'team' && (
                                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(selectedContact.status)}`}></span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{selectedContact.name}</h3>
                                    {activeTab === 'team' ? (
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                            {getStatusLabel(selectedContact.status)}
                                        </p>
                                    ) : (
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{selectedContact.phone}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                    <span className="material-symbols-outlined text-xl">call</span>
                                </button>
                                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full hidden sm:block">
                                    <span className="material-symbols-outlined text-xl">videocam</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
                            {groupedMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-5xl mb-2">chat_bubble</span>
                                    <p>Nenhuma mensagem ainda</p>
                                    <p className="text-sm">Envie a primeira mensagem!</p>
                                </div>
                            ) : (
                                groupedMessages.map((group) => (
                                    <div key={group.date} className="space-y-4">
                                        {/* Date Separator */}
                                        <div className="flex justify-center my-4">
                                            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold rounded-full shadow-sm">
                                                {group.label}
                                            </span>
                                        </div>

                                        {group.messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex items-end gap-2 ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {msg.senderType !== 'admin' && (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1 shadow-sm">
                                                        {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                                    </div>
                                                )}
                                                <div className={`flex flex-col ${msg.senderType === 'admin' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                                                    <div className={`p-3 rounded-2xl shadow-sm ${msg.senderType === 'admin'
                                                        ? 'bg-primary text-white rounded-br-none'
                                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none'
                                                        }`}>
                                                        {msg.attachmentUrl && (
                                                            <div className="mb-2">
                                                                {msg.attachmentType === 'image' ? (
                                                                    <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                                                        <img src={msg.attachmentUrl} alt="Anexo" className="max-w-full rounded-lg shadow-sm cursor-zoom-in" />
                                                                    </a>
                                                                ) : (
                                                                    <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors">
                                                                        <span className="material-symbols-outlined">description</span>
                                                                        <span className="text-xs truncate max-w-[120px]">Documento</span>
                                                                        <span className="material-symbols-outlined text-sm">download</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                        {msg.content && <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>}
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 px-1">
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
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
                                    onClick={() => imageInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">image</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50 hidden sm:block"
                                >
                                    <span className="material-symbols-outlined">attach_file</span>
                                </button>
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={isUploading}
                                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                    placeholder={isUploading ? "Enviando..." : "Mensagem..."}
                                />
                                <button type="submit" disabled={isUploading || !newMessage.trim()} className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50">
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <div className="text-center p-8">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">chat</span>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Selecione uma conversa</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Escolha {activeTab === 'team' ? 'um membro da equipe' : 'um cliente'} para iniciar
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Details Panel - Hidden on mobile and tablets */}
            {selectedContact && (
                <div className="w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 hidden 2xl:flex flex-col p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 ${activeTab === 'team'
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                            : 'bg-gradient-to-br from-green-500 to-teal-600'
                            }`}>
                            {selectedContact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedContact.name}</h2>
                        {activeTab === 'team' ? (
                            <>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedContact.specialization?.[0] || 'Técnico'}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedContact.status === 'em_servico'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : selectedContact.status === 'ativo'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                    {getStatusLabel(selectedContact.status)}
                                </span>
                            </>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedContact.type === 'pj' ? 'Condomínio' : 'Pessoa Física'}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Contato</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                                <span className="material-symbols-outlined text-base">mail</span>
                                <span className="truncate">{selectedContact.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <span className="material-symbols-outlined text-base">call</span>
                                {selectedContact.phone}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Communication;