import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Technician } from '../types/technician';
import { Order } from '../types/order';
import { useToast } from '../contexts/ToastContext';
import OrderItemSelector, { OrderLineItem } from '../components/OrderItemSelector';

interface ServicePhoto {
    id: string;
    url: string;
    caption: string;
    timestamp: string;
    type?: 'start' | 'finish';
}

interface CheckInOut {
    checkIn?: {
        timestamp: string;
        location: { lat: number; lng: number };
    };
    checkOut?: {
        timestamp: string;
        location: { lat: number; lng: number };
    };
}

const MobileOrderDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { orders, updateOrder, uploadFile, inventory, products, createQuoteFromOrder, quotes, updateQuote } = useApp();
    const { showToast } = useToast();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [photos, setPhotos] = useState<ServicePhoto[]>([]);
    const [checkInOut, setCheckInOut] = useState<CheckInOut>({});
    const [notes, setNotes] = useState('');
    const [additionalItems, setAdditionalItems] = useState<OrderLineItem[]>([]);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    useEffect(() => {
        const storedTech = localStorage.getItem('technician');
        if (!storedTech) {
            navigate('/mobile/login');
            return;
        }

        setTechnician(JSON.parse(storedTech));

        const foundOrder = orders.find(o => o.id === id);
        if (foundOrder) {
            setOrder(foundOrder);
            if (foundOrder.servicePhotos && photos.length === 0) setPhotos(foundOrder.servicePhotos);
            if (foundOrder.serviceNotes && !notes) setNotes(foundOrder.serviceNotes);
            if (foundOrder.customerSignature && !signature) setSignature(foundOrder.customerSignature);
            if (foundOrder.checkIn && !checkInOut.checkIn) {
                setCheckInOut(prev => ({ ...prev, checkIn: foundOrder.checkIn }));
            }
            if (foundOrder.checkOut && !checkInOut.checkOut) {
                setCheckInOut(prev => ({ ...prev, checkOut: foundOrder.checkOut }));
            }
            if (foundOrder.items && additionalItems.length === 0) {
                setAdditionalItems(foundOrder.items);
            }
        }
    }, [id, orders, navigate, photos.length, notes, signature, checkInOut.checkIn, checkInOut.checkOut]);

    useEffect(() => {
        if (id && order && (additionalItems.length > 0 || notes)) {
            const timer = setTimeout(() => {
                updateOrder(id, {
                    items: additionalItems,
                    serviceNotes: notes,
                    value: additionalItems.reduce((sum, item) => sum + item.total, 0)
                });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [id, additionalItems, notes, updateOrder, order]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && id && order) {
            const file = files[0];
            setIsUploadingPhoto(true);

            try {
                const publicUrl = await uploadFile(file, 'orders', `service-photos/${id}`);

                if (publicUrl) {
                    const newPhoto: ServicePhoto = {
                        id: `photo-${Date.now()}`,
                        url: publicUrl,
                        caption: '',
                        timestamp: new Date().toISOString(),
                        type: order.status === 'em_andamento' ? 'finish' : 'start'
                    };
                    const updatedPhotos = [...photos, newPhoto];
                    await updateOrder(id, { servicePhotos: updatedPhotos });
                    setPhotos(updatedPhotos);
                    showToast('success', 'Foto enviada com sucesso!');
                } else {
                    showToast('error', 'Erro ao fazer upload da foto');
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
                showToast('error', 'Erro ao processar foto');
            } finally {
                setIsUploadingPhoto(false);
            }
        }
    };

    const handleStartOrderIntegrated = async () => {
        if (!('geolocation' in navigator)) {
            showToast('error', 'Geolocalização não disponível');
            return;
        }

        setIsSaving(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const checkInData = {
                    timestamp: new Date().toISOString(),
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                };

                try {
                    if (id) {
                        await updateOrder(id, {
                            checkIn: checkInData,
                            status: 'em_andamento',
                            servicePhotos: photos || [],
                            serviceNotes: notes || ''
                        });
                        setCheckInOut(prev => ({ ...prev, checkIn: checkInData }));
                        showToast('success', 'Início de trabalho registrado com sucesso!');
                    }
                } catch (error) {
                    console.error('Error starting order:', error);
                    showToast('error', 'Erro ao registrar início');
                } finally {
                    setIsSaving(false);
                }
            },
            (error) => {
                setIsSaving(false);
                showToast('error', 'Erro ao obter localização. Tente novamente.');
            }
        );
    };

    const handleCompleteOrderIntegrated = async () => {
        const errors = [];
        if (!checkInOut.checkIn) errors.push('Check-in inicial não encontrado');
        if (photos.length === 0) errors.push('Adicione pelo menos uma foto');
        if (!notes.trim()) errors.push('Adicione um relatório/observação');
        if (!signature) errors.push('Assinatura do cliente é obrigatória');

        if (errors.length > 0) {
            errors.forEach(err => showToast('error', err));
            if (!signature && checkInOut.checkIn && photos.length > 0 && notes.trim()) {
                setIsSignatureModalOpen(true);
            }
            return;
        }

        if (!('geolocation' in navigator)) {
            showToast('error', 'Geolocalização não disponível');
            return;
        }

        setIsSaving(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const checkOutData = {
                    timestamp: new Date().toISOString(),
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                };

                try {
                    if (id) {
                        await updateOrder(id, {
                            status: 'concluida',
                            completedDate: new Date().toISOString(),
                            checkIn: checkInOut.checkIn,
                            checkOut: checkOutData,
                            servicePhotos: photos,
                            serviceNotes: notes,
                            items: additionalItems,
                            value: additionalItems.reduce((sum, item) => sum + item.total, 0),
                            customerSignature: signature || undefined
                        });
                        showToast('success', 'Serviço finalizado com sucesso!');
                        setTimeout(() => navigate('/mobile/dashboard'), 1500);
                    }
                } catch (error) {
                    console.error('Error completing order:', error);
                    showToast('error', 'Erro ao finalizar serviço');
                } finally {
                    setIsSaving(false);
                }
            },
            (error) => {
                setIsSaving(false);
                showToast('error', 'Erro ao obter localização para o check-out');
            }
        );
    };

    const handleShareOrder = () => {
        if (!order) return;
        const total = additionalItems.reduce((sum, item) => sum + item.total, 0);
        let itemsText = additionalItems.map(i => `${i.quantity}x ${i.name} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(i.total)}`).join('%0A');
        const message = `*Ordem de Serviço #${order.id}*%0A%0A*Cliente:* ${order.clientName}%0A*Serviço:* ${order.serviceType}%0A%0A*Itens Adicionais:*%0A${itemsText}%0A%0A*Total Estimado:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}%0A%0A_Aguardamos sua aprovação para execução._`;
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSaveSignature = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !id) return;
        setIsSaving(true);
        try {
            const dataUrl = canvas.toDataURL();
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], `signature-${id}.png`, { type: 'image/png' });
            const publicUrl = await uploadFile(file, 'orders', `signatures/${id}`);
            if (publicUrl) {
                await updateOrder(id, { customerSignature: publicUrl });
                if (order?.quoteId) {
                    await updateQuote(order.quoteId, { signatureData: publicUrl, status: 'approved' });
                }
                setSignature(publicUrl);
                setIsSignatureModalOpen(false);
                showToast('success', 'Assinatura salva com sucesso!');
            } else {
                showToast('error', 'Erro ao salvar arquivo de assinatura');
            }
        } catch (error) {
            console.error('Error saving signature:', error);
            showToast('error', 'Erro ao processar assinatura');
        } finally {
            setIsSaving(false);
        }
    };

    if (!order || !technician) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-[#1e293b] text-white p-4 sticky top-0 z-10 shadow-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all active:scale-90"
                    >
                        <span className="material-symbols-outlined text-white">arrow_back</span>
                    </button>
                    <div className="flex-1">
                        <p className="text-[#F97316] text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Detalhes da OS</p>
                        <h1 className="text-lg font-black tracking-tight leading-none">#{order.id.substring(0, 8)}</h1>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Order Information Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Cliente</span>
                            <h2 className="font-black text-gray-900 text-lg leading-tight">{order.clientName}</h2>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.priority === 'urgente' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                            {order.priority}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl">
                            <span className="material-symbols-outlined text-gray-400 mt-0.5">bolt</span>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{order.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-wider">{order.serviceType}</span>
                        </div>
                    </div>
                </div>

                {/* Workflow Progress */}
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className={`h-2 flex-1 rounded-full ${order.status === 'em_andamento' ? 'bg-[#F97316]' : order.status === 'concluida' ? 'bg-[#F97316]' : 'bg-gray-200'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${order.status === 'concluida' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>

                {/* Unified Workflow State Machine */}
                {(order.status === 'nova' || order.status === 'pendente') ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <TrendingUp className="w-16 h-16" />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] shrink-0">
                                <span className="material-symbols-outlined font-black">login</span>
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">Passo 1: Preparação</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Registre o início e fotos do local</p>
                            </div>
                        </div>

                        {/* Initial Photos */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#F97316]">add_a_photo</span>
                                    Evidências de Início
                                </h3>
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {photos.filter(p => !p.type || p.type === 'start').map(photo => (
                                        <div key={photo.id} className="aspect-square rounded-[1.25rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                                            <img src={photo.url} alt="Início" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {isUploadingPhoto && (
                                        <div className="aspect-square rounded-[1.25rem] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 animate-pulse">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#F97316] border-t-transparent" />
                                        </div>
                                    )}
                                </div>
                                <label className="flex items-center justify-center gap-3 w-full py-4 bg-[#F97316] text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer">
                                    <span className="material-symbols-outlined">camera_hint</span>
                                    <span>TIRAR FOTO DO LOCAL</span>
                                    <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Initial Notes */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#1e293b]">edit_note</span>
                                Diagnóstico Inicial
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full rounded-[1.25rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium focus:ring-4 focus:ring-orange-500/5 outline-none transition-all placeholder:text-gray-400"
                                placeholder="Relate as condições iniciais..."
                            />
                        </div>

                        <button
                            onClick={handleStartOrderIntegrated}
                            disabled={isSaving}
                            className="w-full h-16 bg-[#1e293b] text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-lg uppercase tracking-widest border-b-4 border-gray-950 active:border-b-0"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                            ) : (
                                <span className="material-symbols-outlined font-black">play_arrow</span>
                            )}
                            REGISTRAR CHECK-IN
                        </button>
                    </div>
                ) : order.status === 'em_andamento' ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                                <span className="material-symbols-outlined font-black">task_alt</span>
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">Passo 2: Finalização</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Relate o feito e colha a assinatura</p>
                            </div>
                        </div>

                        {additionalItems.length > 0 && !signature && (
                            <div className="bg-orange-50/50 border border-orange-200 rounded-3xl p-6 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0">
                                        <span className="material-symbols-outlined text-sm font-black">priority_high</span>
                                    </div>
                                    <p className="text-sm font-black text-orange-800 uppercase tracking-tight">Autorização Pendente</p>
                                </div>
                                <p className="text-xs text-orange-700 font-medium leading-relaxed">Existem itens adicionais. Colha a assinatura para autorizar os novos valores.</p>
                            </div>
                        )}

                        {/* Final Photos */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-600">photo_library</span>
                                    Evidências Finais
                                </h3>
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {photos.filter(p => p.type === 'finish').map(photo => (
                                        <div key={photo.id} className="aspect-square rounded-[1.25rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                                            <img src={photo.url} alt="Final" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {isUploadingPhoto && (
                                        <div className="aspect-square rounded-[1.25rem] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 animate-pulse">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent" />
                                        </div>
                                    )}
                                </div>
                                <label className="flex items-center justify-center gap-3 w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-lg shadow-green-500/20 active:scale-95 transition-all cursor-pointer">
                                    <span className="material-symbols-outlined">camera_enhance</span>
                                    <span>FOTO DO SERVIÇO PRONTO</span>
                                    <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Report */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#1e293b]">description</span>
                                Relatório da Execução
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full rounded-[1.25rem] border border-gray-100 bg-gray-50 p-4 text-sm font-medium focus:ring-4 focus:ring-green-500/5 outline-none transition-all placeholder:text-gray-400"
                                placeholder="Relate o que foi feito detalhadamente..."
                            />
                        </div>

                        {/* Materials/Services List */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">shopping_bag</span>
                                Materiais e Serviços
                            </h3>
                            <OrderItemSelector
                                items={additionalItems}
                                onItemsChange={setAdditionalItems}
                                inventory={inventory}
                                productsServices={products}
                            />
                        </div>

                        {/* Validation & Signature */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                            {signature ? (
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                        <span className="material-symbols-outlined text-4xl font-black">verified</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-gray-900 uppercase tracking-tight">Assinatura Capturada</p>
                                        <button onClick={() => setIsSignatureModalOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-[#F97316] mt-1 underline">Mudar assinatura</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1.5 h-6 bg-[#F97316] rounded-full"></div>
                                        <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter">Validação do Cliente</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={handleShareOrder}
                                            className="h-16 bg-white border-2 border-gray-100 text-[#1e293b] font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-sm uppercase tracking-widest shadow-sm"
                                        >
                                            <span className="material-symbols-outlined">share</span>
                                            WhatsApp
                                        </button>
                                        <button
                                            onClick={() => setIsSignatureModalOpen(true)}
                                            className="h-16 bg-[#F97316] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                                        >
                                            <span className="material-symbols-outlined">gesture</span>
                                            Assinar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleCompleteOrderIntegrated}
                            disabled={isSaving}
                            className="w-full h-20 bg-green-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xl uppercase tracking-widest border-b-[6px] border-green-800 active:border-b-0 mb-8"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
                            ) : (
                                <span className="material-symbols-outlined text-3xl font-black">check_circle</span>
                            )}
                            Finalizar Ordem
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 pb-10">
                        <div className="bg-green-600 rounded-[2.5rem] shadow-xl p-8 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <TrendingUp className="w-64 h-64 -translate-y-20 -translate-x-20" />
                            </div>
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 backdrop-blur-md border border-white/30">
                                <span className="material-symbols-outlined text-4xl font-black">verified</span>
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-1 relative z-10">Serviço Concluído</h2>
                            <p className="text-xs text-white/80 font-bold uppercase tracking-widest relative z-10">Finalizado em {order.completedDate && new Date(order.completedDate).toLocaleDateString()}</p>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-400">
                                <span className="material-symbols-outlined text-primary text-sm">analytics</span>
                                Relatório Final
                            </h3>
                            <div className="bg-gray-50 p-5 rounded-2xl text-sm text-gray-700 font-medium leading-relaxed italic border-l-4 border-primary">
                                {order.serviceNotes || 'Nenhuma observação extra registrada.'}
                            </div>
                        </div>

                        {additionalItems.length > 0 && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-gray-400">Materiais e Serviços</h3>
                                <div className="space-y-3">
                                    {additionalItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-sm font-bold text-gray-600">{item.quantity}x {item.name}</span>
                                            <span className="font-black text-gray-900">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="pt-4 flex justify-between items-center text-lg">
                                        <span className="font-black text-gray-900 uppercase tracking-tighter">Total Final:</span>
                                        <span className="font-black text-[#F97316]">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                                additionalItems.reduce((sum, item) => sum + item.total, 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {order.customerSignature && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center">
                                <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-gray-400">Assinatura do Cliente</h3>
                                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200">
                                    <img src={order.customerSignature} alt="Assinatura" className="max-h-32 mx-auto mix-blend-multiply" />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/mobile/dashboard')}
                            className="w-full h-16 bg-[#1e293b] text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm"
                        >
                            Voltar para o Painel
                        </button>
                    </div>
                )}
            </div>

            {/* Signature Modal Overlay */}
            {isSignatureModalOpen && (
                <div className="fixed inset-0 bg-[#1e293b]/95 flex items-end sm:items-center justify-center z-[100] p-4 animate-in fade-in slide-in-from-bottom duration-300 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-2">Assinatura Digital</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide leading-tight max-w-[250px]">
                                    Autorizo a execução e estou ciente dos materiais aplicados.
                                </p>
                            </div>
                            <button onClick={() => setIsSignatureModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Budget Summary in Modal */}
                        {additionalItems.length > 0 && (
                            <div className="mb-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Resumo Financeiro</h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto mb-4 pr-2">
                                    {additionalItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs">
                                            <span className="font-bold text-gray-600">{item.quantity}x {item.name}</span>
                                            <span className="font-black text-gray-900">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="font-black text-gray-900 text-xs uppercase">Valor a Aprovar</span>
                                    <span className="text-lg font-black text-[#F97316]">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                            additionalItems.reduce((sum, item) => sum + item.total, 0)
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-100 border-x-2 border-t-2 border-b-4 border-gray-300 rounded-[2rem] overflow-hidden mb-8 relative h-64 touch-none shadow-inner">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full cursor-crosshair"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={endDrawing}
                                onMouseLeave={endDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={endDrawing}
                            />
                            <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-400 font-bold uppercase pointer-events-none tracking-widest">Assine dentro do quadro</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={clearSignature}
                                className="h-16 bg-gray-50 text-gray-500 font-black rounded-2xl active:scale-95 transition-all uppercase text-xs tracking-widest"
                            >
                                Limpar
                            </button>
                            <button
                                onClick={handleSaveSignature}
                                disabled={isSaving}
                                className="h-16 bg-[#F97316] text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all uppercase text-xs tracking-widest border-b-4 border-orange-800 active:border-b-0"
                            >
                                {isSaving ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto" />
                                ) : (
                                    'Confirmar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileOrderDetail;
