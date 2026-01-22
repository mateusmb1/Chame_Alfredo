import React, { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../contexts/AppContext';
import { Contract } from '../types/contract';
import { useToast } from '../contexts/ToastContext';
import {
    FileText,
    Shield,
    Calendar,
    DollarSign,
    RefreshCw,
    Edit2,
    Trash2,
    Plus,
    Search,
    ChevronRight,
    Building,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ArrowUpRight
} from 'lucide-react';

const Contracts: React.FC = () => {
    const { contracts, clients, addContract, updateContract, deleteContract } = useApp();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingContractId, setEditingContractId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<string | null>(null);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(contracts[0] || null);

    const [formData, setFormData] = useState({
        clientId: '',
        contractType: 'manutencao' as 'manutencao' | 'instalacao' | 'consultoria' | 'suporte' | 'outro',
        description: '',
        value: '',
        billingFrequency: 'mensal' as 'mensal' | 'trimestral' | 'semestral' | 'anual',
        startDate: '',
        endDate: '',
        status: 'ativo' as 'ativo' | 'suspenso' | 'cancelado' | 'expirado',
        autoRenewal: true,
        paymentDay: '10',
        notes: ''
    });

    const handleOpenNewContractModal = () => {
        setIsEditMode(false);
        setEditingContractId(null);
        setFormData({
            clientId: '', contractType: 'manutencao', description: '', value: '',
            billingFrequency: 'mensal', startDate: '', endDate: '', status: 'ativo',
            autoRenewal: true, paymentDay: '10', notes: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (contract: Contract) => {
        setIsEditMode(true);
        setEditingContractId(contract.id);
        setFormData({
            clientId: contract.clientId,
            contractType: contract.contractType,
            description: contract.description,
            value: String(contract.value),
            billingFrequency: contract.billingFrequency || 'mensal',
            startDate: contract.startDate,
            endDate: contract.endDate,
            status: contract.status,
            autoRenewal: contract.autoRenewal,
            paymentDay: String(contract.paymentDay),
            notes: contract.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedClient = clients.find(c => c.id === formData.clientId);
        if (!selectedClient) {
            showToast('error', 'Entidade não identificada.');
            return;
        }

        const contractData = {
            ...formData,
            clientName: selectedClient.name,
            clientType: selectedClient.type,
            value: Number(formData.value),
            paymentDay: Number(formData.paymentDay)
        };

        if (isEditMode && editingContractId) {
            updateContract(editingContractId, contractData);
            showToast('success', 'Documento renovado e atualizado.');
        } else {
            addContract(contractData);
            showToast('success', 'Novo contrato registrado no sistema.');
        }
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (contractToDelete) {
            deleteContract(contractToDelete);
            showToast('success', 'Contrato purgado da base de dados.');
            if (selectedContract?.id === contractToDelete) setSelectedContract(contracts[0] || null);
        }
        setContractToDelete(null);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'ativo': return { label: 'Vigente', color: 'text-emerald-500 bg-emerald-500/10', icon: Shield };
            case 'suspenso': return { label: 'Suspenso', color: 'text-amber-500 bg-amber-500/10', icon: AlertCircle };
            case 'cancelado': return { label: 'Rescindido', color: 'text-red-500 bg-red-500/10', icon: XCircle };
            case 'expirado': return { label: 'Finalizado', color: 'text-gray-400 bg-gray-400/10', icon: Clock };
            default: return { label: status, color: 'text-gray-400', icon: Clock };
        }
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

    return (
        <div className="max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header Control Container */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-gray-800/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                        <p className="text-primary text-xs font-black uppercase tracking-[0.3em] leading-none">Gestão de Receita Recorrente</p>
                    </div>
                    <h1 className="text-5xl font-black text-[#1e293b] dark:text-white tracking-tighter leading-none mb-3 italic">
                        Contratos<span className="text-primary">.</span>
                    </h1>
                    <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest opacity-80">
                        Auditoria e controle de acordos de nível de serviço (SLA).
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleOpenNewContractModal}
                        className="h-16 px-10 bg-[#1e293b] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 hover:bg-primary transition-all shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Formalizar Contrato</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* List View - Navigation */}
                <aside className="xl:w-[450px] space-y-6">
                    <div className="bg-white dark:bg-[#101622] rounded-[3rem] p-4 shadow-sm border border-gray-100 dark:border-gray-800/50 flex items-center gap-4 group">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="LOCALIZAR CONTRATO..."
                                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 dark:bg-white/5 border-none rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto no-scrollbar pr-2">
                        {contracts.map(contract => {
                            const config = getStatusConfig(contract.status);
                            const isActive = selectedContract?.id === contract.id;
                            return (
                                <div
                                    key={contract.id}
                                    onClick={() => setSelectedContract(contract)}
                                    className={`group relative p-8 rounded-[2.5rem] border transition-all cursor-pointer overflow-hidden
                                    ${isActive
                                            ? 'bg-[#1e293b] border-transparent shadow-2xl translate-x-3'
                                            : 'bg-white dark:bg-[#101622] border-gray-100 dark:border-gray-800 hover:border-primary/20 hover:scale-[1.02]'}`}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${isActive ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className={`font-black italic uppercase text-lg tracking-tighter leading-none ${isActive ? 'text-white' : 'text-[#1e293b] dark:text-white group-hover:text-primary transition-colors'}`}>{contract.clientName}</h3>
                                                <p className={`text-[9px] font-black uppercase tracking-widest leading-none mt-1 ${isActive ? 'text-white/40' : 'text-gray-300'}`}>Ref: {contract.contractNumber}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${config.color} shadow-sm border border-transparent`}>
                                            {config.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white/60' : 'text-gray-400'}`}>{contract.contractType}</span>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-sm font-black italic tracking-tighter ${isActive ? 'text-primary' : 'text-emerald-500'}`}>{formatCurrency(contract.value)}</span>
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white/30' : 'text-gray-300'}`}>Frequência {contract.billingFrequency}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Detail View - Center Stage */}
                <main className="flex-1">
                    {selectedContract ? (
                        <div className="bg-white dark:bg-[#101622] rounded-[4rem] border border-gray-100 dark:border-gray-800/50 shadow-2xl p-12 lg:p-20 relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">
                            {/* Abstract Design Element */}
                            <div className="absolute top-0 right-0 p-20 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                <Shield className="w-80 h-80 -rotate-12" />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative z-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">SLA Ativo</div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Formalizado em {new Date(selectedContract.startDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <h2 className="text-6xl font-black text-[#1e293b] dark:text-white italic tracking-tighter uppercase mb-4 leading-none">{selectedContract.clientName}</h2>
                                    <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">{selectedContract.contractNumber}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => handleOpenEditModal(selectedContract)} className="h-16 w-16 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500/20 transition-all shadow-sm active:scale-95"><Edit2 className="w-6 h-6" /></button>
                                    <button onClick={() => { setContractToDelete(selectedContract.id); setIsDeleteDialogOpen(true); }} className="h-16 w-16 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/20 transition-all shadow-sm active:scale-95"><Trash2 className="w-6 h-6" /></button>
                                </div>
                            </div>

                            {/* Core Contract Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
                                {[
                                    { label: 'Valor Mensal', value: formatCurrency(selectedContract.value), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                    { label: 'Vencimento', value: `Todo dia ${selectedContract.paymentDay}`, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                    { label: 'Expiração', value: new Date(selectedContract.endDate).toLocaleDateString('pt-BR'), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                    { label: 'Auto-Renovar', value: selectedContract.autoRenewal ? 'ATIVO' : 'DESLIGADO', icon: RefreshCw, color: 'text-purple-500', bg: 'bg-purple-500/10' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-gray-50/50 dark:bg-white/2 rounded-[2.5rem] p-8 border border-white dark:border-gray-800 shadow-sm transition-all hover:scale-[1.02]">
                                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner`}><stat.icon className="w-6 h-6" /></div>
                                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2 leading-none">{stat.label}</p>
                                        <p className="text-xl font-black text-[#1e293b] dark:text-white italic tracking-tighter leading-none">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Detailed Description Stage */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                                        <span className="w-8 h-px bg-primary/30"></span> ESCOPO DOCUMENTADO
                                    </h4>
                                    <div className="p-10 bg-gray-50 dark:bg-white/2 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-inner">
                                        <p className="text-sm font-bold text-[#1e293b]/70 dark:text-gray-300 leading-relaxed uppercase">{selectedContract.description || 'NENHUMA DESCRIÇÃO TÉCNICA CADASTRADA.'}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                                        <span className="w-8 h-px bg-primary/30"></span> NOTAS E ADENDOS
                                    </h4>
                                    <div className="p-10 bg-gray-50 dark:bg-white/2 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-inner min-h-[160px]">
                                        <p className="text-sm font-bold text-[#1e293b]/50 dark:text-gray-400 leading-relaxed italic">{selectedContract.notes || 'Nenhuma observação adicional vinculada a este registro.'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tactical Call to Action */}
                            <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-xl"><Building className="w-7 h-7" /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Tipo de Entidade</p>
                                        <p className="text-xs font-black text-[#1e293b] dark:text-white uppercase tracking-widest">{selectedContract.clientType === 'pf' ? 'Indivíduo / Residencial' : 'Corporativo / Condomínio'}</p>
                                    </div>
                                </div>
                                <button className="h-14 px-10 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-4 group">
                                    <span>Download via PDF</span>
                                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-white dark:bg-[#101622] rounded-[4rem] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-200 p-20 text-center">
                            <Shield className="w-24 h-24 mb-6 opacity-40" />
                            <h3 className="text-xl font-black uppercase tracking-[0.4em] mb-2">Visão de Contrato</h3>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Selecione um acordo na lista lateral para auditoria.</p>
                        </div>
                    )}
                </main>
            </div>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="CANCELAR CONTRATO"
                message="Esta ação irá remover o registro jurídico e financeiro do sistema. Confirmar?"
                confirmText="Confirmar Rescisão"
                cancelText="Arquivar Documento"
                type="danger"
            />

            {/* Modal remains standardized from redesign system */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? 'ATUALIZAÇÃO DE TERMOS' : 'REGISTRO DE NOVO ACORDO'}
                size="lg"
                footer={
                    <div className="flex items-center justify-end gap-3 w-full px-10 pb-8">
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">Abortar</button>
                        <button onClick={handleSubmit} className="px-10 py-4 bg-[#1e293b] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-primary transition-all flex items-center gap-3">
                            <Shield className="w-5 h-5" />
                            <span>Formalizar</span>
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Mapeamento de Entidade (Cliente)</label>
                        <select
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black uppercase tracking-widest px-6 transition-all"
                            required
                        >
                            <option value="">SELECIONE A ENTIDADE</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Classificação</label>
                            <select
                                value={formData.contractType}
                                onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black uppercase tracking-widest px-6 transition-all"
                                required
                            >
                                <option value="manutencao">Manutenção Preventiva</option>
                                <option value="instalacao">Instalação / Setup</option>
                                <option value="consultoria">Consultoria Técnica</option>
                                <option value="suporte">Suporte 24/7</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Janela de Faturamento</label>
                            <select
                                value={formData.billingFrequency}
                                onChange={(e) => setFormData({ ...formData, billingFrequency: e.target.value as any })}
                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-black uppercase tracking-widest px-6 transition-all"
                            >
                                <option value="mensal">Mensalmente</option>
                                <option value="trimestral">Trimestralmente</option>
                                <option value="semestral">Semestralmente</option>
                                <option value="anual">Anualmente</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Cláusula de Escopo</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-xs font-bold focus:ring-8 focus:ring-primary/5 dark:text-white transition-all uppercase"
                            placeholder="DETALHE OS SERVIÇOS E COBERTURAS INCLUÍDAS..."
                            required
                        />
                    </div>
                </form>
            </Modal>

            <style dangerouslySetInnerHTML={{
                __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
        </div>
    );
};

export default Contracts;
