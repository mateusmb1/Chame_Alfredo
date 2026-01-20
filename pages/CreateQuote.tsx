import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const CreateQuote: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSave = () => {
    showToast('success', 'Orçamento salvo com sucesso!');
    navigate('/quotes');
  };

  const handleAction = (action: string) => {
    showToast('info', `Ação "${action}" ainda não implementada nesta demonstração.`);
  };

  return (
    <div className="flex flex-1 flex-col p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">Criar Novo Orçamento</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Preencha os detalhes abaixo para criar um novo orçamento.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/quotes')}
              className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="truncate">Cancelar</span>
            </button>
            <button
              onClick={handleSave}
              className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span className="truncate">Salvar Orçamento</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6 space-y-8">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informações Gerais</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
                  <div className="flex items-center gap-2">
                    <select id="cliente" className="form-select flex-1 w-full rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-10 px-3 text-sm">
                      <option>Selecione um cliente existente</option>
                      <option>Inovatech Soluções</option>
                      <option>Construtora Alfa</option>
                    </select>
                    <button
                      onClick={() => handleAction('Adicionar novo cliente')}
                      className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="data-orcamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data do Orçamento</label>
                  <input type="date" id="data-orcamento" className="form-input w-full rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-10 px-3 text-sm" defaultValue="2024-07-26" />
                </div>
                <div>
                  <label htmlFor="validade-orcamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validade do Orçamento</label>
                  <input type="date" id="validade-orcamento" className="form-input w-full rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-10 px-3 text-sm" />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Itens do Orçamento</h2>
                <button
                  onClick={() => handleAction('Adicionar item')}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  Adicionar Item
                </button>
              </div>
              <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="p-3 font-medium w-2/5">Descrição</th>
                      <th className="p-3 font-medium w-1/6">Quantidade</th>
                      <th className="p-3 font-medium w-1/6">Valor Unit.</th>
                      <th className="p-3 font-medium w-1/6 text-right">Subtotal</th>
                      <th className="p-3 font-medium w-auto"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900 dark:text-white">
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="p-3"><input type="text" className="form-input w-full bg-transparent border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-primary focus:border-primary" placeholder="Descrição do serviço ou produto" defaultValue="Instalação de Sistema de Segurança" /></td>
                      <td className="p-3"><input type="number" className="form-input w-full bg-transparent border-gray-300 dark:border-gray-700 rounded-md text-sm text-right focus:ring-primary focus:border-primary" defaultValue="1" /></td>
                      <td className="p-3"><input type="text" className="form-input w-full bg-transparent border-gray-300 dark:border-gray-700 rounded-md text-sm text-right focus:ring-primary focus:border-primary" defaultValue="1.200,00" /></td>
                      <td className="p-3 text-right">R$ 1.200,00</td>
                      <td className="p-3 text-center"><button onClick={() => handleAction('Excluir item')} className="text-gray-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button></td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="p-3"><input type="text" className="form-input w-full bg-transparent border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-primary focus:border-primary" placeholder="Descrição do serviço ou produto" defaultValue="Manutenção Mensal" /></td>
                      <td className="p-3"><input type="number" className="form-input w-full bg-transparent border-gray-300 dark:border-gray-700 rounded-md text-sm text-right focus:ring-primary focus:border-primary" defaultValue="3" /></td>
                      <td className="p-3"><input type="text" className="form-input w-full bg-transparent border-gray-300 dark:border-gray-700 rounded-md text-sm text-right focus:ring-primary focus:border-primary" defaultValue="100,00" /></td>
                      <td className="p-3 text-right">R$ 300,00</td>
                      <td className="p-3 text-center"><button onClick={() => handleAction('Excluir item')} className="text-gray-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label htmlFor="condicoes-pagamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condições de Pagamento</label>
                  <input type="text" id="condicoes-pagamento" className="form-input w-full rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-10 px-3 text-sm" placeholder="Ex: 50% adiantado, 50% na entrega" />
                </div>
                <div>
                  <label htmlFor="notas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas Adicionais</label>
                  <textarea id="notas" rows={4} className="form-textarea w-full rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary px-3 py-2 text-sm" placeholder="Qualquer informação adicional relevante para o cliente."></textarea>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 flex flex-col justify-between">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">R$ 1.500,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Descontos</span>
                    <div className="w-24"><input type="text" className="form-input w-full bg-transparent border-gray-300 dark:border-gray-700 rounded-md text-sm text-right focus:ring-primary focus:border-primary" defaultValue="R$ 0,00" /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Impostos (e.g. ISS 5%)</span>
                    <div className="w-24"><input type="text" className="form-input w-full bg-transparent border-gray-300 dark:border-gray-700 rounded-md text-sm text-right focus:ring-primary focus:border-primary" defaultValue="R$ 75,00" /></div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Valor Total</span>
                    <span className="text-primary">R$ 1.575,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => navigate('/quotes')}
              className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="truncate">Cancelar</span>
            </button>
            <button
              onClick={() => handleAction('Enviar por E-mail')}
              className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-primary border border-primary/30 text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/30 transition-colors"
            >
              <span className="material-symbols-outlined text-base">email</span>
              <span className="truncate">Enviar por E-mail</span>
            </button>
            <button
              onClick={handleSave}
              className="flex w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span className="truncate">Salvar Orçamento</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuote;
