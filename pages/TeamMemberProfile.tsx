import React from 'react';
import { useParams } from 'react-router-dom';

const TeamMemberProfile: React.FC = () => {
  const { id } = useParams();

  return (
    <div class="flex flex-1 flex-col p-6 lg:p-8">
      <div class="mx-auto max-w-7xl">
        {/* Profile Header */}
        <div class="flex w-full flex-col gap-4 rounded-xl bg-white dark:bg-[#18202F] p-6 shadow-sm md:flex-row md:items-center md:justify-between border border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-5">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 md:h-28 md:w-28 flex-shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBwk8fQU6WWViYmDRhIoRwUnh-M6tab9UahSxA_VeVn17fQ6UMTmNPRIKiq17Z5_Jc5deZVM-hrtwhQflBjtgy6WPT9uXdgEhP99bGutRTrY5Sk05ahz70Epfe8N-6kxjP3vbjPkM1Ka5rB6-d8hsDCp0mu513J_9oQ1eruo5qFZlbyxvzxMsTd1Fg_jjxIGrC1OFFaSlwpiwU2J6Fyx0fFnyu-x5OY3gYlWBwyf9R0qQFAW1vUhdmGMAjCFp7cJU4bMBtm8JsRzhK7")' }}></div>
            <div class="flex flex-col justify-center">
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">João Silva <span class="text-lg font-normal text-gray-500 dark:text-gray-400">(ID: 743)</span></h1>
              <p class="text-base text-gray-600 dark:text-gray-300">Técnico de Campo</p>
              <div class="mt-2 inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300">
                <span class="h-2 w-2 rounded-full bg-green-500"></span>
                Disponível
              </div>
            </div>
          </div>
          <div class="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <button class="flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/10 px-4 text-primary text-sm font-bold leading-normal tracking-[-0.015em] hover:bg-primary/20 transition-colors md:flex-auto">
              <span class="truncate">Editar Perfil</span>
            </button>
            <button class="flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary px-4 text-white text-sm font-bold leading-normal tracking-[-0.015em] hover:bg-primary/90 transition-colors md:flex-auto">
              <span class="truncate">Ver Agenda</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div class="mt-6">
          <button class="flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[-0.015em] hover:bg-primary/90 transition-colors">
            <span class="material-symbols-outlined text-xl">add_task</span>
            <span class="truncate">Atribuir Nova Tarefa</span>
          </button>
        </div>

        {/* Tabs Navigation */}
        <div class="mt-6">
          <div class="border-b border-gray-200 dark:border-gray-800">
            <nav aria-label="Tabs" class="-mb-px flex gap-6 overflow-x-auto">
              <a aria-current="page" class="shrink-0 border-b-2 border-primary px-1 pb-4 text-sm font-bold text-primary" href="#">Resumo</a>
              <a class="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200" href="#">Histórico de Serviços</a>
              <a class="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200" href="#">Avaliações</a>
              <a class="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200" href="#">Documentos</a>
            </nav>
          </div>
        </div>

        <div class="mt-6">
          {/* Section Header */}
          <h3 class="text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Desempenho (KPIs)</h3>
          {/* KPI Cards */}
          <div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div class="overflow-hidden rounded-xl bg-white dark:bg-[#18202F] shadow-sm border border-gray-200 dark:border-gray-800">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="material-symbols-outlined text-3xl text-primary">build_circle</span>
                  </div>
                  <div class="ml-4 w-0 flex-1">
                    <dl>
                      <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Serviços no Mês</dt>
                      <dd class="text-2xl font-bold text-gray-900 dark:text-white">42</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div class="overflow-hidden rounded-xl bg-white dark:bg-[#18202F] shadow-sm border border-gray-200 dark:border-gray-800">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="material-symbols-outlined text-3xl text-green-500">verified</span>
                  </div>
                  <div class="ml-4 w-0 flex-1">
                    <dl>
                      <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Resolução 1º At.</dt>
                      <dd class="text-2xl font-bold text-gray-900 dark:text-white">92%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div class="overflow-hidden rounded-xl bg-white dark:bg-[#18202F] shadow-sm border border-gray-200 dark:border-gray-800">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="material-symbols-outlined text-3xl text-yellow-500">timer</span>
                  </div>
                  <div class="ml-4 w-0 flex-1">
                    <dl>
                      <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Tempo Médio</dt>
                      <dd class="text-2xl font-bold text-gray-900 dark:text-white">1.5h</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div class="overflow-hidden rounded-xl bg-white dark:bg-[#18202F] shadow-sm border border-gray-200 dark:border-gray-800">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="material-symbols-outlined text-3xl text-primary">star</span>
                  </div>
                  <div class="ml-4 w-0 flex-1">
                    <dl>
                      <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Satisfação Média</dt>
                      <dd class="flex items-center gap-1 text-2xl font-bold text-gray-900 dark:text-white">4.8</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Histórico de Serviços */}
          <div class="mt-8">
            <h3 class="text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Histórico de Serviços Recentes</h3>
            <div class="mt-4 flow-root">
              <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl bg-white dark:bg-[#18202F] border border-gray-200 dark:border-gray-800">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                      <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">OS ID</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Cliente</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Data</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Tipo de Serviço</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Ver</span></th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                        <tr>
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">#10542</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Maria Oliveira</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">15/07/2024</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Manutenção Ar Cond.</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm">
                            <span class="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300">Concluído</span>
                          </td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" class="text-primary hover:text-primary/80">Ver<span class="sr-only">, OS #10542</span></a>
                          </td>
                        </tr>
                        <tr>
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">#10539</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Carlos Pereira</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">14/07/2024</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Instalação Elétrica</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm">
                            <span class="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300">Concluído</span>
                          </td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" class="text-primary hover:text-primary/80">Ver<span class="sr-only">, OS #10539</span></a>
                          </td>
                        </tr>
                        <tr>
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">#10531</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Padaria Pão Quente</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">12/07/2024</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Reparo Refrigerador</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm">
                            <span class="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-300">Pendente Peças</span>
                          </td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" class="text-primary hover:text-primary/80">Ver<span class="sr-only">, OS #10531</span></a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberProfile;
