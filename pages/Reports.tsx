import React from 'react';

const Reports: React.FC = () => {
  return (
    <div class="flex h-full flex-col">
      <div class="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div class="flex flex-wrap justify-between gap-4 items-start">
          <div class="flex min-w-72 flex-col gap-2">
            <h1 class="text-[#0d121b] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Relatórios Personalizados</h1>
            <p class="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-normal">Crie, visualize e exporte relatórios sobre as operações da sua empresa.</p>
          </div>
          <div class="relative">
            <button class="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
              <span class="material-symbols-outlined">download</span>
              <span class="truncate">Exportar</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Filters Panel */}
          <aside class="w-full lg:w-80 lg:flex-shrink-0">
            <div class="bg-white dark:bg-[#18202F] rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 class="text-[#0d121b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2">Filtros</h3>
              <div class="space-y-6 mt-4">
                {/* Period Filter */}
                <div>
                  <p class="text-[#0d121b] dark:text-gray-300 text-base font-medium leading-normal pb-3">Período</p>
                  <div class="flex h-10 w-full items-center justify-center rounded-lg bg-[#e7ebf3] dark:bg-background-dark p-1">
                    <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-[#0d121b] dark:has-[:checked]:text-white text-[#4c669a] dark:text-gray-400">
                      <span class="truncate">Dia</span><input class="sr-only" name="period" type="radio" value="Dia" />
                    </label>
                    <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-[#0d121b] dark:has-[:checked]:text-white text-[#4c669a] dark:text-gray-400">
                      <span class="truncate">Semana</span><input class="sr-only" name="period" type="radio" value="Semana" />
                    </label>
                    <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-[#0d121b] dark:has-[:checked]:text-white text-[#4c669a] dark:text-gray-400">
                      <span class="truncate">Mês</span><input class="sr-only" name="period" type="radio" value="Mês" defaultChecked />
                    </label>
                    <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-[#0d121b] dark:has-[:checked]:text-white text-[#4c669a] dark:text-gray-400">
                      <span class="truncate">Ano</span><input class="sr-only" name="period" type="radio" value="Ano" />
                    </label>
                  </div>
                  <div class="relative mt-3">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">calendar_month</span>
                    <input class="w-full h-10 pl-10 pr-3 bg-[#e7ebf3] dark:bg-background-dark text-[#0d121b] dark:text-white rounded-lg border-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm" placeholder="Período customizado" type="text" />
                  </div>
                </div>
                {/* Metrics Filter */}
                <div>
                  <p class="text-[#0d121b] dark:text-gray-300 text-base font-medium leading-normal pb-3">Métricas</p>
                  <div class="relative">
                    <select class="w-full appearance-none h-10 px-3 pr-8 bg-[#e7ebf3] dark:bg-background-dark text-[#0d121b] dark:text-white rounded-lg border-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                      <option>Número de serviços concluídos</option>
                      <option>Receita total</option>
                      <option>Tempo médio de serviço</option>
                    </select>
                    <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">expand_more</span>
                  </div>
                </div>
                {/* Grouping Filters */}
                <div>
                  <p class="text-[#0d121b] dark:text-gray-300 text-base font-medium leading-normal pb-3">Agrupamento</p>
                  <div class="space-y-3">
                    <div class="relative">
                      <select class="w-full appearance-none h-10 px-3 pr-8 bg-[#e7ebf3] dark:bg-background-dark text-[#0d121b] dark:text-white rounded-lg border-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        <option>Todos os técnicos</option>
                        <option>Carlos Silva</option>
                        <option>Mariana Costa</option>
                      </select>
                      <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">expand_more</span>
                    </div>
                    <div class="relative">
                      <select class="w-full appearance-none h-10 px-3 pr-8 bg-[#e7ebf3] dark:bg-background-dark text-[#0d121b] dark:text-white rounded-lg border-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        <option>Todos os tipos de serviço</option>
                        <option>Instalação</option>
                        <option>Manutenção</option>
                      </select>
                      <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">expand_more</span>
                    </div>
                    <div class="relative">
                      <select class="w-full appearance-none h-10 px-3 pr-8 bg-[#e7ebf3] dark:bg-background-dark text-[#0d121b] dark:text-white rounded-lg border-transparent focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        <option>Todos os clientes</option>
                        <option>Cliente A</option>
                        <option>Cliente B</option>
                      </select>
                      <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-8 flex flex-col gap-3">
                <button class="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                  <span class="truncate">Gerar Relatório</span>
                </button>
                <button class="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-[#e7ebf3] dark:bg-gray-700 text-[#0d121b] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <span class="truncate">Limpar Filtros</span>
                </button>
              </div>
            </div>
          </aside>
          {/* Report Display Area */}
          <div class="flex-1">
            <div class="flex flex-col items-center justify-center h-full min-h-64 sm:min-h-80 md:min-h-[24rem] bg-white dark:bg-[#18202F] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <div class="flex items-center justify-center size-24 bg-[#e7ebf3] dark:bg-background-dark rounded-full mb-6">
                <span class="material-symbols-outlined text-5xl text-primary">analytics</span>
              </div>
              <h3 class="text-xl font-bold text-[#0d121b] dark:text-white">Selecione os filtros para começar</h3>
              <p class="text-[#4c669a] dark:text-gray-400 mt-2 max-w-sm">Use o painel à esquerda para configurar e gerar seu relatório personalizado. Os resultados aparecerão aqui.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
