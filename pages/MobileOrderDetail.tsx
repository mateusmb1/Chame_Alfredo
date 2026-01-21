import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const { orders, updateOrder, uploadFile, inventory, products } = useApp();
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
            // Load existing data if local state is empty
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

    // Auto-save items and notes when they change
    useEffect(() => {
        if (id && order && (additionalItems.length > 0 || notes)) {
            const timer = setTimeout(() => {
                updateOrder(id, {
                    items: additionalItems,
                    serviceNotes: notes,
                    value: additionalItems.reduce((sum, item) => sum + item.total, 0)
                });
            }, 1000); // Debounce saves
            return () => clearTimeout(timer);
        }
    }, [id, additionalItems, notes, updateOrder, order]);


    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && id) {
            const file = files[0];
            setIsUploadingPhoto(true);

            try {
                const publicUrl = await uploadFile(file, 'orders', `service-photos/${id}`);

                if (publicUrl) {
                    const newPhoto: ServicePhoto = {
                        id: `photo-${Date.now()}`,
                        url: publicUrl,
                        caption: '',
                        timestamp: new Date().toISOString()
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
            // Convert dataUrl to File to upload to Storage
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], `signature-${id}.png`, { type: 'image/png' });

            const publicUrl = await uploadFile(file, 'orders', `signatures/${id}`);

            if (publicUrl) {
                await updateOrder(id, { customerSignature: publicUrl });
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


    if (!order || !technician) {
        return null;
    }

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold">Ordem #{order.id}</h1>
                        <p className="text-sm text-white/80">{order.clientName}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Order Information Card */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">description</span>
                        Resumo do Pedido
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">{order.description}</p>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600 uppercase tracking-wider">{order.serviceType}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${order.priority === 'urgente' ? 'bg-red-100 text-red-600' :
                            order.priority === 'alta' ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>{order.priority}</span>
                    </div>
                </div>

                {/* Unified Workflow State Machine */}
                {(order.status === 'nova' || order.status === 'pendente') ? (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <h2 className="font-bold text-blue-800 flex items-center gap-2">
                                <span className="material-symbols-outlined">login</span>
                                PASSO 1: Dando Início
                            </h2>
                            <p className="text-xs text-blue-600 mt-1">Registre fotos do local e uma observação de como o serviço está começando.</p>
                        </div>

                        {/* Initial Photos section */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_a_photo</span>
                                Fotos do Início
                            </h3>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {photos.map(photo => (
                                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                        <img src={photo.url} alt="Início" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-primary font-bold rounded-lg border-2 border-dashed border-primary cursor-pointer active:bg-blue-100 transition-colors">
                                {isUploadingPhoto ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-white" />
                                ) : (
                                    <span className="material-symbols-outlined">camera_enhance</span>
                                )}
                                <span>{isUploadingPhoto ? 'Enviando...' : 'Tirar Foto do Início'}</span>
                                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                            </label>
                        </div>

                        {/* Initial Notes section */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                Texto de Início
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Descreva o início (ex: 'Dando início dos trabalhos com...')"
                            />
                        </div>

                        <button
                            onClick={handleStartOrderIntegrated}
                            disabled={isSaving}
                            className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-lg"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                            ) : (
                                <span className="material-symbols-outlined">play_circle</span>
                            )}
                            Fazer Check-in e Iniciar
                        </button>
                    </div>
                ) : order.status === 'em_andamento' ? (
                    <div className="space-y-4">
                        {additionalItems.length > 0 && !signature && (
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                                <h2 className="font-bold text-orange-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined">pending_actions</span>
                                    Aguardando Aprovação
                                </h2>
                                <p className="text-xs text-orange-600 mt-1">
                                    Existem itens adicionais neste orçamento. Colha a assinatura do cliente para autorizar a execução.
                                </p>
                            </div>
                        )}
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <h2 className="font-bold text-green-800 flex items-center gap-2">
                                <span className="material-symbols-outlined">task_alt</span>
                                PASSO 2: Finalizando Trabalho
                            </h2>
                            <p className="text-xs text-green-600 mt-1">Adicione as fotos finais, o relatório do que foi feito e colha a assinatura do cliente.</p>
                        </div>

                        {/* Photos during/finish */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
                                Fotos do Serviço / Final
                            </h3>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {photos.map(photo => (
                                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                        <img src={photo.url} alt="Serviço" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full py-3 bg-green-50 text-green-700 font-bold rounded-lg border-2 border-dashed border-green-400 cursor-pointer active:bg-green-100 transition-colors">
                                {isUploadingPhoto ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-700 border-t-white" />
                                ) : (
                                    <span className="material-symbols-outlined">camera_enhance</span>
                                )}
                                <span>{isUploadingPhoto ? 'Enviando...' : 'Adicionar Mais Fotos'}</span>
                                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                            </label>
                        </div>

                        {/* Relay notes during finish */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">rate_review</span>
                                Relatório Final / Observações
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                placeholder="Relate o que foi feito (ex: 'Finalizado com ajuste de...')"
                            />
                        </div>

                        {/* Produtos e Serviços */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <OrderItemSelector
                                items={additionalItems}
                                onItemsChange={setAdditionalItems}
                                inventory={inventory}
                                productsServices={products}
                            />
                        </div>

                        {/* Signature section */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">draw</span>
                                Assinatura do Cliente
                            </h3>
                            {signature ? (
                                <div className="bg-green-100 border border-green-300 rounded-xl p-4 flex items-center justify-center gap-3 text-green-800">
                                    <span className="material-symbols-outlined text-3xl">verified</span>
                                    <div>
                                        <p className="font-bold">Assinatura Coletada</p>
                                        <button onClick={() => setIsSignatureModalOpen(true)} className="text-xs underline">Mudar assinatura</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleShareOrder}
                                        className="h-14 bg-white border-2 border-primary text-primary font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
                                    >
                                        <span className="material-symbols-outlined">share</span>
                                        Enviar Cliente
                                    </button>
                                    <button
                                        onClick={() => setIsSignatureModalOpen(true)}
                                        className="h-14 bg-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-sm"
                                    >
                                        <span className="material-symbols-outlined">gesture</span>
                                        Colher Assinatura
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleCompleteOrderIntegrated}
                            disabled={isSaving}
                            className="w-full h-16 bg-green-600 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xl"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                            ) : (
                                <span className="material-symbols-outlined text-2xl">check_circle</span>
                            )}
                            Fazer Check-out e CONCLUIR
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 pb-10">
                        <div className="bg-green-600 rounded-2xl shadow-lg p-6 text-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="material-symbols-outlined text-4xl">verified</span>
                            </div>
                            <h2 className="text-xl font-bold">Serviço Concluído</h2>
                            <p className="text-sm text-white/80">Finalizado em {order.completedDate && new Date(order.completedDate).toLocaleDateString()} às {order.completedDate && new Date(order.completedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>

                        {/* Summary of what was done */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">analytics</span>
                                Relatório do Serviço
                            </h3>
                            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic border-l-4 border-gray-300">
                                {order.serviceNotes || 'Nenhuma observação registrada.'}
                            </div>
                        </div>

                        {/* Approved Items Summary */}
                        {additionalItems.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                                    Produtos e Serviços Aprovados
                                </h3>
                                <div className="space-y-2">
                                    {additionalItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                            <span className="font-bold text-gray-900">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center bg-primary/5 -mx-4 px-4 py-2 mt-2">
                                        <span className="font-bold text-gray-900">Total do Orçamento:</span>
                                        <span className="text-lg font-black text-primary">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                                additionalItems.reduce((sum, item) => sum + item.total, 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Photos section */}
                        {photos.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">collections</span>
                                    fotos do Registro
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {photos.map(photo => (
                                        <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img src={photo.url} alt="Evidência" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SIGNATURE VISUALIZATION */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history_edu</span>
                                Assinatura do Cliente
                            </h3>
                            {order.customerSignature ? (
                                <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
                                    <img
                                        src={order.customerSignature}
                                        alt="Assinatura"
                                        className="max-h-32 mx-auto mix-blend-multiply"
                                    />
                                    <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Assinado Digitalmente pelo Cliente</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-400 italic text-sm">
                                    Nenhuma assinatura registrada.
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/mobile/dashboard')}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                        >
                            Voltar para o Painel
                        </button>
                    </div>
                )}
            </div>

            {/* Signature Modal Overlay */}
            {isSignatureModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-[100] animate-in fade-in duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-1">Autorização de Execução</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight">
                                Autorizo a execução dos serviços e peças detalhadas nesse orçamento/ordemdeserviço
                            </p>
                        </div>
                        <button onClick={() => setIsSignatureModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Budget Approval Summary */}
                    {additionalItems.length > 0 && (
                        <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Resumo do Orçamento</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto mb-3">
                                {additionalItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-700">{item.quantity}x {item.name}</span>
                                        <span className="font-medium text-gray-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total a Aprovar:</span>
                                <span className="text-lg font-black text-primary">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                        additionalItems.reduce((sum, item) => sum + item.total, 0)
                                    )}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-100 border-x-2 border-t-2 border-b-4 border-gray-300 rounded-2xl overflow-hidden mb-6 relative h-64 touch-none shadow-inner border-double">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={300}
                            className="w-full h-full cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={endDrawing}
                            onMouseLeave={endDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={endDrawing}
                        />
                        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-gray-400 font-bold uppercase pointer-events-none">Espaço para assinatura manuscrita</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={clearSignature}
                            className="h-14 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 uppercase text-sm border-b-4 border-gray-300 active:border-b-0"
                        >
                            <span className="material-symbols-outlined">delete_sweep</span>
                            Limpar
                        </button>
                        <button
                            onClick={handleSaveSignature}
                            disabled={isSaving}
                            className="h-14 bg-primary text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase text-sm border-b-4 border-blue-800 active:border-b-0 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                                <span className="material-symbols-outlined">verified</span>
                            )}
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileOrderDetail;
