import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Modal from './Modal';
import {
    Clock,
    User,
    MapPin,
    Tag,
    FileText,
    ChevronDown,
    Calendar as CalendarIcon,
    Search,
    Zap,
    Trash2
} from 'lucide-react';
import { Appointment } from '../types/appointment';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate?: Date;
    appointment?: Appointment | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
    isOpen,
    onClose,
    initialDate,
    appointment
}) => {
    const { technicians, orders, addAppointment, updateAppointment, deleteAppointment } = useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        type: 'visita' as Appointment['type'],
        startTime: '',
        endTime: '',
        technicianId: '',
        orderId: '',
        location: '',
        notes: '',
        status: 'agendado' as Appointment['status']
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                title: appointment.title,
                type: appointment.type,
                startTime: appointment.startTime.slice(0, 16),
                endTime: appointment.endTime.slice(0, 16),
                technicianId: appointment.technicianId || '',
                orderId: appointment.orderId || '',
                location: appointment.location || '',
                notes: appointment.notes || '',
                status: appointment.status
            });
        } else if (initialDate) {
            const now = new Date();
            const start = new Date(initialDate);
            start.setHours(now.getHours(), 0, 0, 0);

            const end = new Date(start);
            end.setHours(start.getHours() + 1);

            setFormData(prev => ({
                ...prev,
                startTime: start.toISOString().slice(0, 16),
                endTime: end.toISOString().slice(0, 16)
            }));
        }
    }, [appointment, initialDate, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (appointment) {
                await updateAppointment(appointment.id, formData);
            } else {
                await addAppointment(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!appointment) return;
        if (confirm('Tem certeza que deseja remover este agendamento?')) {
            setLoading(true);
            try {
                await deleteAppointment(appointment.id);
                onClose();
            } catch (error) {
                console.error('Error deleting appointment:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const footer = (
        <div className="flex items-center justify-between w-full">
            {appointment ? (
                <button
                    onClick={handleDelete}
                    className="h-14 px-8 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest flex items-center gap-3"
                >
                    <Trash2 className="w-4 h-4" />
                    Remover
                </button>
            ) : <div />}

            <div className="flex items-center gap-3">
                {!appointment && (
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            navigate('/orders/new', { state: { scheduledDate: formData.startTime.split('T')[0], scheduledTime: formData.startTime.split('T')[1] } });
                        }}
                        className="h-14 px-6 rounded-2xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4" /> Criar OS
                    </button>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    className="h-14 px-8 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all font-black uppercase text-[10px] tracking-widest"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-14 px-10 bg-[#1e293b] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50"
                >
                    {loading ? 'Sincronizando...' : <><Clock className="w-4 h-4" /> <span>{appointment ? 'Atualizar' : 'Agendar'}</span></>}
                </button>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={appointment ? 'Editar Agendamento' : 'Novo Alocamento'}
            size="md"
            footer={footer}
        >
            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="group space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-primary transition-colors">Título do Compromisso</label>
                    <div className="relative">
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Manutenção Preventiva - Unidade 04"
                            className="w-full h-16 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-bold text-[#1e293b] dark:text-white placeholder:text-gray-300 transition-all outline-none"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20"><Tag className="w-5 h-5" /></div>
                    </div>
                </div>

                {/* Type & Status Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Tipo</label>
                        <div className="relative">
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-[#1e293b] dark:text-white outline-none appearance-none cursor-pointer"
                            >
                                <option value="visita">Visita Técnica</option>
                                <option value="ordem">Ordem de Serviço</option>
                                <option value="reuniao">Reunião</option>
                                <option value="outro">Outro</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</label>
                        <div className="relative">
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-[#1e293b] dark:text-white outline-none appearance-none cursor-pointer"
                            >
                                <option value="agendado">Agendado</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="concluido">Concluído</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Times Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-primary transition-colors">Início</label>
                        <div className="relative">
                            <input
                                required
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-[10px] font-bold text-[#1e293b] dark:text-white transition-all outline-none"
                            />
                            <Clock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none opacity-20" />
                        </div>
                    </div>
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-primary transition-colors">Término</label>
                        <div className="relative">
                            <input
                                required
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-[10px] font-bold text-[#1e293b] dark:text-white transition-all outline-none"
                            />
                            <Clock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Técnico Responsável</label>
                        <div className="relative">
                            <select
                                value={formData.technicianId}
                                onChange={e => setFormData({ ...formData, technicianId: e.target.value })}
                                className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-[10px] font-bold text-[#1e293b] dark:text-white outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Não Atribuído</option>
                                {technicians.map(tech => (
                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                ))}
                            </select>
                            <User className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none opacity-20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Vincular Ordem (Opcional)</label>
                        <div className="relative">
                            <select
                                value={formData.orderId}
                                onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                                className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-[10px] font-bold text-[#1e293b] dark:text-white outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Nenhuma Ordem</option>
                                {orders.map(order => (
                                    <option key={order.id} value={order.id}>{order.clientName} - {order.serviceType}</option>
                                ))}
                            </select>
                            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Location & Notes */}
                <div className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-primary transition-colors">Localização</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Endereço ou Cliente"
                                className="w-full h-14 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-[10px] font-bold text-[#1e293b] dark:text-white transition-all outline-none"
                            />
                            <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none opacity-20" />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-primary transition-colors">Notas Técnicas</label>
                        <div className="relative">
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full h-32 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-[2rem] p-6 text-[10px] font-medium text-[#1e293b] dark:text-white transition-all outline-none resize-none"
                                placeholder="Detalhes adicionais para o técnico..."
                            />
                            <FileText className="absolute right-6 top-6 w-4 h-4 text-gray-300 pointer-events-none opacity-20" />
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AppointmentModal;
