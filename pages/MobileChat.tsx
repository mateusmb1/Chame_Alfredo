import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../src/lib/supabase';

const MobileChat: React.FC = () => {
    const navigate = useNavigate();
    const { messages, conversations, sendMessage, getOrCreateConversation, uploadChatFile } = useApp();
    const { showToast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [technician, setTechnician] = useState<any>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
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
        const id = await getOrCreateConversation(techId);
        if (id) {
            setConversationId(id);
        }
    };

    const handleSendMessage = async (e: React.FormEvent, attachmentUrl?: string, attachmentType?: 'image' | 'file') => {
        if (e) e.preventDefault();

        if ((!newMessage.trim() && !attachmentUrl) || !technician || !conversationId) return;

        try {
            await sendMessage(conversationId, technician.id, 'technician', newMessage, attachmentUrl, attachmentType);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('error', 'Erro ao enviar mensagem');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
        const file = e.target.files?.[0];
        if (!file || !conversationId) return;

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
                                {message.attachmentUrl && (
                                    <div className="mb-2">
                                        {message.attachmentType === 'image' ? (
                                            <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                                <img src={message.attachmentUrl} alt="Anexo" className="max-w-full rounded-lg" />
                                            </a>
                                        ) : (
                                            <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-black/10 rounded-lg">
                                                <span className="material-symbols-outlined">description</span>
                                                <span className="text-xs truncate">Arquivo</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                                {message.content && <p className="text-sm">{message.content}</p>}
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
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
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
                        className="w-10 h-10 text-gray-500 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined">image</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-10 h-10 text-gray-500 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined">attach_file</span>
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={isUploading}
                        className="flex-1 h-12 px-4 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none text-gray-900 disabled:bg-gray-50"
                        placeholder={isUploading ? "Enviando..." : "Digite..."}
                    />
                    <button
                        type="submit"
                        disabled={isUploading || !newMessage.trim()}
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
