import React from 'react';

const Settings: React.FC = () => {
  return (
    <div class="flex h-full flex-col p-6 lg:p-10">
      <div class="mx-auto max-w-4xl w-full">
        {/* Page Heading */}
        <div class="flex flex-wrap justify-between gap-3 mb-8">
          <div class="flex min-w-72 flex-col gap-2">
            <h1 class="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Dados da Empresa</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Gerencie as informações de contato, endereço e logotipo da sua empresa.</p>
          </div>
          <div class="flex items-end gap-2 flex-wrap">
            <button class="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal hover:bg-slate-300 dark:hover:bg-gray-700 transition-colors">
              <span class="truncate">Cancelar</span>
            </button>
            <button class="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors">
              <span class="truncate">Salvar Alterações</span>
            </button>
          </div>
        </div>

        {/* Logo Card */}
        <div class="mb-8">
          <div class="flex flex-col items-stretch justify-start rounded-xl sm:flex-row sm:items-center bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800">
            <div class="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-6">
              <p class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4 sm:mb-2">Logotipo da Empresa</p>
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <p class="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Faça o upload do logotipo que será exibido nas comunicações e na plataforma.</p>
                <div class="flex items-center gap-4 flex-shrink-0">
                  <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 border border-slate-200 dark:border-gray-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmiLAWQxvLogCRpJBHZT9IRWHzjPQb83U2a3kO3ctLf0pHAs1V9ugtanqfeGsW2Kq715vhhjtu63OcNqNwK6BWzXz8WWHWpcuxKdlQpM1s5hECf41PoEWpzQKkkJZmkbXBZGbtoi8eXpsiz2hE2Wc34Ni4dBjJXT7BvU7dK1NfsTzXsdrbUxB88bEfAKe7Mes2vu7-PSvBlIfLijQaIBng0Ru9cfh1-5yLatDJqbUOVnr6I5hyip2dDigWxYMl7kuQdy_XjnHj0let")' }}></div>
                  <button class="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors">
                    <span class="truncate">Fazer Upload</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div class="rounded-xl bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800">
          {/* Contact Information Section */}
          <div class="p-6 border-b border-slate-200 dark:border-gray-800">
            <h2 class="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-1">Informações de Contato</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Atualize os detalhes de contato da sua empresa.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <label class="flex flex-col">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Nome da Empresa</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" value="Nome da Empresa LTDA" />
              </label>
              <label class="flex flex-col">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">CNPJ</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" value="00.000.000/0001-00" />
              </label>
              <label class="flex flex-col">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">E-mail de Contato</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" type="email" value="contato@empresa.com" />
              </label>
              <label class="flex flex-col">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Telefone</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" type="tel" value="(11) 99999-9999" />
              </label>
            </div>
          </div>
          {/* Address Section */}
          <div class="p-6">
            <h2 class="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-1">Endereço</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Informe o endereço comercial principal.</p>
            <div class="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-5">
              <label class="flex flex-col md:col-span-2">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">CEP</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" value="01001-000" />
              </label>
              <label class="flex flex-col md:col-span-4">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Logradouro</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" value="Praça da Sé" />
              </label>
              <label class="flex flex-col md:col-span-2">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Número</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" value="100" />
              </label>
              <label class="flex flex-col md:col-span-4">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Complemento</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" value="Lado par" />
              </label>
              <label class="flex flex-col md:col-span-3">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Cidade</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" value="São Paulo" />
              </label>
              <label class="flex flex-col md:col-span-3">
                <p class="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Estado</p>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal" value="SP" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
