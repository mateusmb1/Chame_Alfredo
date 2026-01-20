import React from 'react';
import { Order } from '../types/order';
import { Client } from '../types/client';

interface ServiceOrderReportProps {
    order: Order;
    client?: Client;
}

const ServiceOrderReport: React.FC<ServiceOrderReportProps> = ({ order, client }) => {
    // Mock data if missing (for development/preview before DB update)
    const items = order.items || [
        { code: '3', name: 'Limpeza quadro de comando', quantity: 1.0, unitPrice: 500.0, total: 500.0 }
    ];

    const asset = order.asset_info || {
        name: 'ELEVADOR SOCIAL DIREITA',
        location: client?.address || 'Edifício Sunrise',
        brand: 'Atlas Schindler',
        model: 'Schindler 1000',
        serialNumber: '61344',
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
        return new Date(dateString).toLocaleDateString('pt-BR') + ' ' + new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    // Calculate times
    const startTime = order.checkIn ? new Date(order.checkIn.timestamp) : null;
    const endTime = order.checkOut ? new Date(order.checkOut.timestamp) : null;

    const duration = startTime && endTime
        ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) + ' minutos'
        : 'N/A';

    const totalServices = items.reduce((acc: number, item: any) => acc + (item.total || 0), 0);

    return (
        <div className="hidden print:block font-sans text-sm text-black bg-white w-full max-w-[210mm] mx-auto p-8" id="printable-report">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Relatório de Visita Técnica</h1>
                <h2 className="text-xl font-bold text-gray-800">({new Date(order.scheduledDate).toLocaleDateString('pt-BR')})</h2>
                <div className="flex justify-between text-[10px] text-gray-500 mt-2 border-b pb-2">
                    <span>Por: {order.technicianName}</span>
                    <span>Em: {new Date().toLocaleString('pt-BR')}</span>
                </div>
            </div>

            {/* Empresa Responsável */}
            <section className="mb-6">
                <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1">Empresa responsável</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
            <section className="mb-6">
                <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1">Cliente</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <span className="block font-bold">Nome</span>
                        <span>{client?.name || order.clientName}</span>
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
                        <a href="#" className="text-blue-600 underline text-xs">Clique aqui para abertura de chamado</a>
                    </div>
                </div>
            </section>

            {/* Informações do serviço */}
            <section className="mb-6">
                <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1">Informações do serviço</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <span className="block font-bold">Horário planejado</span>
                        <span>{formatDate(order.scheduledDate)}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Horário realizado</span>
                        <span>{startTime ? formatDate(startTime.toISOString()) : '-'} - {endTime ? formatDate(endTime.toISOString()) : '-'}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Tempo de execução</span>
                        <span>{duration}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Tempo de início do atendimento</span>
                        <span>-</span>
                    </div>
                    <div>
                        <span className="block font-bold">Tempo de finalização do atendimento</span>
                        <span>-</span>
                    </div>
                </div>
            </section>

            {/* Ativo */}
            <section className="mb-6">
                <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1">Ativo</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
                        <a href="#" className="text-blue-600 underline text-xs">Clique aqui para abertura de chamado</a>
                    </div>
                </div>
            </section>

            {/* Início do Trabalho */}
            <section className="mb-6 page-break-inside-avoid">
                <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1">Início do Trabalho</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <span className="block font-bold">Tipo de serviço</span>
                        <span>{order.serviceType}</span>
                    </div>
                    <div>
                        <span className="block font-bold">Km veículo</span>
                        <span>5</span>
                    </div>
                    <div className="col-span-2">
                        <span className="block font-bold">Localização GPS</span>
                        <a href="#" className="text-blue-600 underline text-xs">-25.3796988, -49.2438974</a>
                    </div>
                </div>
            </section>

            {/* Diagnóstico */}
            <section className="mb-6 break-before-page">
                <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1">Diagnóstico</h3>
                <div className="mb-4">
                    <span className="block font-bold">Relato do cliente</span>
                    <p>{order.description}</p>
                </div>
                <div className="mb-4">
                    <span className="block font-bold">Descrição do diagnóstico</span>
                    <p>{order.serviceNotes || 'Sem observações técnicas.'}</p>
                </div>

                {order.servicePhotos && order.servicePhotos.length > 0 && (
                    <div className="mt-4">
                        <span className="block font-bold mb-2">Fotos</span>
                        <div className="grid grid-cols-3 gap-2">
                            {order.servicePhotos.map((photo: any, index: number) => (
                                <div key={index} className="flex flex-col">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden border border-gray-200">
                                        <img src={photo.url} alt={`Foto ${index}`} className="object-cover w-full h-full" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-1">Foto {index + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Serviços Realizados */}
            <section className="mb-6">
                <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1">Serviços Realizados</h3>
                <div className="mb-4">
                    <span className="block font-bold text-lg mb-2">Descrição do serviço</span>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="font-bold py-1">Código</th>
                                <th className="font-bold py-1">Nome</th>
                                <th className="font-bold py-1 text-right">Quantidade</th>
                                <th className="font-bold py-1 text-right">Preço unitário</th>
                                <th className="font-bold py-1 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-2">{item.code || idx + 1}</td>
                                    <td className="py-2">{item.name}</td>
                                    <td className="py-2 text-right">{item.quantity}</td>
                                    <td className="py-2 text-right">{formatCurrency(item.unitPrice || 0)}</td>
                                    <td className="py-2 text-right">{formatCurrency(item.total || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pendências */}
                <div className="mt-4">
                    <span className="block font-bold">Pendências</span>
                    <p>Verificar casa dec máquinas, pois está com ausência de iluminação.</p>
                </div>
            </section>

            {/* Fim do Trabalho */}
            <section className="mb-6 page-break-inside-avoid">
                <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1">Fim do Trabalho</h3>
                <div className="grid grid-cols-2 gap-8 mt-8">
                    <div className="border rounded p-4 h-32 flex flex-col justify-between relative">
                        <span className="font-bold">Assinatura do técnico</span>
                        <span className="font-handwriting text-2xl absolute top-1/2 left-4">{order.technicianName.split(' ')[0]}</span>
                    </div>
                    <div className="border rounded p-4 h-32 flex flex-col justify-between relative">
                        <span className="font-bold">Assinatura do cliente</span>
                        {order.customerSignature ? (
                            <img src={order.customerSignature} className="max-h-20 object-contain absolute top-8 left-4 grayscale" alt="Assinatura Cliente" />
                        ) : (
                            <span className="font-handwriting text-2xl absolute top-1/2 left-4">{order.clientName.split(' ')[0]}</span>
                        )}
                    </div>
                </div>
            </section>

            <div className="text-[10px] text-gray-400 mt-8">
                Produtivo
            </div>

            <style>{`
        @media print {
          @page { margin: 10mm; size: A4 portrait; }
          body { background: white; -webkit-print-color-adjust: exact; }
          .break-before-page { page-break-before: always; }
          .page-break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
        </div>
    );
};

export default ServiceOrderReport;
