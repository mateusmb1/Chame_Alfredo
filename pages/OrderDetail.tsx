import React from 'react';
import { Link } from 'react-router-dom';

const OrderDetail: React.FC = () => {
  return (
    <div class="flex h-full flex-col p-8">
      <div class="mx-auto w-full max-w-7xl">
        {/* Header */}
        <header class="mb-8">
          {/* Breadcrumbs */}
          <div class="flex flex-wrap gap-2 mb-4">
            <Link to="/dashboard" class="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
            <span class="text-gray-400 text-sm font-medium">/</span>
            <Link to="/orders" class="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary">Ordens de Serviço</Link>
            <span class="text-gray-400 text-sm font-medium">/</span>
            <span class="text-gray-900 dark:text-white text-sm font-medium">#OS-12345</span>
          </div>
          {/* Page Heading & Actions */}
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-3">
                <p class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ordem de Serviço #OS-12345</p>
                <span class="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/50 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-300">Em Andamento</span>
              </div>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button class="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
                <span class="material-symbols-outlined text-base">swap_horiz</span>
                <span class="truncate">Mudar Status</span>
              </button>
              <button class="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="material-symbols-outlined text-base">edit</span>
                <span class="truncate">Editar Ordem</span>
              </button>
              <button class="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="material-symbols-outlined text-base">add_comment</span>
                <span class="truncate">Adicionar Observação</span>
              </button>
              <button class="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="material-symbols-outlined text-xl">print</span>
              </button>
            </div>
          </div>
        </header>

        {/* Layout Grid */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (Left) */}
          <div class="lg:col-span-2 flex flex-col gap-8">
            {/* Card: Detalhes do Cliente */}
            <div class="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalhes do Cliente</h2>
              </div>
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome do Cliente</p>
                  <p class="font-semibold text-gray-900 dark:text-white">Ana Costa</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Telefone</p>
                  <p class="font-semibold text-gray-900 dark:text-white">(11) 98765-4321</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">E-mail</p>
                  <p class="font-semibold text-gray-900 dark:text-white">ana.costa@email.com</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Endereço do Serviço</p>
                  <p class="font-semibold text-gray-900 dark:text-white">Rua das Flores, 123, São Paulo, SP</p>
                </div>
              </div>
            </div>

            {/* Card: Detalhes do Serviço */}
            <div class="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalhes do Serviço</h2>
              </div>
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo de Serviço</p>
                  <p class="font-semibold text-gray-900 dark:text-white">Manutenção de Ar Condicionado</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prioridade</p>
                  <span class="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-300">Alta</span>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Descrição do Problema</p>
                  <p class="font-semibold text-gray-900 dark:text-white">O equipamento não está resfriando adequadamente e está fazendo um barulho estranho. Foi solicitado uma verificação e possível reparo com urgência.</p>
                </div>
              </div>
            </div>

            {/* Card: Peças Utilizadas */}
            <div class="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Peças Utilizadas</h2>
              </div>
              <div class="p-2">
                <table class="w-full text-left">
                  <thead class="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    <tr>
                      <th class="px-4 py-3" scope="col">Peça</th>
                      <th class="px-4 py-3" scope="col">Quantidade</th>
                      <th class="px-4 py-3 text-right" scope="col">Custo Unit.</th>
                      <th class="px-4 py-3 text-right" scope="col">Custo Total</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-900 dark:text-white">
                    <tr class="border-b border-gray-200 dark:border-gray-800">
                      <td class="px-4 py-4 font-semibold">Filtro de Ar Universal</td>
                      <td class="px-4 py-4">2</td>
                      <td class="px-4 py-4 text-right">R$ 45,00</td>
                      <td class="px-4 py-4 text-right">R$ 90,00</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-4 font-semibold">Gás Refrigerante R410A</td>
                      <td class="px-4 py-4">1kg</td>
                      <td class="px-4 py-4 text-right">R$ 120,00</td>
                      <td class="px-4 py-4 text-right">R$ 120,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Secondary Column (Right) */}
          <div class="flex flex-col gap-8">
            {/* Card: Agendamento */}
            <div class="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Agendamento</h2>
              </div>
              <div class="p-6 flex flex-col gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Data e Hora</p>
                  <p class="font-semibold text-gray-900 dark:text-white">28 de Julho, 2024 - 14:00</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Técnico Responsável</p>
                  <div class="flex items-center gap-3 mt-2">
                    <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDn6jkjPamSygzr9UXc80ubuyXEmJBJK-sLvAe8bLViZ8XXXT9MPgJCOiUBWdu4f_LnsiJlEKCXsJlpkupjIk1uM--nvRa84DPJrFMnz0dF3X3B1yRGMTeKzCDIpYkNuvskE4eJBN_-tm7dLWTj5ALTKaev28rCVatcr7juRqPvF_yvHxNiBIHy3QpRtE5qReUWhqnlSOolC_5hZH16uRVYrGFUEwlvIyTbmlMklCAQH9rEDJSUgPZqhScJXdZdwrM7gc-7wbpzh01o")' }}></div>
                    <div class="flex flex-col">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">Carlos Silva</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Técnico de Campo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Histórico de Atividades */}
            <div class="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Histórico de Atividades</h2>
              </div>
              <div class="p-6">
                <ol class="relative border-l border-gray-200 dark:border-gray-700 ml-2">
                  <li class="mb-6 ml-6">
                    <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full -left-3 ring-8 ring-white dark:ring-[#18202F]">
                      <span class="material-symbols-outlined text-blue-600 dark:text-blue-300 text-sm">assignment_turned_in</span>
                    </span>
                    <h3 class="flex items-center mb-1 text-sm font-semibold text-gray-900 dark:text-white">Status alterado para 'Em Andamento'</h3>
                    <time class="block mb-2 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">28 de Julho, 2024 - 14:05</time>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Técnico iniciou o serviço no local.</p>
                  </li>
                  <li class="mb-6 ml-6">
                    <span class="absolute flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full -left-3 ring-8 ring-white dark:ring-[#18202F]">
                      <span class="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">person_add</span>
                    </span>
                    <h3 class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Técnico Designado</h3>
                    <time class="block mb-2 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">27 de Julho, 2024 - 10:30</time>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Carlos Silva foi designado para esta ordem.</p>
                  </li>
                  <li class="ml-6">
                    <span class="absolute flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full -left-3 ring-8 ring-white dark:ring-[#18202F]">
                      <span class="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">add_task</span>
                    </span>
                    <h3 class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Ordem de Serviço Criada</h3>
                    <time class="block mb-2 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">27 de Julho, 2024 - 09:15</time>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
