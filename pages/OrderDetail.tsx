import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Order } from '../types/order';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, clients, updateOrder } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [id, orders]);

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Carregando detalhes da ordem...</p>
      </div>
    );
  }

  const client = clients.find(c => c.id === order.clientId);

  const handleStatusChange = (newStatus: Order['status']) => {
    updateOrder(order.id, { status: newStatus });
    setIsStatusMenuOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'em_andamento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'pendente': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'finalizada': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelada': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nova': return 'Nova';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'finalizada': return 'Finalizada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="flex h-full flex-col p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Link to="/dashboard" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary">Home</Link>
            <span className="text-gray-400 text-sm font-medium">/</span>
            <Link to="/orders" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary">Ordens de Serviço</Link>
            <span className="text-gray-400 text-sm font-medium">/</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">#{order.id.substring(0, 8)}</span>
          </div>
          {/* Page Heading & Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ordem de Serviço #{order.id.substring(0, 8)}</h1>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap relative">
              <div className="relative">
                <button
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-base">swap_horiz</span>
                  <span className="truncate">Mudar Status</span>
                </button>
                {isStatusMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1" role="menu">
                      {(['nova', 'em_andamento', 'pendente', 'finalizada', 'cancelada'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(s)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {getStatusLabel(s)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button className="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-base">edit</span>
                <span className="truncate">Editar Ordem</span>
              </button>
              <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-xl">print</span>
              </button>
            </div>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (Left) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Card: Detalhes do Cliente */}
            <div className="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detalhes do Cliente</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome do Cliente</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">E-mail</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{client?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Telefone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{client?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Endereço</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{client?.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Card: Detalhes do Serviço */}
            <div className="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detalhes do Serviço</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo de Serviço</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prioridade</p>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${order.priority === 'urgente' ? 'bg-red-100 text-red-600' :
                      order.priority === 'alta' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                    {order.priority}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Descrição do Problema</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.description}</p>
                </div>
                {order.serviceNotes && (
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Relatório do Técnico</p>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{order.serviceNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card: Fotos do Serviço */}
            {order.servicePhotos && order.servicePhotos.length > 0 && (
              <div className="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fotos do Serviço</h2>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {order.servicePhotos.map((photo: any, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img src={photo.url} alt={`Serviço ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Column (Right) */}
          <div className="flex flex-col gap-8">
            {/* Card: Agendamento */}
            <div className="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Agendamento</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Data e Hora</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(order.scheduledDate).toLocaleDateString('pt-BR')} - {new Date(order.scheduledDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Técnico Responsável</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-primary/10 flex items-center justify-center rounded-full size-10">
                      <span className="material-symbols-outlined text-primary">person</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.technicianName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Técnico de Campo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: App Técnico Insights */}
            {(order.checkIn || order.checkOut || order.customerSignature) && (
              <div className="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Atividade do Técnico</h2>
                </div>
                <div className="p-6 space-y-4">
                  {order.checkIn && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Check-in</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(order.checkIn.timestamp).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  )}
                  {order.checkOut && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Check-out</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(order.checkOut.timestamp).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  )}
                  {order.customerSignature && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Assinatura do Cliente</p>
                      <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                        <img src={order.customerSignature} alt="Assinatura" className="h-20 w-auto mx-auto grayscale invert dark:invert-0" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
