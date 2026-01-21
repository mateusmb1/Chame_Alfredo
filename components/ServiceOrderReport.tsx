import React from 'react';
import { Order } from '../types/order';
import { Client } from '../types/client';
import { useApp } from '../contexts/AppContext';
import { Briefcase } from 'lucide-react';

interface ServiceOrderReportProps {
    order: Order;
    client?: Client;
}

const ServiceOrderReport: React.FC<ServiceOrderReportProps> = ({ order, client }) => {
    const { companyProfile } = useApp();

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return '-';
            return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return '-'; }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const asset = order.asset_info || {
        name: '', location: '', brand: '', model: '', serialNumber: '', url: '#'
    };

    return (
        <div className="bg-white text-black font-sans text-[11px] leading-tight p-8 max-w-[210mm] mx-auto shadow-none print:shadow-none" id="printable-report">
            {/* Header */}
            <header className="text-center mb-6 relative flex flex-col items-center">
                {companyProfile?.logo_url ? (
                    <img src={companyProfile.logo_url} alt="Logo" className="h-20 w-auto object-contain mb-4" />
                ) : (
                    <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">A</div>
                )}
                <div className="absolute right-0 top-0 text-[10px] text-gray-400">1</div>
                <h1 className="text-xl font-medium uppercase mb-1">Relatório de Visita Técnica</h1>
                <h2 className="text-lg font-medium">({new Date(order.scheduledDate).toLocaleDateString('pt-BR')})</h2>
                <div className="flex justify-between w-full mt-4 text-[10px] text-gray-500">
                    <div>Por: {order.technicianName}</div>
                    <div>Em: {new Date(order.updatedAt || order.createdAt).toLocaleString('pt-BR')}</div>
                </div>
            </header>

            {/* Empresa Responsável */}
            <div className="mb-4">
                <div className="bg-gray-100 font-bold p-2 border-x border-t border-gray-300 text-[12px] uppercase tracking-tight">Empresa responsável</div>
                <table className="w-full border-collapse border border-gray-300 text-[11px] leading-tight">
                    <tbody>
                        <tr>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Nome</span>{companyProfile?.company_name || 'Alfredo'}</td>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Telefone</span>{companyProfile?.phone || '-'}</td>
                        </tr>
                        <tr>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">CPF / CNPJ</span>{companyProfile?.cnpj || '-'}</td>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Endereço</span>{[companyProfile?.street, companyProfile?.number, companyProfile?.city, companyProfile?.state].filter(Boolean).join(', ') || '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Cliente */}
            <div className="mb-4">
                <div className="bg-gray-100 font-bold p-2 border-x border-t border-gray-300 text-[12px] uppercase tracking-tight">Cliente</div>
                <table className="w-full border-collapse border border-gray-300 text-[11px] leading-tight">
                    <tbody>
                        <tr>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Nome</span>{order.clientName}</td>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Razão social</span>{client?.name || order.clientName}</td>
                        </tr>
                        <tr>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">CPF / CNPJ</span>{client?.cpfCnpj || '-'}</td>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Endereço</span>{client?.address || '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Informações do serviço */}
            <div className="mb-4">
                <div className="bg-gray-100 font-bold p-2 border-x border-t border-gray-300 text-[12px] uppercase tracking-tight">Informações do serviço</div>
                <table className="w-full border-collapse border border-gray-300 text-[11px] leading-tight">
                    <tbody>
                        <tr>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Horário planejado</span>{formatDate(order.scheduledDate)}</td>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Horário realizado</span>{formatDate(order.checkIn?.timestamp)} - {formatDate(order.checkOut?.timestamp)}</td>
                        </tr>
                        <tr>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Tempo de início</span>{formatDate(order.checkIn?.timestamp)}</td>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Tempo de finalização</span>{formatDate(order.checkOut?.timestamp)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ativo */}
            {order.asset_info && (
                <div className="mb-4">
                    <div className="bg-gray-100 font-bold p-2 border-x border-t border-gray-300 text-[12px] uppercase tracking-tight">Ativo</div>
                    <table className="w-full border-collapse border border-gray-300 text-[11px] leading-tight">
                        <tbody>
                            <tr>
                                <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Nome</span>{asset.name}</td>
                                <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Local</span>{asset.location}</td>
                            </tr>
                            <tr>
                                <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Marca</span>{asset.brand}</td>
                                <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Modelo</span>{asset.model}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Início Trabalho / GPS */}
            <div className="mb-4">
                <div className="bg-gray-100 font-bold p-2 border-x border-t border-gray-300 text-[12px] uppercase tracking-tight">Início do Trabalho</div>
                <table className="w-full border-collapse border border-gray-300 text-[11px] leading-tight">
                    <tbody>
                        <tr>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Tipo de serviço</span>{order.serviceType}</td>
                            <td className="w-1/2 border border-gray-300 p-2 align-top"><span className="font-bold text-gray-700 block mb-0.5">Localização GPS</span>{order.checkIn?.location ? `${order.checkIn.location.lat}, ${order.checkIn.location.lng}` : '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Page Break for Diagnosis */}
            <div className="mt-12 pt-8 border-t border-dashed border-gray-300 relative break-before-page">
                <div className="absolute right-0 top-8 text-[10px] text-gray-400">2</div>
                <div className="bg-gray-100 font-bold p-2 border-x border-t border-gray-300 text-[12px] uppercase tracking-tight">Diagnóstico</div>
                <div className="border border-gray-300 p-3 text-[11px]">
                    <span className="font-bold text-gray-700 block mb-0.5">Relato do cliente</span>
                    <p className="mb-4">{order.description}</p>

                    <span className="font-bold text-gray-700 block mb-0.5">Descrição do diagnóstico</span>
                    <p className="mb-4">{order.serviceNotes || 'Sem observações.'}</p>

                    {order.servicePhotos && order.servicePhotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {order.servicePhotos.map((photo: any, index: number) => (
                                <div key={index}>
                                    <div className="font-bold text-gray-700 text-[10px] mb-1">Fotos</div>
                                    <div className="border border-gray-300 bg-gray-50 h-32 flex items-center justify-center overflow-hidden">
                                        <img src={photo.url} alt="Service Photo" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-[9px] text-gray-500 mt-1">{photo.caption}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Serviços Realizados */}
            <div className="mt-4">
                <div className="bg-gray-100 font-bold p-2 border-x border-t border-gray-300 text-[12px] uppercase tracking-tight">Serviços Realizados</div>
                <table className="w-full border-collapse border border-gray-300 text-[11px] leading-tight">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 text-left w-12 text-[10px] font-bold">Código</th>
                            <th className="border border-gray-300 p-2 text-left text-[10px] font-bold">Nome</th>
                            <th className="border border-gray-300 p-2 text-right w-20 text-[10px] font-bold">Qtd</th>
                            <th className="border border-gray-300 p-2 text-right w-24 text-[10px] font-bold">Preço Unit.</th>
                            <th className="border border-gray-300 p-2 text-right w-24 text-[10px] font-bold">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td className="border border-gray-300 p-2">{item.code || idx + 1}</td>
                                <td className="border border-gray-300 p-2">{item.name || item.description}</td>
                                <td className="border border-gray-300 p-2 text-right">{item.quantity}</td>
                                <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.unitPrice || 0)}</td>
                                <td className="border border-gray-300 p-2 text-right font-bold">{formatCurrency((item.total || item.totalPrice) || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="border-x border-b border-gray-300 p-3 text-[11px]">
                    <span className="font-bold text-gray-700 block mb-0.5">Pendências</span>
                    <p>Verificar se há pendências.</p>
                </div>
            </div>

            {/* Fim do Trabalho */}
            <div className="mt-4 page-break-inside-avoid">
                <div className="bg-gray-100 font-bold p-2 border-x border-t border-gray-300 text-[12px] uppercase tracking-tight">Fim do Trabalho</div>
                <table className="w-full border-collapse border border-gray-300 text-[11px] leading-tight">
                    <tbody>
                        <tr>
                            <td className="w-1/2 h-32 border border-gray-300 p-2 align-top relative">
                                <span className="font-bold text-gray-700 block mb-0.5">Assinatura do técnico</span>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl text-gray-700 italic">{order.technicianName.split(' ')[0]}</span>
                                    <div className="w-3/5 border-b border-gray-300 mt-2"></div>
                                </div>
                            </td>
                            <td className="w-1/2 h-32 border border-gray-300 p-2 align-top relative">
                                <span className="font-bold text-gray-700 block mb-0.5">Assinatura do cliente</span>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    {order.customerSignature ? (
                                        <img src={order.customerSignature} className="max-h-16 object-contain grayscale" />
                                    ) : (
                                        <span className="text-gray-400">Não assinado</span>
                                    )}
                                    <div className="w-3/5 border-b border-gray-300 mt-2"></div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-2 text-[9px] text-gray-400">{companyProfile?.name || 'Alfredo'}</div>
            </div>

            <style>{`
                @media print {
                  .break-before-page { page-break-before: always; }
                  .page-break-inside-avoid { page-break-inside: avoid; }
                  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
             `}</style>
        </div>
    );
}

export default ServiceOrderReport;
