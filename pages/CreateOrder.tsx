import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  return (
    <div class="flex flex-1 flex-col h-full relative">
      <header class="sticky top-0 z-10 flex h-16 items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-8">
        <div class="flex items-center gap-8">
          <h2 class="text-[#333333] dark:text-white text-xl font-bold leading-tight">Criar Nova Ordem de Serviço</h2>
        </div>
        <div class="flex flex-1 items-center justify-end gap-4">
          <button onClick={() => navigate('/orders')} class="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[#333333] shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Cancelar</button>
          <button onClick={handleSubmit} class="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90">Salvar Ordem</button>
        </div>
      </header>
      
      <div class="flex-1 overflow-y-auto p-8">
        <div class="mx-auto max-w-4xl">
          <div class="flex flex-col gap-8">
            {/* Client Info */}
            <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F]">
              <h3 class="text-lg font-semibold text-[#333333] dark:text-white mb-6">Informações do Cliente</h3>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div class="col-span-1">
                  <label htmlFor="cliente" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
                  <div class="relative">
                    <select id="cliente" class="form-select w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      <option>Selecione um cliente</option>
                      <option>Cliente Corp S.A.</option>
                      <option>Paula Lima</option>
                      <option>Construções Modernas</option>
                    </select>
                  </div>
                </div>
                <div class="col-span-1 flex items-end">
                  <button class="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                    <span class="material-symbols-outlined text-base">add</span>
                    <span>Adicionar Novo Cliente</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F]">
              <h3 class="text-lg font-semibold text-[#333333] dark:text-white mb-6">Detalhes do Serviço</h3>
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="tipo_servico" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Serviço</label>
                  <input type="text" id="tipo_servico" class="form-input w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" placeholder="Ex: Manutenção Preventiva" />
                </div>
                <div>
                  <label htmlFor="descricao_problema" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição do Problema/Serviço</label>
                  <textarea id="descricao_problema" rows={4} class="form-textarea w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" placeholder="Descreva o problema ou o serviço a ser realizado..."></textarea>
                </div>
                <div>
                  <label htmlFor="endereco_servico" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço do Serviço</label>
                  <input type="text" id="endereco_servico" class="form-input w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" placeholder="Rua, Número, Bairro, Cidade" />
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F]">
              <h3 class="text-lg font-semibold text-[#333333] dark:text-white mb-6">Agendamento e Atribuição</h3>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="data_agendamento" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Agendamento</label>
                  <input type="date" id="data_agendamento" class="form-input w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="hora_agendamento" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora de Agendamento</label>
                  <input type="time" id="hora_agendamento" class="form-input w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="tecnico" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Técnico Atribuído</label>
                  <select id="tecnico" class="form-select w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option>Selecione um técnico</option>
                    <option>João Silva</option>
                    <option>Maria Oliveira</option>
                    <option>Carlos Souza</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="prioridade" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridade</label>
                  <select id="prioridade" class="form-select w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Alta</option>
                    <option>Urgente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F]">
              <h3 class="text-lg font-semibold text-[#333333] dark:text-white mb-6">Observações</h3>
              <div>
                <label htmlFor="observacoes" class="sr-only">Observações</label>
                <textarea id="observacoes" rows={4} class="form-textarea w-full rounded-lg border-gray-300 bg-white text-sm text-[#333333] placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" placeholder="Adicione qualquer observação adicional aqui..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl dark:bg-[#18202F]">
            <div class="flex flex-col items-center text-center">
              <div class="mb-4 flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <span class="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">check_circle</span>
              </div>
              <h2 class="mb-2 text-xl font-bold text-[#333333] dark:text-white">Ordem de Serviço Criada com Sucesso!</h2>
              <p class="mb-6 text-gray-500 dark:text-gray-400">O que você gostaria de fazer a seguir?</p>
              <div class="flex w-full flex-col gap-3">
                <button onClick={() => navigate('/orders/123')} class="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90">Ver Ordem</button>
                <button onClick={() => setShowSuccessModal(false)} class="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[#333333] shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Criar Nova</button>
                <button onClick={() => navigate('/dashboard')} class="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50">Ir para Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;