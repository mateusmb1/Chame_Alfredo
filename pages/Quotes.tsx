import React from 'react';
import { Link } from 'react-router-dom';

const Quotes: React.FC = () => {
  return (
    <div class="flex h-full flex-col">
      <div class="p-6 lg:p-8">
        {/* Header */}
        <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div class="flex flex-col gap-1">
            <h1 class="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">Gerenciamento de Orçamentos</h1>
            <p class="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Visualize, filtre e gerencie todos os orçamentos da sua empresa.</p>
          </div>
          <Link to="/quotes/new" class="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/90 transition-colors">
            <span class="material-symbols-outlined text-base">add_circle</span>
            <span class="truncate">Novo Orçamento</span>
          </Link>
        </div>

        {/* Main content container */}
        <div class="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          {/* Search and Filter Section */}
          <div class="p-4 border-b border-gray-200 dark:border-gray-800">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="flex flex-col w-full">
                  <div class="flex w-full flex-1 items-stretch rounded-lg h-10">
                    <div class="text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-gray-800 items-center justify-center pl-3 rounded-l-lg border border-gray-300 dark:border-gray-700 border-r-0">
                      <span class="material-symbols-outlined">search</span>
                    </div>
                    <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:border-primary h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-sm font-normal leading-normal" placeholder="Buscar por ID do orçamento ou nome do cliente" />
                  </div>
                </label>
              </div>
              <div class="flex items-center gap-2">
                <button class="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <span class="material-symbols-outlined">filter_list</span>
                  <span class="truncate">Filtrar</span>
                </button>
                <button class="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <span class="material-symbols-outlined">download</span>
                  <span class="truncate">Exportar</span>
                </button>
              </div>
            </div>
            {/* Chips */}
            <div class="flex gap-2 pt-3 overflow-x-auto">
              <button class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <p class="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Status: Todos</p>
                <span class="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <p class="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Cliente</p>
                <span class="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button class="flex h-8 shrink-0 items-center justify-center gap-x-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <p class="text-sm font-medium leading-normal">Limpar Filtros</p>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="p-4" scope="col">
                    <div class="flex items-center">
                      <input id="checkbox-all" type="checkbox" class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-all" class="sr-only">checkbox</label>
                    </div>
                  </th>
                  <th class="px-6 py-3" scope="col">ID do Orçamento</th>
                  <th class="px-6 py-3" scope="col">Cliente</th>
                  <th class="px-6 py-3" scope="col">Data de Criação</th>
                  <th class="px-6 py-3" scope="col">Valor Total</th>
                  <th class="px-6 py-3" scope="col">Status</th>
                  <th class="px-6 py-3 text-right" scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800">
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input id="checkbox-table-1" type="checkbox" class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-table-1" class="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">#QT-2024-001</th>
                  <td class="px-6 py-4">Inovatech Soluções</td>
                  <td class="px-6 py-4">15 de Jul, 2024</td>
                  <td class="px-6 py-4">R$ 1.500,00</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <span class="size-1.5 inline-block rounded-full bg-green-500"></span> Aprovado
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">visibility</span></button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">edit</span></button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">more_horiz</span></button>
                    </div>
                  </td>
                </tr>
                <tr class="bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800">
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input id="checkbox-table-2" type="checkbox" class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-table-2" class="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">#QT-2024-002</th>
                  <td class="px-6 py-4">Construtora Alfa</td>
                  <td class="px-6 py-4">14 de Jul, 2024</td>
                  <td class="px-6 py-4">R$ 8.750,00</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <span class="size-1.5 inline-block rounded-full bg-blue-500"></span> Enviado
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">visibility</span></button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">edit</span></button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">more_horiz</span></button>
                    </div>
                  </td>
                </tr>
                <tr class="bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800">
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input id="checkbox-table-3" type="checkbox" class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-table-3" class="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">#QT-2024-003</th>
                  <td class="px-6 py-4">Mercado Central</td>
                  <td class="px-6 py-4">12 de Jul, 2024</td>
                  <td class="px-6 py-4">R$ 3.200,00</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      <span class="size-1.5 inline-block rounded-full bg-red-500"></span> Rejeitado
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">visibility</span></button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">edit</span></button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">more_horiz</span></button>
                    </div>
                  </td>
                </tr>
                <tr class="bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800">
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input id="checkbox-table-4" type="checkbox" class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-table-4" class="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">#QT-2024-004</th>
                  <td class="px-6 py-4">Tech Logística</td>
                  <td class="px-6 py-4">11 de Jul, 2024</td>
                  <td class="px-6 py-4">R$ 500,00</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      <span class="size-1.5 inline-block rounded-full bg-gray-500"></span> Rascunho
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">visibility</span></button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">edit</span></button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><span class="material-symbols-outlined text-base">more_horiz</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav class="flex items-center justify-between p-4" aria-label="Table navigation">
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Mostrando <span class="font-semibold text-gray-900 dark:text-white">1-4</span> de <span class="font-semibold text-gray-900 dark:text-white">100</span></span>
            <ul class="inline-flex -space-x-px text-sm h-8">
              <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Anterior</a>
              </li>
              <li>
                <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-primary border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">1</a>
              </li>
              <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
              </li>
              <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
              </li>
              <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">25</a>
              </li>
              <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Próximo</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
