import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { Modal } from '../../components/Modal';

export default function ContractForm() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-slate-900">Criar Novo Contrato de Recorrência</h1>

      <div className="space-y-8">
        {/* Main Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
           <div className="px-6 py-4 border-b border-gray-200">
             <h3 className="font-bold text-slate-900">Informações Principais</h3>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
               <select className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                 <option>Selecione um cliente</option>
                 <option>Cliente Exemplo 1</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Nome/ID do Contrato *</label>
               <input type="text" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="Ex: Manutenção Mensal" />
             </div>
             <div className="md:col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Serviço *</label>
               <input type="text" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="Selecione o tipo" />
             </div>
           </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
           <div className="px-6 py-4 border-b border-gray-200">
             <h3 className="font-bold text-slate-900">Detalhes e Prazos</h3>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
               <textarea className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" rows={3}></textarea>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Data Início *</label>
               <input type="date" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Data Fim</label>
               <input type="date" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" />
             </div>
           </div>
        </div>

        {/* Financials */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
           <div className="px-6 py-4 border-b border-gray-200">
             <h3 className="font-bold text-slate-900">Faturamento</h3>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$) *</label>
               <input type="text" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="0,00" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Período *</label>
               <select className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                 <option>Mensal</option>
                 <option>Trimestral</option>
                 <option>Anual</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">1ª Cobrança *</label>
               <input type="date" className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" />
             </div>
           </div>
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
           <div className="px-6 py-4 border-b border-gray-200">
             <h3 className="font-bold text-slate-900">Documentos</h3>
           </div>
           <div className="p-6 space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Termos Específicos</label>
               <textarea className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" rows={4}></textarea>
             </div>
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
               <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
               <p className="text-sm text-gray-600"><span className="font-bold text-primary">Clique para enviar</span> ou arraste</p>
               <p className="text-xs text-gray-400">PDF, DOCX (Max 10MB)</p>
             </div>
           </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button onClick={() => navigate('/contracts')} className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300">Cancelar</button>
        <button onClick={() => setShowSuccess(true)} className="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-700">Salvar Contrato</button>
      </div>

      <Modal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Contrato criado com sucesso!"
        type="success"
      >
        <p className="text-gray-600 mb-6">O contrato foi salvo e está ativo.</p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/contracts/1')} className="flex-1 py-2 bg-primary text-white rounded-lg font-bold">Ver Contrato</button>
          <button onClick={() => window.location.reload()} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold">Criar Novo</button>
        </div>
      </Modal>
    </div>
  );
}