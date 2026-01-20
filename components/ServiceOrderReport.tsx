import React from 'react';
import { Order } from '../types/order';
import { Client } from '../types/client';

interface ServiceOrderReportProps {
    order: Order;
    client?: Client;
}

const ServiceOrderReport: React.FC<ServiceOrderReportProps> = ({ order, client }) => {
    // Mock data for display if real data is missing (ensures report 'appears' populated)
    const items = (order.items && order.items.length > 0) ? order.items : [
        // Only show mock if explicitly needed or leave empty if preferred. 
        // Showing empty message is better than fake data for production, 
        // but for "preview" purposes user might like the example.
        // Let's use empty if DB is fixed, or minimal example if absolutely nothing.
        // { code: '1', name: 'Serviço Exemplo', quantity: 1, unitPrice: 0, total: 0 }
    ];

    const asset = order.asset_info || {
        name: 'N/A',
        location: client?.address || 'N/A',
        brand: 'N/A',
        model: 'N/A',
        serialNumber: 'N/A',
        url: '#'
    };

    const company = {
        name: 'Produtivo',
        phone: '(11) 11111-1111',
        cnpj: '00.000.000/0000-00',
        address: 'Av. Paulista - Bela Vista, São Paulo - SP, Brazil'
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return '-';
            return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return '-'; }
    };

    // Calculate times with safety
    const safeDate = (iso?: string) => {
        if (!iso) return null;
        const d = new Date(iso);
        return isNaN(d.getTime()) ? null : d;
    };

    const startTime = safeDate(order.checkIn?.timestamp);
    const endTime = safeDate(order.checkOut?.timestamp);

    const duration = startTime && endTime
        ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) + ' minutos'
        : '-';

    // Ensure we display something if items exist, otherwise empty array
    const displayItems = items.length > 0 ? items : [];

    return (
        <div className="hidden print:block font-sans text-[10px] leading-tight text-black bg-white w-full max-w-[210mm] mx-auto p-4" id="printable-report">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-black uppercase">Relatório de Visita Técnica</h1>
                <h2 className="text-lg font-bold text-black">({new Date(order.scheduledDate).toLocaleDateString('pt-BR')})</h2>
                <div className="flex justify-between text-[8px] text-gray-500 mt-2 border-b border-gray-300 pb-1">
                    <span>Por: {order.technicianName}</span>
                    <span>Em: {new Date().toLocaleString('pt-BR')}</span>
                </div>
            </div>

            {/* Empresa Responsável */}
            <section className="mb-4">
                <h3 className="font-bold text-xs mb-2 bg-gray-200 p-1 border-l-4 border-gray-400">Empresa responsável</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block font-bold">Nome</span>
                        <span>{company.name}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Telefone fixo</span>
                        <span>{company.phone}</span>
                    </div>
                    <div>
                        <span className="block font-bold">CPF / CNPJ</span>
                        <span>{company.cnpj}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Endereço</span>
                        <span>{company.address}</span>
                    </div>
                </div>
            </section>

            {/* Cliente */}
            <section className="mb-4">
                <h3 className="font-bold text-xs mb-2 bg-gray-200 p-1 border-l-4 border-gray-400">Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block font-bold">Nome</span>
                        <span>{order.clientName}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Razão social</span>
                        <span>{client?.name || order.clientName}</span>
                    </div>
                    <div>
                        <span className="block font-bold">CPF / CNPJ</span>
                        <span>{client?.cpfCnpj || '-'}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Endereço</span>
                        <span>{client?.address || '-'}</span>
                    </div>
                    <div>
                        <span className="block font-bold">URL de abertura de chamados</span>
                        <a href="#" className="text-blue-600 underline text-[8px]">Clique aqui para abertura de chamado</a>
                    </div>
                </div>
            </section>

            {/* Informações do serviço */}
            <section className="mb-4">
                <h3 className="font-bold text-xs mb-2 bg-gray-200 p-1 border-l-4 border-gray-400">Informações do serviço</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block font-bold">Horário planejado</span>
                        <span>{formatDate(order.scheduledDate)}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Horário realizado</span>
                        <span>{formatDate(order.checkIn?.timestamp)} - {formatDate(order.checkOut?.timestamp)}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Tempo de execução</span>
                        <span>{duration}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Tempo de início do atendimento</span>
                        <span>{formatDate(order.checkIn?.timestamp)}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Tempo de finalização do atendimento</span>
                        <span>{formatDate(order.checkOut?.timestamp)}</span>
                    </div>
                </div>
            </section>

            {/* Ativo */}
            <section className="mb-4">
                <h3 className="font-bold text-xs mb-2 bg-gray-200 p-1 border-l-4 border-gray-400">Ativo</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block font-bold">Nome</span>
                        <span>{asset.name}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Local do ativo</span>
                        <span>{asset.location}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Marca</span>
                        <span>{asset.brand}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Modelo</span>
                        <span>{asset.model}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Patrimônio / Número de Série</span>
                        <span>{asset.serialNumber}</span>
                    </div>
                    <div>
                        <span className="block font-bold">URL de abertura de chamados</span>
                        <a href="#" className="text-blue-600 underline text-[8px]">Clique aqui para abertura de chamado</a>
                    </div>
                </div>
            </section>

            {/* Início do Trabalho */}
            <section className="mb-4 page-break-inside-avoid">
                <h3 className="font-bold text-xs mb-2 bg-gray-200 p-1 border-l-4 border-gray-400">Início do Trabalho</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block font-bold">Tipo de serviço</span>
                        <span>{order.serviceType}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Km veículo</span>
                        <span>-</span>
                    </div>
                    <div className="col-span-2">
                        <span className="block font-bold">Localização GPS</span>
                        <div className="text-[9px] text-gray-600">
                            {order.checkIn?.location ? `${order.checkIn.location.lat}, ${order.checkIn.location.lng}` : 'N/A'}
                        </div>
                    </div>
                </div>
            </section>

            {/* Diagnóstico */}
            <section className="mb-4 break-before-page">
                <h3 className="font-bold text-xs mb-2 bg-gray-200 p-1 border-l-4 border-gray-400">Diagnóstico</h3>
                <div className="mb-3">
                    <span className="block font-bold">Relato do cliente</span>
                    <p className="whitespace-pre-wrap">{order.description}</p>
                </div>
                <div className="mb-3">
                    <span className="block font-bold">Descrição do diagnóstico</span>
                    <p className="whitespace-pre-wrap">{order.serviceNotes || 'Sem observações técnicas.'}</p>
                </div>

                {order.servicePhotos && order.servicePhotos.length > 0 && (
                    <div className="mt-2">
                        <div className="grid grid-cols-3 gap-2">
                            {order.servicePhotos.slice(0, 3).map((photo: any, index: number) => (
                                <div key={index} className="flex flex-col">
                                    <span className="text-[9px] font-bold mb-1">Fotos</span>
                                    <div className="relative aspect-[3/4] w-full overflow-hidden border border-gray-300">
                                        <img src={photo.url} alt={`Foto ${index}`} className="object-cover w-full h-full" />
                                    </div>
                                    <span className="text-[8px] text-gray-500 mt-1">{photo.caption || 'Foto do serviço'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Serviços Realizados */}
            <section className="mb-4">
                <h3 className="font-bold text-xs mb-2 bg-gray-200 p-1 border-l-4 border-gray-400">Serviços Realizados</h3>
                <div className="mb-3">
                    <span className="block font-bold mb-2">Descrição do serviço</span>
                    {displayItems.length > 0 ? (
                        <table className="w-full text-left text-[10px] border-collapse">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="font-bold py-1">Código</th>
                                    <th className="font-bold py-1">Nome</th>
                                    <th className="font-bold py-1 text-right">Quantidade</th>
                                    <th className="font-bold py-1 text-right">Preço unitário</th>
                                    <th className="font-bold py-1 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayItems.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-100">
                                        <td className="py-2">{item.code || idx + 1}</td>
                                        <td className="py-2">{item.name || item.description}</td>
                                        <td className="py-2 text-right">{item.quantity}</td>
                                        <td className="py-2 text-right">{formatCurrency(item.unitPrice || 0)}</td>
                                        <td className="py-2 text-right">{formatCurrency(item.total || item.totalPrice || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 italic">Nenhum item adicionado.</p>
                    )}
                </div>

                {/* Pendências */}
                <div className="mt-3">
                    <span className="block font-bold">Pendências</span>
                    <p>Verificar se há pendências relatadas.</p>
                </div>
            </section>

            {/* Fim do Trabalho */}
            <section className="mb-4 page-break-inside-avoid">
                <h3 className="font-bold text-xs mb-2 bg-gray-200 p-1 border-l-4 border-gray-400">Fim do Trabalho</h3>
                <div className="grid grid-cols-2 gap-8 mt-4">
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-[10px]">Assinatura do técnico</span>
                        <div className="border border-gray-300 h-24 flex items-center justify-center p-2 relative">
                            {/* Mock signature for technician or use name */}
                            <span className="font-handwriting text-xl text-gray-600 transform -rotate-3">{order.technicianName.split(' ')[0]}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-[10px]">Assinatura do cliente</span>
                        <div className="border border-gray-300 h-24 flex items-center justify-center p-2">
                            {order.customerSignature ? (
                                <img src={order.customerSignature} className="max-h-20 object-contain grayscale" alt="Assinatura Cliente" />
                            ) : (
                                <span className="text-gray-400 text-[9px]">Não assinado</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="text-[8px] text-gray-400 mt-8 border-t border-gray-200 pt-2">
                Gerado via Sistema Chame Alfredo
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        .font-handwriting { font-family: 'Dancing Script', cursive; }
        
        @media print {
          @page { margin: 10mm; size: A4 portrait; }
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .break-before-page { page-break-before: always; }
          .page-break-inside-avoid { page-break-inside: avoid; }
          /* Ensure backgrounds print */
          * { -webkit-print-color-adjust: exact !important;   print-color-adjust: exact !important; }
        }
      `}</style>
        </div>
    );
};

export default ServiceOrderReport;
