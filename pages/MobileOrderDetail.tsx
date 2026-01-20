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
        }
    }, [id, orders, navigate, photos.length, notes, signature, checkInOut.checkIn, checkInOut.checkOut]);

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
                        updateOrder(order.id, {
                            checkIn: checkInData,
                            status: 'em_andamento'
                        });
                    }
                    showToast('success', 'Check-in realizado! Ordem iniciada.');
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
                const updatedPhotos = [...photos, newPhoto];
                setPhotos(updatedPhotos);
                if (order) {
                    updateOrder(order.id, { servicePhotos: updatedPhotos });
                }
                showToast('success', 'Foto adicionada e salva!');
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
                    status: 'concluida',
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

    const handleSaveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL();
        setSignature(dataUrl);
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
                {/* Order Info */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Informações do Serviço
                    </h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-semibold text-gray-900">{order.serviceType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Prioridade:</span>
                            <span className="font-semibold text-gray-900">{order.priority}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-semibold text-gray-900">{order.status}</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">{order.description}</p>
                    </div>
                </div>

                {/* Check-in/Check-out */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        Check-in / Check-out
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCheckIn}
                            disabled={!!checkInOut.checkIn}
                            className={`h-12 rounded-lg font-semibold flex items-center justify-center gap-2 ${checkInOut.checkIn
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">login</span>
                            {checkInOut.checkIn ? formatTime(checkInOut.checkIn.timestamp) : 'Check-in'}
                        </button>
                        <button
                            onClick={handleCheckOut}
                            disabled={!checkInOut.checkIn || !!checkInOut.checkOut}
                            className={`h-12 rounded-lg font-semibold flex items-center justify-center gap-2 ${checkInOut.checkOut
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : checkInOut.checkIn
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                            {checkInOut.checkOut ? formatTime(checkInOut.checkOut.timestamp) : 'Check-out'}
                        </button>
                    </div>
                </div>

                {/* Photos */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">photo_camera</span>
                        Fotos do Serviço
                    </h2>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {photos.map(photo => (
                            <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img src={photo.url} alt="Foto do serviço" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <label className="flex items-center justify-center gap-2 h-12 bg-blue-50 text-primary font-semibold rounded-lg border-2 border-dashed border-primary hover:bg-blue-100 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">add_a_photo</span>
                        <span>Adicionar Foto</span>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">edit_note</span>
                        Observações
                    </h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Adicione observações sobre o serviço..."
                    />
                </div>

                {/* Signature */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">draw</span>
                        Assinatura do Cliente
                    </h2>
                    {signature ? (
                        <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                            <div className="flex items-center justify-center gap-2 text-green-700">
                                <span className="material-symbols-outlined">check_circle</span>
                                <span className="font-semibold">Assinatura Capturada</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsSignatureModalOpen(true)}
                            className="w-full h-12 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">gesture</span>
                            <span>Capturar Assinatura</span>
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {order.status === 'nova' && (
                        <button
                            onClick={handleStartOrder}
                            className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">play_arrow</span>
                            <span>Iniciar Ordem</span>
                        </button>
                    )}

                    {order.status === 'em_andamento' && (
                        <button
                            onClick={handleCompleteOrder}
                            className="w-full h-12 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            <span>Concluir Ordem</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Signature Modal */}
            {isSignatureModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-hidden">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Assinatura do Cliente</h3>

                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden mb-4 relative h-64 touch-none">
                            <canvas
                                ref={canvasRef}
                                width={400}
                                height={256}
                                className="w-full h-full cursor-crosshair"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={endDrawing}
                                onMouseLeave={endDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={endDrawing}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <button
                                    onClick={clearSignature}
                                    className="flex-1 h-12 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                    Limpar
                                </button>
                                <button
                                    onClick={handleSaveSignature}
                                    className="flex-1 h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">check</span>
                                    Confirmar
                                </button>
                            </div>
                            <button
                                onClick={() => setIsSignatureModalOpen(false)}
                                className="w-full h-12 text-gray-400 font-medium text-sm"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileOrderDetail;
