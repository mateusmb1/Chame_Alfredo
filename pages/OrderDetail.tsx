import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Order } from '../types/order';

import { supabase } from '../src/lib/supabase';
import SignaturePad from '../components/SignaturePad';
import CurrencyInput from '../components/CurrencyInput';
import { useToast } from '../contexts/ToastContext';

interface ExtraItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  approved: boolean;
}
const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, clients, updateOrder } = useApp();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Extra Items State
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
  const [newExtraItem, setNewExtraItem] = useState<ExtraItem>({ description: '', quantity: 1, unit_price: 0, total_price: 0, approved: false });
  const [isTechMode, setIsTechMode] = useState(false); // Toggle for Technician View
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoadingExtras, setIsLoadingExtras] = useState(false);

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      fetchExtras(foundOrder.id);
    }
  }, [id, orders]);

  const fetchExtras = async (orderId: string) => {
    const { data, error } = await supabase
      .from('order_extra_items')
      .select('*')
      .eq('order_id', orderId);
    if (data) setExtraItems(data);
  };

  const handleAddExtraItem = async () => {
    if (!order || !newExtraItem.description) return;
    setIsLoadingExtras(true);
    try {
      const itemToSave = {
        order_id: order.id,
        description: newExtraItem.description,
        quantity: newExtraItem.quantity,
        unit_price: newExtraItem.unit_price,
        approved: false
      };

      const { data, error } = await supabase.from('order_extra_items').insert([itemToSave]).select().single();
      if (error) throw error;
      if (data) {
        setExtraItems([...extraItems, data]);
        setNewExtraItem({ description: '', quantity: 1, unit_price: 0, total_price: 0, approved: false });
        showToast('success', 'Item extra adicionado!');
      }
    } catch (e: any) {
      showToast('error', 'Erro ao adicionar item.');
    } finally {
      setIsLoadingExtras(false);
    }
  };

  const handleApproveExtras = async () => {
    if (!order || !signature) {
      showToast('error', 'A assinatura é obrigatória para aprovação.');
      return;
    }

    // 1. Update all items to approved
    // 2. Save signature to order
    // 3. Change status to 'pendente' or 'em_andamento'
    try {
      await supabase.from('order_extra_items').update({ approved: true }).eq('order_id', order.id);

      // Save signature (assuming customer_signature column handles base64 or url)
      // If image storage is needed, we usually upload to bucket first. For now, assuming base64 text or we need to upload.
      // Let's implement lightweight upload flow or just save base64 if column allows text/varchar(large).
      // Since `customer_signature` in Order type is string (url usually), let's upload.

      const sigFile = await fetch(signature).then(r => r.blob());
      const fileName = `sig_${order.id}_${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('signatures').upload(fileName, sigFile);

      let publicUrl = signature; // Fallback to base64 if upload fails? No, usually database TEXT limit.

      if (!uploadError && uploadData) {
        const { data } = supabase.storage.from('signatures').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      }

      updateOrder(order.id, {
        customerSignature: publicUrl,
        // Automatically add extras to service notes or keep separate
      });

      // Refresh local items
      setExtraItems(prev => prev.map(i => ({ ...i, approved: true })));
      showToast('success', 'Itens aprovados com sucesso!');
      setSignature(null);
    } catch (error) {
      showToast('error', 'Erro na aprovação.');
    }
  };

  const totalExtras = extraItems.reduce((sum, start) => sum + (start.quantity * start.unit_price), 0);

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

  const handlePrint = () => {
    navigate(`/orders/${order.id}/print`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'em_andamento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'pendente': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'concluida': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelada': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nova': return 'Nova';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'concluida': return 'Concluída';
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
                <button
                  onClick={() => navigate('/orders')}
                  className="mr-1 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                  title="Voltar para Ordens"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
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
                      {(['nova', 'em_andamento', 'pendente', 'concluida', 'cancelada'] as const).map((s) => (
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
              <button
                onClick={handlePrint}
                className="flex w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="material-symbols-outlined text-xl">print</span>
                <span className="hidden sm:inline">Gerar Relatório</span>
              </button>
            </div>
          </div>
        </header>

        {/* Technician Toggle */}
        <div className="flex justify-end mb-4">
          <label className="flex items-center cursor-pointer gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Modo Técnico</span>
            <input type="checkbox" checked={isTechMode} onChange={e => setIsTechMode(e.target.checked)} className="toggle toggle-primary" />
          </label>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (Left) */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Extras & Approval Section */}
            <div className="bg-white dark:bg-[#18202F] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Itens Adicionais & Diagnóstico</h2>
                <span className="text-sm font-bold text-primary">Total Extra: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExtras)}</span>
              </div>

              {/* List of Extras */}
              <div className="p-0">
                {extraItems.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Descrição</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white text-right">Qtd</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white text-right">Valor Unit.</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white text-right">Total</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {extraItems.map(item => (
                        <tr key={item.id}>
                          <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{item.description}</td>
                          <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                          <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">R$ {item.unit_price}</td>
                          <td className="px-6 py-3 text-right font-bold text-gray-900 dark:text-white">R$ {(item.quantity * item.unit_price).toFixed(2)}</td>
                          <td className="px-6 py-3 text-center">
                            {item.approved ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Aprovado</span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pendente</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">Nenhum item adicional registrado.</div>
                )}
              </div>

              {/* Technician Add Form */}
              {isTechMode && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-200 dark:border-gray-800">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Adicionar Item / Peça / Serviço Extra</h4>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Descrição do item..."
                      className="flex-1 rounded-lg border-gray-300 text-sm"
                      value={newExtraItem.description}
                      onChange={e => setNewExtraItem({ ...newExtraItem, description: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Qtd"
                      className="w-20 rounded-lg border-gray-300 text-sm"
                      value={newExtraItem.quantity}
                      onChange={e => setNewExtraItem({ ...newExtraItem, quantity: parseFloat(e.target.value) })}
                    />
                    <CurrencyInput
                      placeholder="Valor Unit."
                      className="w-32 rounded-lg border-gray-300 text-sm"
                      value={newExtraItem.unit_price}
                      onChange={val => setNewExtraItem({ ...newExtraItem, unit_price: val })}
                    />
                    <button
                      onClick={handleAddExtraItem}
                      disabled={isLoadingExtras}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              {/* Client Approval */}
              {extraItems.some(i => !i.approved) && !isTechMode && (
                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-900/20">
                  <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-2">Aprovação Necessária</h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-4">
                    Existem itens adicionais que requerem sua autorização para prosseguir. O valor total acrescido será de <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(extraItems.filter(i => !i.approved).reduce((s, x) => s + (x.quantity * x.unit_price), 0))}</strong>.
                  </p>

                  <div className="max-w-md mx-auto">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sua Assinatura</label>
                    <SignaturePad
                      onSave={setSignature}
                      onClear={() => setSignature(null)}
                      className="mb-4"
                    />
                    {signature && (
                      <button
                        onClick={handleApproveExtras}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-green-700 shadow-lg"
                      >
                        Aprovar Orçamento Extra
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                    <div
                      key={index}
                      onClick={() => setSelectedPhoto(photo.url)}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <img src={photo.url} alt={`Serviço ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lightbox Modal */}
            {selectedPhoto && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                onClick={() => setSelectedPhoto(null)}
              >
                <button
                  className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
                <img
                  src={selectedPhoto}
                  alt="Full size"
                  className="max-h-full max-w-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                />
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
