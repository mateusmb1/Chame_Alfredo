import React from 'react';

const Team: React.FC = () => {
  const teamMembers = [
    { name: 'Ana Silva', email: 'ana.silva@empresa.com', role: 'Administrador', status: 'Ativo', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLCgop3H7fghDGwFHJqAPelchzSnFAYtolSKdUYz-GzriqX1Hut9tGyIFBZWZJ8t4qhoZOfwhKg4IsmKqyBC3yb-4E0Ed_ShhRs92ZPTal_ljPz7vJ1UAYXFjtWpq_1WBRs1Nv4Hn_HL2FeBakDPShrhxSvUbDPI6CUSP_MbUbosI_9QIHUra2W7Uc25zBE_31GKUbMvogujg2f4x8Tq7hW_QVXaHZ0AdzDU-E8MU9jgaYiq6ynZDxfh62vEtLSMmbaQSP9BkyQwHK' },
    { name: 'Carlos Pereira', email: 'carlos.p@empresa.com', role: 'Técnico de Campo', status: 'Ativo', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN4zyx2Jx-oqkA5W8DvD-efh90lNtwiqvrrcoRYkDEsVnvHd27ahrLiCxxRnfCEU_FgSvpgHLt9Et4AWV-P2zGvt2AfXmM4GYScO9MsuG4muhu7U5f5ONlKxgziVz1im71HH-G1K5jsirfW147wmS3nhuUQsSbKBVC9OWEBMNweTQ0IBFA6LS9gt2TxJ8WDAFFSvMMz5dTtVaUsSzuFKOydnZM2O14G3JRpItozQFVpczJ5Al5tmpxtcNZDFRz8XhdT7S-YG1yjp-A' },
    { name: 'Bruna Costa', email: 'bruna.costa@empresa.com', role: 'Gerente de Estoque', status: 'Inativo', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxmpqGkXgRDBPHI5m4PoyirHiEaus71GZ3tgrKnJUN5uAzIu2u5udbaG2EWi8dCXhGWYr3YR_kebruVNp6iYGiFKEt1c9KAEW3vcYYVf3RkaF9z47KJdJ3QjmBQ30IleB_5uyyMtyiwTnDmAVBiqK2_3GWqQBFbjRBj1lsxOaI6eJ9UlWgFiugzG5syxkdPd4PguqMoS5MWXJRezx9jeaio3R5j9c-xIXt_oj25sW9iMgHjaI7x8JAulcQq8KvYWuBbNioRMn-t-kZ' },
    { name: 'Juliana Martins', email: 'juliana.m@empresa.com', role: 'Técnico de Campo', status: 'Ativo', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAby3KDLdj4tE1BSs_R_DTdSurY-YYDDBQ42ZDHFCe19jEe3iahjUd3aZin-QCSYHeckNKm3kUCcVEp9u75MJCTxmPauobqyCmb2iLEeNoxa5ULLcN1R2S5hjuvta4bYvQyKUqZR_YZJYwdIjeiaun8H7AMrmlKUF9McpSOi-5ZJYRQm2uxds6EladTB5OCXwfbr-6z92aH8IcQhnWtZjPuW_FuV_C6ZJiyW7U3txc3yMeuaAHA_1d9wYBSh3WSVxGR-6vyPbjW07jn' },
  ];

  return (
    <div class="flex flex-1 flex-col p-6 lg:p-8">
      <div class="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex flex-col gap-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Gerenciamento de Equipe</h1>
            <p class="text-gray-600 dark:text-gray-400">Adicione, edite e gerencie os usuários da plataforma.</p>
          </div>
          <button class="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors">
            <span class="material-symbols-outlined text-base">add</span>
            <span class="truncate">Adicionar Novo Usuário</span>
          </button>
        </div>

        {/* Filters */}
        <div class="mb-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18202F] p-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="md:col-span-2">
              <label class="flex h-12 w-full flex-col">
                <div class="flex h-full w-full flex-1 items-stretch rounded-lg">
                  <div class="text-gray-400 flex items-center justify-center rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 pl-4">
                    <span class="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-l-0 border-gray-200 bg-background-light text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 h-full px-4 text-sm" placeholder="Buscar por nome ou e-mail..." />
                </div>
              </label>
            </div>
            <div class="flex items-center gap-2">
              <button class="flex h-12 flex-1 shrink-0 items-center justify-between gap-x-2 rounded-lg border border-gray-200 bg-background-light dark:border-gray-700 dark:bg-gray-800 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-xl text-gray-500 dark:text-gray-400">badge</span>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Função: Todos</p>
                </div>
                <span class="material-symbols-outlined text-lg text-gray-400">expand_more</span>
              </button>
              <button class="flex h-12 flex-1 shrink-0 items-center justify-between gap-x-2 rounded-lg border border-gray-200 bg-background-light dark:border-gray-700 dark:bg-gray-800 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-xl text-gray-500 dark:text-gray-400">toggle_on</span>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Status: Todos</p>
                </div>
                <span class="material-symbols-outlined text-lg text-gray-400">expand_more</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18202F]">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Nome do Usuário</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">E-mail</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Função</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#18202F]">
                {teamMembers.map((member, index) => (
                  <tr key={index}>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img class="h-10 w-10 rounded-full object-cover" src={member.avatar} alt={`Avatar de ${member.name}`} />
                        </div>
                        <div class="ml-4">
                          <div class="font-medium text-gray-900 dark:text-white">{member.name}</div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{member.role}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        member.status === 'Ativo' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span class="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18202F] px-4 py-3 sm:px-6">
            <div class="flex flex-1 justify-between sm:hidden">
              <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Anterior</a>
              <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Próximo</a>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-400">
                  Mostrando <span class="font-medium">1</span> a <span class="font-medium">4</span> de <span class="font-medium">23</span> resultados
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <a href="#" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0">
                    <span class="material-symbols-outlined text-base">chevron_left</span>
                  </a>
                  <a href="#" class="relative z-10 inline-flex items-center bg-primary/10 dark:bg-primary/20 px-4 py-2 text-sm font-semibold text-primary focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">1</a>
                  <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0">2</a>
                  <a href="#" class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a>
                  <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:outline-offset-0">...</span>
                  <a href="#" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0">
                    <span class="material-symbols-outlined text-base">chevron_right</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;