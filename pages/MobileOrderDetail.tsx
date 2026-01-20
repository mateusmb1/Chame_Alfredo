import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Technician } from '../types/technician';
import { Order } from '../types/order';
import { useToast } from '../contexts/ToastContext';

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
    const { orders, updateOrder } = useApp();
    const { showToast } = useToast();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [photos, setPhotos] = useState<ServicePhoto[]>([]);
    const [checkInOut, setCheckInOut] = useState<CheckInOut>({});
    const [notes, setNotes] = useState('');
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);

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
        }
    }, [id, orders, navigate]);

    const handleCheckIn = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const checkInData = {
                        timestamp: new Date().toISOString(),
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    };
                    setCheckInOut({ ...checkInOut, checkIn: checkInData });
                    if (order) {
                        updateOrder(order.id, { checkIn: checkInData });
                    }
                    showToast('success', 'Check-in realizado com sucesso!');
                },
                (error) => {
                    showToast('error', 'Erro ao obter localização');
                }
            );
        } else {
            showToast('error', 'Geolocalização não disponível');
        }
    };

    const handleCheckOut = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const checkOutData = {
                        timestamp: new Date().toISOString(),
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    };
                    setCheckInOut({ ...checkInOut, checkOut: checkOutData });
                    if (order) {
                        updateOrder(order.id, { checkOut: checkOutData });
                    }
                    showToast('success', 'Check-out realizado com sucesso!');
                },
                (error) => {
                    showToast('error', 'Erro ao obter localização');
                }
            );
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const newPhoto: ServicePhoto = {
                    id: `photo-${Date.now()}`,
                    url: reader.result as string,
                    caption: '',
                    timestamp: new Date().toISOString()
                };
                setPhotos([...photos, newPhoto]);
                showToast('success', 'Foto adicionada!');
            };

            reader.readAsDataURL(file);
        }
    };

    const handleStartOrder = () => {
        if (order) {
            updateOrder(order.id, { status: 'em_andamento' });
            showToast('success', 'Ordem iniciada!');
        }
    };

    const handleCompleteOrder = async () => {
        const errors = [];

        if (!checkInOut.checkIn) {
            errors.push('Check-in é obrigatório');
        }

        if (photos.length === 0) {
            errors.push('Pelo menos uma foto do serviço é obrigatória');
        }

        if (!notes.trim()) {
            errors.push('Observações sobre o serviço são obrigatórias');
        }

        if (!signature) {
            errors.push('Assinatura do cliente é obrigatória');
        }

        if (errors.length > 0) {
            errors.forEach(err => showToast('error', err));
            if (!signature && checkInOut.checkIn && photos.length > 0 && notes.trim()) {
                setIsSignatureModalOpen(true);
            }
            return;
        }

        if (order) {
            try {
                await updateOrder(order.id, {
                    status: 'finalizada',
                    completedDate: new Date().toISOString(),
                    checkIn: checkInOut.checkIn,
                    checkOut: checkInOut.checkOut || {
                        timestamp: new Date().toISOString(),
                        location: checkInOut.checkIn?.location
                    },
                    servicePhotos: photos,
                    serviceNotes: notes,
                    customerSignature: signature || undefined
                });
                showToast('success', 'Ordem concluída com sucesso!');
                setTimeout(() => navigate('/mobile/dashboard'), 1500);
            } catch (error) {
                console.error('Error completing order:', error);
                showToast('error', 'Erro ao concluir ordem');
            }
        }
    };

    const handleSignature = () => {
        // Simular captura de assinatura
        setSignature('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        setIsSignatureModalOpen(false);
        showToast('success', 'Assinatura capturada!');
    };

    if (!order || !technician) {
        return null;
    }

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div class="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div class="bg-gradient-to-r from-primary to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
                <div class="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/mobile/dashboard')}
                        class="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div class="flex-1">
                        <h1 class="text-lg font-bold">Ordem #{order.id}</h1>
                        <p class="text-sm text-white/80">{order.clientName}</p>
                    </div>
                </div>
            </div>

            <div class="p-4 space-y-4">
                {/* Order Info */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    <h2 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">info</span>
                        Informações do Serviço
                    </h2>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Tipo:</span>
                            <span class="font-semibold text-gray-900">{order.serviceType}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Prioridade:</span>
                            <span class="font-semibold text-gray-900">{order.priority}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Status:</span>
                            <span class="font-semibold text-gray-900">{order.status}</span>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                        <p class="text-sm text-gray-700">{order.description}</p>
                    </div>
                </div>

                {/* Check-in/Check-out */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    <h2 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">location_on</span>
                        Check-in / Check-out
                    </h2>
                    <div class="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCheckIn}
                            disabled={!!checkInOut.checkIn}
                            class={`h-12 rounded-lg font-semibold flex items-center justify-center gap-2 ${checkInOut.checkIn
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                        >
                            <span class="material-symbols-outlined text-lg">login</span>
                            {checkInOut.checkIn ? formatTime(checkInOut.checkIn.timestamp) : 'Check-in'}
                        </button>
                        <button
                            onClick={handleCheckOut}
                            disabled={!checkInOut.checkIn || !!checkInOut.checkOut}
                            class={`h-12 rounded-lg font-semibold flex items-center justify-center gap-2 ${checkInOut.checkOut
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : checkInOut.checkIn
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <span class="material-symbols-outlined text-lg">logout</span>
                            {checkInOut.checkOut ? formatTime(checkInOut.checkOut.timestamp) : 'Check-out'}
                        </button>
                    </div>
                </div>

                {/* Photos */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    <h2 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">photo_camera</span>
                        Fotos do Serviço
                    </h2>

                    <div class="grid grid-cols-3 gap-2 mb-3">
                        {photos.map(photo => (
                            <div key={photo.id} class="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img src={photo.url} alt="Foto do serviço" class="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <label class="flex items-center justify-center gap-2 h-12 bg-blue-50 text-primary font-semibold rounded-lg border-2 border-dashed border-primary hover:bg-blue-100 transition-colors cursor-pointer">
                        <span class="material-symbols-outlined">add_a_photo</span>
                        <span>Adicionar Foto</span>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoUpload}
                            class="hidden"
                        />
                    </label>
                </div>

                {/* Notes */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    <h2 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">edit_note</span>
                        Observações
                    </h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        class="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Adicione observações sobre o serviço..."
                    />
                </div>

                {/* Signature */}
                <div class="bg-white rounded-xl shadow-md p-4">
                    <h2 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">draw</span>
                        Assinatura do Cliente
                    </h2>
                    {signature ? (
                        <div class="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                            <div class="flex items-center justify-center gap-2 text-green-700">
                                <span class="material-symbols-outlined">check_circle</span>
                                <span class="font-semibold">Assinatura Capturada</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsSignatureModalOpen(true)}
                            class="w-full h-12 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <span class="material-symbols-outlined">gesture</span>
                            <span>Capturar Assinatura</span>
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div class="space-y-3">
                    {order.status === 'nova' && (
                        <button
                            onClick={handleStartOrder}
                            class="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <span class="material-symbols-outlined">play_arrow</span>
                            <span>Iniciar Ordem</span>
                        </button>
                    )}

                    {order.status === 'em_andamento' && (
                        <button
                            onClick={handleCompleteOrder}
                            class="w-full h-12 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <span class="material-symbols-outlined">check_circle</span>
                            <span>Concluir Ordem</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Signature Modal */}
            {isSignatureModalOpen && (
                <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div class="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 class="text-xl font-bold text-gray-900 mb-4">Assinatura do Cliente</h3>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg h-48 mb-4 flex items-center justify-center bg-gray-50">
                            <p class="text-gray-400">Área de assinatura</p>
                        </div>
                        <div class="flex gap-3">
                            <button
                                onClick={() => setIsSignatureModalOpen(false)}
                                class="flex-1 h-12 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSignature}
                                class="flex-1 h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileOrderDetail;
