import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const Quotes: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleAction = (action: string) => {
    showToast('info', `Ação "${action}" ainda não implementada nesta demonstração.`);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">Gerenciamento de Orçamentos</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Visualize, filtre e gerencie todos os orçamentos da sua empresa.</p>
          </div>
          <button
            onClick={() => navigate('/quotes/new')}
            className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span className="truncate">Novo Orçamento</span>
          </button>
        </div>

        {/* Main content container */}
        <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          {/* Search and Filter Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="flex flex-col w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                    <div className="text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-gray-800 items-center justify-center pl-3 rounded-l-lg border border-gray-300 dark:border-gray-700 border-r-0">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:border-primary h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-sm font-normal leading-normal" placeholder="Buscar por ID do orçamento ou nome do cliente" />
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction('Filtrar')}
                  className="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="material-symbols-outlined">filter_list</span>
                  <span className="truncate">Filtrar</span>
                </button>
                <button
                  onClick={() => handleAction('Exportar')}
                  className="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="material-symbols-outlined">download</span>
                  <span className="truncate">Exportar</span>
                </button>
              </div>
            </div>
            {/* Chips */}
            <div className="flex gap-2 pt-3 overflow-x-auto">
              <button
                onClick={() => handleAction('Mudar Status')}
                className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Status: Todos</p>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button
                onClick={() => handleAction('Mudar Cliente')}
                className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Cliente</p>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button
                onClick={() => handleAction('Limpar Filtros')}
                className="flex h-8 shrink-0 items-center justify-center gap-x-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <p className="text-sm font-medium leading-normal">Limpar Filtros</p>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="p-4" scope="col">
                    <div className="flex items-center">
                      <input id="checkbox-all" type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                    </div>
                  </th>
                  <th className="px-6 py-3" scope="col">ID do Orçamento</th>
                  <th className="px-6 py-3" scope="col">Cliente</th>
                  <th className="px-6 py-3" scope="col">Data de Criação</th>
                  <th className="px-6 py-3" scope="col">Valor Total</th>
                  <th className="px-6 py-3" scope="col">Status</th>
                  <th className="px-6 py-3 text-right" scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'QT-2024-001', client: 'Inovatech Soluções', date: '15 de Jul, 2024', value: 'R$ 1.500,00', status: 'Aprovado', color: 'green' },
                  { id: 'QT-2024-002', client: 'Construtora Alfa', date: '14 de Jul, 2024', value: 'R$ 8.750,00', status: 'Enviado', color: 'blue' },
                  { id: 'QT-2024-003', client: 'Mercado Central', date: '12 de Jul, 2024', value: 'R$ 3.200,00', status: 'Rejeitado', color: 'red' },
                  { id: 'QT-2024-004', client: 'Tech Logística', date: '11 de Jul, 2024', value: 'R$ 500,00', status: 'Rascunho', color: 'gray' },
                ].map((item, idx) => (
                  <tr key={item.id} className="bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input id={`checkbox-table-${idx}`} type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor={`checkbox-table-${idx}`} className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">#{item.id}</th>
                    <td className="px-6 py-4">{item.client}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4">{item.value}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-${item.color}-100 text-${item.color}-800 dark:bg-${item.color}-900 dark:text-${item.color}-200`}>
                        <span className={`size-1.5 inline-block rounded-full bg-${item.color}-500`}></span> {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction('Visualizar')}
                          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                        <button
                          onClick={() => handleAction('Editar')}
                          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleAction('Mais opções')}
                          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <span className="material-symbols-outlined text-base">more_horiz</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav className="flex items-center justify-between p-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Mostrando <span className="font-semibold text-gray-900 dark:text-white">1-4</span> de <span className="font-semibold text-gray-900 dark:text-white">100</span></span>
            <ul className="inline-flex -space-x-px text-sm h-8">
              <li>
                <button onClick={() => handleAction('Página Anterior')} className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Anterior</button>
              </li>
              <li>
                <button aria-current="page" className="flex items-center justify-center px-3 h-8 text-primary border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">1</button>
              </li>
              <li>
                <button onClick={() => handleAction('Página 2')} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</button>
              </li>
              <li>
                <button className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</button>
              </li>
              <li>
                <button onClick={() => handleAction('Página 25')} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">25</button>
              </li>
              <li>
                <button onClick={() => handleAction('Próxima Página')} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Próximo</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
