import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Technician } from '../types/technician';

const MobileCreateOrder: React.FC = () => {
    const navigate = useNavigate();
    const { clients, addOrder } = useApp();
    const { showToast } = useToast();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        clientId: '',
        serviceType: '',
        description: '',
        priority: 'normal' as 'baixa' | 'normal' | 'alta' | 'urgente',
        observations: ''
    });

    useEffect(() => {
        const storedTech = localStorage.getItem('technician');
        if (!storedTech) {
            navigate('/mobile/login');
            return;
        }
        setTechnician(JSON.parse(storedTech));
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.clientId || !formData.serviceType || !formData.description) {
            showToast('error', 'Por favor, preencha os campos obrigatórios.');
            return;
        }

        if (!technician) return;

        setIsSubmitting(true);
        try {
            const selectedClient = clients.find(c => c.id === formData.clientId);

            const newOrder = {
                clientId: formData.clientId,
                clientName: selectedClient?.name || '',
                serviceType: formData.serviceType,
                description: formData.description,
                priority: formData.priority,
                scheduledDate: new Date().toISOString(),
                completedDate: null,
                technicianId: technician.id,
                technicianName: technician.name,
                value: 0,
                observations: formData.observations,
                projectId: '',
                projectName: '',
                status: 'nova' as const
            };

            await addOrder(newOrder);
            showToast('success', 'Ordem de serviço criada com sucesso!');
            navigate('/mobile/dashboard');
        } catch (error) {
            console.error('Error creating order:', error);
            showToast('error', 'Erro ao criar ordem de serviço.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!technician) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold">Nova Ordem de Serviço</h1>
                </div>
            </div>

            <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Client Selection */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente *</label>
                        <select
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        >
                            <option value="">Selecione um cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Service Type */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Serviço *</label>
                        <input
                            type="text"
                            value={formData.serviceType}
                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            placeholder="Ex: Manutenção de Ar Condicionado"
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Priority */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Prioridade *</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['baixa', 'normal', 'alta', 'urgente'] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: p })}
                                    className={`py-2 px-4 rounded-lg text-sm font-medium border-2 transition-all ${formData.priority === p
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                                        }`}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição do Problema *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descreva detalhes do serviço..."
                            rows={4}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                            required
                        ></textarea>
                    </div>

                    {/* Observations */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Observações Adicionais</label>
                        <textarea
                            value={formData.observations}
                            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                            placeholder="Algo mais que o técnico precise saber?"
                            rows={2}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Criando...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">add_task</span>
                                <span>Criar Ordem de Serviço</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MobileCreateOrder;
