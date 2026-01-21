import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { ImportPreviewTable } from './ImportPreviewTable';
import {
    parseCSV,
    detectImportType,
    getImportTypeLabel,
    parseKeyValueCSV,
    mapClientFromAgendaBoa,
    mapMaterialFromAgendaBoa,
    mapServiceFromAgendaBoa,
    mapOrderFromAgendaBoa,
    AgendaBoaClient,
    AgendaBoaMaterial,
    AgendaBoaService,
    AgendaBoaFinancialRecord,
    ImportedClient,
    ImportedInventoryItem,
    ImportedService,
    ImportedOrder,
    ValidationResult,
    ImportType,
    formatDateToISO,
} from '../utils/csvImporters';

interface DataImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ImportRow<T> {
    data: T;
    validation: ValidationResult;
    selected: boolean;
}

type ImportState = 'idle' | 'preview' | 'importing' | 'complete';

export function DataImportModal({ isOpen, onClose }: DataImportModalProps) {
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [importState, setImportState] = useState<ImportState>('idle');
    const [importType, setImportType] = useState<ImportType>('unknown');
    const [fileName, setFileName] = useState<string>('');
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

    // Generic rows state
    const [clientRows, setClientRows] = useState<ImportRow<ImportedClient>[]>([]);
    const [materialRows, setMaterialRows] = useState<ImportRow<ImportedInventoryItem>[]>([]);
    const [serviceRows, setServiceRows] = useState<ImportRow<ImportedService>[]>([]);
    const [orderRows, setOrderRows] = useState<ImportRow<ImportedOrder>[]>([]);
    const [financialRows, setFinancialRows] = useState<ImportRow<any>[]>([]);
    const [profileData, setProfileData] = useState<Record<string, string> | null>(null);

    const resetState = () => {
        setImportState('idle');
        setImportType('unknown');
        setFileName('');
        setClientRows([]);
        setMaterialRows([]);
        setServiceRows([]);
        setOrderRows([]);
        setImportProgress({ current: 0, total: 0 });
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            showToast('error', 'Por favor, selecione um arquivo CSV');
            return;
        }

        setFileName(file.name);

        try {
            const content = await file.text();
            const lines = content.split('\n').filter(l => l.trim());

            if (lines.length < 2) {
                showToast('error', 'Arquivo CSV vazio ou inválido');
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const detectedType = detectImportType(headers, lines[0]);
            setImportType(detectedType);

            if (detectedType === 'unknown') {
                showToast('warning', 'Tipo de dado não reconhecido. Verifique o formato do arquivo.');
                return;
            }

            // Parse and map based on type
            if (detectedType === 'clients') {
                const records = parseCSV<AgendaBoaClient>(content);
                const mapped = records.map(record => {
                    const { data, validation } = mapClientFromAgendaBoa(record);
                    return { data, validation, selected: validation.valid };
                });
                setClientRows(mapped);
            } else if (detectedType === 'materials') {
                const records = parseCSV<AgendaBoaMaterial>(content);
                const mapped = records.map(record => {
                    const { data, validation } = mapMaterialFromAgendaBoa(record);
                    return { data, validation, selected: validation.valid };
                });
                setMaterialRows(mapped);
            } else if (detectedType === 'services') {
                const records = parseCSV<AgendaBoaService>(content);
                const mapped = records.map(record => {
                    const { data, validation } = mapServiceFromAgendaBoa(record);
                    return { data, validation, selected: validation.valid };
                });
                setServiceRows(mapped);
            } else if (detectedType === 'orders') {
                const records = parseCSV<any>(content);
                const mapped = records.map(record => {
                    const { data, validation } = mapOrderFromAgendaBoa(record);
                    return { data, validation, selected: validation.valid };
                });
                setOrderRows(mapped);
            } else if (detectedType === 'financial') {
                const records = parseCSV<AgendaBoaFinancialRecord>(content);
                const mapped = records.map(record => {
                    const price = parseFloat(record.value?.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
                    return {
                        data: { ...record, parsedValue: price },
                        validation: { valid: true, warnings: [], errors: [] },
                        selected: true
                    };
                });
                setFinancialRows(mapped);
            } else if (detectedType === 'profile') {
                const data = parseKeyValueCSV(content);
                setProfileData(data);
            }

            setImportState('preview');
            showToast('success', `${getImportTypeLabel(detectedType)} carregados para revisão`);

        } catch (err) {
            console.error('Error parsing CSV:', err);
            showToast('error', 'Erro ao processar arquivo CSV');
        }

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && fileInputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInputRef.current.files = dt.files;
            fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const getSelectedCount = (): number => {
        if (importType === 'clients') return clientRows.filter(r => r.selected).length;
        if (importType === 'materials') return materialRows.filter(r => r.selected).length;
        if (importType === 'services') return serviceRows.filter(r => r.selected).length;
        if (importType === 'orders') return orderRows.filter(r => r.selected).length;
        if (importType === 'financial') return financialRows.filter(r => r.selected).length;
        if (importType === 'profile') return profileData ? 1 : 0;
        return 0;
    };

    const handleImport = async () => {
        setImportState('importing');

        try {
            if (importType === 'clients') {
                const selected = clientRows.filter(r => r.selected);
                setImportProgress({ current: 0, total: selected.length });
                let successCount = 0;
                let errorCount = 0;

                for (let i = 0; i < selected.length; i++) {
                    const { data } = selected[i];
                    try {
                        // Convert type to match DB schema (pf/pj instead of person/legal_entity)
                        const dbType = data.type === 'legal_entity' ? 'pj' : 'pf';
                        // Use cpfCnpj as the DB field (combine cnpj and cpf)
                        const cpfCnpj = data.cnpj || data.cpf || '';

                        const { error } = await supabase.from('clients').insert({
                            name: data.name,
                            email: data.email || null,
                            phone: data.phone || null,
                            address: data.address || null,
                            cpf_cnpj: cpfCnpj,
                            type: dbType,
                            status: 'active',
                        });
                        if (error) {
                            console.error(`Error inserting client ${data.name}:`, error.message, error.details);
                            errorCount++;
                        } else {
                            successCount++;
                        }
                    } catch (err) {
                        console.error(`Exception inserting client ${data.name}:`, err);
                        errorCount++;
                    }
                    setImportProgress({ current: i + 1, total: selected.length });
                }

                if (errorCount > 0) {
                    showToast('warning', `${successCount} clientes importados, ${errorCount} falhas. Verifique o console.`);
                } else {
                    showToast('success', `${successCount} clientes importados com sucesso!`);
                }


            } else if (importType === 'materials') {
                const selected = materialRows.filter(r => r.selected);
                setImportProgress({ current: 0, total: selected.length });
                let successCount = 0;
                let errorCount = 0;

                for (let i = 0; i < selected.length; i++) {
                    const { data } = selected[i];
                    const { error } = await supabase.from('inventory').insert({
                        name: data.name,
                        sku: data.sku,
                        quantity: data.quantity,
                        min_quantity: data.min_quantity,
                        unit: data.unit,
                        category: data.category,
                        location: data.location,
                        price: data.price,
                        supplier: data.supplier,
                    });
                    if (error) {
                        console.error(`Error inserting material ${data.name}:`, error);
                        errorCount++;
                    } else {
                        successCount++;
                    }
                    setImportProgress({ current: i + 1, total: selected.length });
                }
                showToast(errorCount > 0 ? 'warning' : 'success', `${successCount} materiais importados (${errorCount} falhas)`);

            } else if (importType === 'services') {
                const selected = serviceRows.filter(r => r.selected);
                setImportProgress({ current: 0, total: selected.length });
                let successCount = 0;
                let errorCount = 0;

                for (let i = 0; i < selected.length; i++) {
                    const { data } = selected[i];
                    const { error } = await supabase.from('products_services').insert({
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        unit: data.unit,
                        type: 'service',
                    });
                    if (error) {
                        console.error(`Error inserting service ${data.name}:`, error);
                        errorCount++;
                    } else {
                        successCount++;
                    }
                    setImportProgress({ current: i + 1, total: selected.length });
                }
                showToast(errorCount > 0 ? 'warning' : 'success', `${successCount} serviços importados (${errorCount} falhas)`);

            } else if (importType === 'orders') {
                const selected = orderRows.filter(r => r.selected);
                setImportProgress({ current: 0, total: selected.length });
                let successCount = 0;
                let errorCount = 0;

                for (let i = 0; i < selected.length; i++) {
                    const { data } = selected[i];
                    const { error } = await supabase.from('orders').insert({
                        client_name: data.client_name,
                        value: data.total_price,
                        status: data.status,
                        service_type: data.description || 'Importado',
                        scheduled_date: data.job_date, // mapper already converts it to ISO
                    });
                    if (error) {
                        console.error(`Error inserting order for ${data.client_name}:`, error);
                        errorCount++;
                    } else {
                        successCount++;
                    }
                    setImportProgress({ current: i + 1, total: selected.length });
                }
                showToast(errorCount > 0 ? 'warning' : 'success', `${successCount} ordens importadas (${errorCount} falhas)`);

            } else if (importType === 'financial') {
                const selected = financialRows.filter(r => r.selected);
                setImportProgress({ current: 0, total: selected.length });
                let successCount = 0;
                let errorCount = 0;

                for (let i = 0; i < selected.length; i++) {
                    const { data } = selected[i];
                    const { error } = await supabase.from('invoices').insert({
                        client_name: data.client,
                        value: data.parsedValue,
                        status: data.revenue === '1' ? 'paid' : 'pending',
                        due_date: formatDateToISO(data.date),
                        external_id: data.id,
                    });
                    if (error) {
                        console.error(`Error inserting invoice for ${data.client}:`, error);
                        errorCount++;
                    } else {
                        successCount++;
                    }
                    setImportProgress({ current: i + 1, total: selected.length });
                }
                showToast(errorCount > 0 ? 'warning' : 'success', `${successCount} registros financeiros importados (${errorCount} falhas)`);

            } else if (importType === 'profile') {
                if (profileData) {
                    setImportProgress({ current: 0, total: 1 });
                    const { error } = await supabase.from('company_profile').upsert({
                        id: 'default', // Single profile for the app
                        name: profileData['details.companyName'] || profileData['corporateName'],
                        email: profileData['email'],
                        phone: profileData['phone'],
                        logo_url: profileData['picture'],
                        signature_url: profileData['signature'],
                        cnpj: profileData['details.cnpj'],
                        address: `${profileData['address.street']}, ${profileData['address.number']}`
                    });
                    if (error) throw error;
                    setImportProgress({ current: 1, total: 1 });
                }
            }

            setImportState('complete');
            showToast('success', `${importProgress.total} registros importados com sucesso!`);

        } catch (err: any) {
            console.error('Import error:', err);
            showToast('error', `Erro na importação: ${err.message}`);
            setImportState('preview');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#18202F] rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Importação de Dados - Agenda Boa
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Importe clientes, materiais e serviços do sistema legado
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {importState === 'idle' && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Arraste um arquivo CSV ou clique para selecionar
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Arquivos suportados: export_clients.csv, export_materials.csv, export_services.csv
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    )}

                    {importState === 'preview' && (
                        <div className="space-y-4">
                            {/* File info bar */}
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{fileName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {getImportTypeLabel(importType)} • {getSelectedCount()} selecionados
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={resetState}
                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Trocar arquivo
                                </button>
                            </div>

                            {/* Preview Tables */}
                            {importType === 'clients' && (
                                <ImportPreviewTable
                                    data={clientRows}
                                    columns={[
                                        { key: 'name', label: 'Nome' },
                                        { key: 'email', label: 'E-mail' },
                                        { key: 'phone', label: 'Telefone' },
                                        { key: 'city', label: 'Cidade' },
                                        { key: 'type', label: 'Tipo' },
                                    ]}
                                    onToggleSelect={(index) => {
                                        const updated = [...clientRows];
                                        updated[index].selected = !updated[index].selected;
                                        setClientRows(updated);
                                    }}
                                    onSelectAll={() => {
                                        const allValid = clientRows.filter(r => r.validation.valid);
                                        const allSelected = allValid.every(r => r.selected);
                                        setClientRows(clientRows.map(r => ({
                                            ...r,
                                            selected: r.validation.valid ? !allSelected : false,
                                        })));
                                    }}
                                    allSelected={clientRows.filter(r => r.validation.valid).every(r => r.selected)}
                                />
                            )}

                            {importType === 'materials' && (
                                <ImportPreviewTable
                                    data={materialRows}
                                    columns={[
                                        { key: 'name', label: 'Nome' },
                                        { key: 'sku', label: 'SKU' },
                                        { key: 'price', label: 'Preço' },
                                        { key: 'unit', label: 'Unidade' },
                                        { key: 'supplier', label: 'Fornecedor' },
                                    ]}
                                    onToggleSelect={(index) => {
                                        const updated = [...materialRows];
                                        updated[index].selected = !updated[index].selected;
                                        setMaterialRows(updated);
                                    }}
                                    onSelectAll={() => {
                                        const allValid = materialRows.filter(r => r.validation.valid);
                                        const allSelected = allValid.every(r => r.selected);
                                        setMaterialRows(materialRows.map(r => ({
                                            ...r,
                                            selected: r.validation.valid ? !allSelected : false,
                                        })));
                                    }}
                                    allSelected={materialRows.filter(r => r.validation.valid).every(r => r.selected)}
                                />
                            )}

                            {importType === 'services' && (
                                <ImportPreviewTable
                                    data={serviceRows}
                                    columns={[
                                        { key: 'name', label: 'Nome' },
                                        { key: 'description', label: 'Descrição' },
                                        { key: 'price', label: 'Preço' },
                                        { key: 'unit', label: 'Unidade' },
                                    ]}
                                    onToggleSelect={(index) => {
                                        const updated = [...serviceRows];
                                        updated[index].selected = !updated[index].selected;
                                        setServiceRows(updated);
                                    }}
                                    onSelectAll={() => {
                                        const allValid = serviceRows.filter(r => r.validation.valid);
                                        const allSelected = allValid.every(r => r.selected);
                                        setServiceRows(serviceRows.map(r => ({
                                            ...r,
                                            selected: r.validation.valid ? !allSelected : false,
                                        })));
                                    }}
                                    allSelected={serviceRows.filter(r => r.validation.valid).every(r => r.selected)}
                                />
                            )}

                            {importType === 'orders' && (
                                <ImportPreviewTable
                                    data={orderRows}
                                    columns={[
                                        { key: 'client_name', label: 'Cliente' },
                                        { key: 'total_price', label: 'Valor' },
                                        { key: 'status', label: 'Status' },
                                        { key: 'description', label: 'Serviço' },
                                        { key: 'job_date', label: 'Data' },
                                    ]}
                                    onToggleSelect={(index) => {
                                        const updated = [...orderRows];
                                        updated[index].selected = !updated[index].selected;
                                        setOrderRows(updated);
                                    }}
                                    onSelectAll={() => {
                                        const allValid = orderRows.filter(r => r.validation.valid);
                                        const allSelected = allValid.every(r => r.selected);
                                        setOrderRows(orderRows.map(r => ({
                                            ...r,
                                            selected: r.validation.valid ? !allSelected : false,
                                        })));
                                    }}
                                    allSelected={orderRows.filter(r => r.validation.valid).every(r => r.selected)}
                                />
                            )}

                            {importType === 'financial' && (
                                <ImportPreviewTable
                                    data={financialRows}
                                    columns={[
                                        { key: 'client', label: 'Cliente' },
                                        { key: 'date', label: 'Data' },
                                        { key: 'value', label: 'Valor' },
                                        { key: 'revenue', label: 'Pago?' },
                                    ]}
                                    onToggleSelect={(index) => {
                                        const updated = [...financialRows];
                                        updated[index].selected = !updated[index].selected;
                                        setFinancialRows(updated);
                                    }}
                                    onSelectAll={() => {
                                        const allSelected = financialRows.every(r => r.selected);
                                        setFinancialRows(financialRows.map(r => ({ ...r, selected: !allSelected })));
                                    }}
                                    allSelected={financialRows.every(r => r.selected)}
                                />
                            )}

                            {importType === 'profile' && profileData && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-xl bg-gray-50 border flex items-center justify-center overflow-hidden">
                                                {profileData['picture'] ? (
                                                    <img src={profileData['picture']} alt="Logo" className="w-full h-full object-contain" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {profileData['details.companyName'] || profileData['corporateName']}
                                                </h4>
                                                <p className="text-gray-500 dark:text-gray-400">{profileData['email']}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                                Perfil Encontrado
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CNPJ</p>
                                            <p className="font-bold">{profileData['details.cnpj'] || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Telefone</p>
                                            <p className="font-bold">{profileData['phone'] || 'Não informado'}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Endereço</p>
                                            <p className="font-bold">
                                                {profileData['address.street']}{profileData['address.number'] ? `, ${profileData['address.number']}` : ''}
                                                {profileData['address.district'] ? ` - ${profileData['address.district']}` : ''}
                                                {profileData['address.city'] ? ` (${profileData['address.city']} - ${profileData['address.state']})` : ''}
                                            </p>
                                        </div>
                                        {profileData['signature'] && (
                                            <div className="md:col-span-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assinatura Digital</p>
                                                <img src={profileData['signature']} alt="Assinatura" className="h-16 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {importState === 'importing' && (
                        <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Importando dados...
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {importProgress.current} de {importProgress.total} registros
                            </p>
                            <div className="mt-4 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {importState === 'complete' && (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Importação Concluída!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {importProgress.total} registros foram importados com sucesso.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {importState === 'preview' && (
                            <>
                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                Revise os dados antes de importar
                            </>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {importState === 'complete' ? 'Fechar' : 'Cancelar'}
                        </button>
                        {importState === 'preview' && (
                            <button
                                onClick={handleImport}
                                disabled={getSelectedCount() === 0}
                                className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Importar {getSelectedCount()} registros
                            </button>
                        )}
                        {importState === 'complete' && (
                            <button
                                onClick={resetState}
                                className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                            >
                                Importar Mais
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataImportModal;
