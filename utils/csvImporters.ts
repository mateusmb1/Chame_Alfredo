/**
 * Agenda Boa CSV Import Utilities
 * Parse and map CSV data from legacy system to Supabase schema
 */

// Parse CSV string to array of objects - handling multiline quoted fields
export function parseCSV<T>(csvContent: string): T[] {
    const records: T[] = [];
    let currentLine: string[] = [];
    let currentField = '';
    let inQuotes = false;
    let headers: string[] = [];

    // Simple state machine to parse CSV correctly
    for (let i = 0; i < csvContent.length; i++) {
        const char = csvContent[i];
        const nextChar = csvContent[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // ESCAPED QUOTE
                currentField += '"';
                i++;
            } else {
                // TOGGLE QUOTES
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // END OF FIELD
            currentLine.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // END OF RECORD
            if (char === '\r' && nextChar === '\n') i++; // Handle CRLF

            currentLine.push(currentField.trim());

            if (headers.length === 0) {
                headers = currentLine.filter(h => h !== '');
            } else if (currentLine.some(val => val !== '')) {
                const record: Record<string, string> = {};
                headers.forEach((header, index) => {
                    record[header] = currentLine[index] || '';
                });
                records.push(record as T);
            }

            currentLine = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }

    // Handle last record if not followed by newline
    if (currentField !== '' || currentLine.length > 0) {
        currentLine.push(currentField.trim());
        if (headers.length > 0) {
            const record: Record<string, string> = {};
            headers.forEach((header, index) => {
                record[header] = currentLine[index] || '';
            });
            records.push(record as T);
        }
    }

    return records;
}

// Parse a single CSV line handling quoted values (legacy, kept for compatibility if needed elsewhere)
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Parse a key-value style CSV vertical format
export function parseKeyValueCSV(csvContent: string): Record<string, string> {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const result: Record<string, string> = {};

    lines.forEach(line => {
        const parts = parseCSVLine(line);
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(',').trim(); // Handle commas in values
            result[key] = value;
        }
    });

    return result;
}

// ===== TYPE DEFINITIONS =====

export interface AgendaBoaClient {
    id: string;
    name: string;
    corporateName: string;
    email: string;
    source: string;
    phones: string;
    clientType: string;
    cnpj: string;
    cpf: string;
    cep: string;
    city: string;
    district: string;
    number: string;
    state: string;
    street: string;
    streetNumber: string;
}

export interface AgendaBoaMaterial {
    id: string;
    description: string;
    details: string;
    image: string;
    currency: string;
    cost: string;
    margin: string;
    markup: string;
    unitPrice: string;
    unitType: string;
    trademark: string;
    barcode: string;
    internalCode: string;
}

export interface AgendaBoaService {
    id: string;
    description: string;
    details: string;
    currency: string;
    unitPrice: string;
    unitType: string;
}

export interface AgendaBoaOrder {
    clientId: string;
    clientName: string;
    createdAt: string;
    id: string;
    jobDate: string;
    jobNumber: string;
    jobStatus: string;
    jobTitle: string;
    jobType: string;
    totalPrice: string;
    'descriptions.description': string;
    'descriptions.price': string;
}

export interface AgendaBoaFinancialRecord {
    id: string;
    clientId: string;
    clienId: string; // Handle typo
    client: string;
    jobId: string;
    revenue: string;
    date: string;
    value: string;
}

export interface ImportedClient {
    name: string;
    company_name: string;
    email: string;
    phone: string;
    cnpj: string;
    cpf: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    type: 'person' | 'legal_entity';
    external_id: string;
}

export interface ImportedInventoryItem {
    name: string;
    sku: string;
    quantity: number;
    min_quantity: number;
    unit: string;
    category: string;
    location: string;
    price: number;
    supplier: string;
    external_id: string;
}

export interface ImportedService {
    name: string;
    description: string;
    price: number;
    unit: string;
    type: 'service';
    external_id: string;
}

export interface ValidationResult {
    valid: boolean;
    warnings: string[];
    errors: string[];
}

// Helper to format various date inputs to ISO
export function formatDateToISO(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();

    // Clean input
    const cleanStr = dateStr.trim();

    // Check if it's a numeric timestamp (all digits)
    if (/^\d+$/.test(cleanStr)) {
        const timestamp = parseInt(cleanStr, 10);
        // If timestamp is realistic (after year 2000)
        if (timestamp > 946684800000) {
            return new Date(timestamp).toISOString();
        }
    }

    // Check if it's Brazilian DD/MM/YYYY
    const brDateMatch = cleanStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (brDateMatch) {
        const [_, day, month, year] = brDateMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00:00.000Z`;
    }

    // Try standard JS Date parsing
    const parsed = new Date(cleanStr);
    if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
    }

    return new Date().toISOString();
}

// ===== MAPPING FUNCTIONS =====

export function mapClientFromAgendaBoa(record: AgendaBoaClient): { data: ImportedClient; validation: ValidationResult } {
    const validation: ValidationResult = { valid: true, warnings: [], errors: [] };

    // Validate required fields
    if (!record.name?.trim()) {
        validation.errors.push('Nome é obrigatório');
        validation.valid = false;
    }

    // Build address
    const addressParts = [
        record.street,
        record.number || record.streetNumber,
        record.district,
    ].filter(Boolean);

    const address = addressParts.join(', ');

    // Parse phone - handle multiple formats
    const phone = record.phones?.replace(/[^\d+\s()-]/g, '').trim() || '';

    // Determine type
    const type: 'person' | 'legal_entity' =
        record.clientType === 'legal_entity' || record.cnpj ? 'legal_entity' : 'person';

    // Warnings
    if (!record.email) validation.warnings.push('E-mail não informado');
    if (!record.phones) validation.warnings.push('Telefone não informado');

    return {
        data: {
            name: record.name?.trim() || '',
            company_name: record.corporateName?.trim() || '',
            email: record.email?.trim() || '',
            phone,
            cnpj: record.cnpj?.replace(/[^\d]/g, '') || '',
            cpf: record.cpf?.replace(/[^\d]/g, '') || '',
            address,
            city: record.city?.trim() || '',
            state: record.state?.replace(/\(|\)/g, '').trim() || '',
            zip_code: record.cep?.replace(/[^\d-]/g, '') || '',
            type,
            external_id: record.id || '',
        },
        validation,
    };
}

export function mapMaterialFromAgendaBoa(record: AgendaBoaMaterial): { data: ImportedInventoryItem; validation: ValidationResult } {
    const validation: ValidationResult = { valid: true, warnings: [], errors: [] };

    if (!record.description?.trim()) {
        validation.errors.push('Descrição é obrigatória');
        validation.valid = false;
    }

    // Parse price - handle Brazilian format "R$ 1.234,56"
    const parsePrice = (priceStr: string): number => {
        if (!priceStr) return 0;
        return parseFloat(
            priceStr
                .replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.')
                .trim()
        ) || 0;
    };

    const price = parsePrice(record.unitPrice || record.cost);

    if (price === 0) validation.warnings.push('Preço não definido');

    // Generate SKU from id or description
    const sku = record.internalCode || record.id || `SKU-${Date.now()}`;

    return {
        data: {
            name: record.description?.trim() || '',
            sku,
            quantity: 0, // Default to 0 - needs to be set manually
            min_quantity: 5, // Default minimum
            unit: record.unitType?.trim() || 'UN',
            category: 'Importado', // Default category
            location: '',
            price,
            supplier: record.trademark?.trim() || '',
            external_id: record.id || '',
        },
        validation,
    };
}

export function mapServiceFromAgendaBoa(record: AgendaBoaService): { data: ImportedService; validation: ValidationResult } {
    const validation: ValidationResult = { valid: true, warnings: [], errors: [] };

    if (!record.description?.trim()) {
        validation.errors.push('Descrição é obrigatória');
        validation.valid = false;
    }

    // Parse price
    const parsePrice = (priceStr: string): number => {
        if (!priceStr) return 0;
        return parseFloat(
            priceStr
                .replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.')
                .trim()
        ) || 0;
    };

    const price = parsePrice(record.unitPrice);

    if (price === 0) validation.warnings.push('Preço não definido');

    return {
        data: {
            name: record.description?.trim() || '',
            description: record.details?.trim() || '',
            price,
            unit: record.unitType?.trim() || 'SV',
            type: 'service',
            external_id: record.id || '',
        },
        validation,
    };
}

export interface ImportedOrder {
    client_name: string;
    total_price: number;
    status: string;
    description: string;
    job_date: string;
    external_id: string;
}

export function mapOrderFromAgendaBoa(record: any): { data: ImportedOrder; validation: ValidationResult } {
    const validation: ValidationResult = { valid: true, warnings: [], errors: [] };

    // Common header variations for orders in Agenda Boa
    const clientName = record.clientName || record.client || record['Cliente'] || record['cliente'] || '';
    const totalPriceStr = record.totalPrice || record['Valor total'] || record['valor total'] || record['valor'] || '0';
    const status = record.jobStatus || record['Status'] || record['status'] || 'pendente';
    const title = record.jobTitle || record['Tópico'] || record['tópico'] || record['Título'] || record['descrição'] || record['Descrição'] || '';
    const date = record.jobTimeInMillis || record.jobDate || record['Data'] || record['data'] || record['Vencimento'] || record['vencimento'] || '';
    const id = record.id || record['ID do job'] || record['id'] || '';

    if (!clientName) {
        validation.errors.push('Cliente é obrigatório');
        validation.valid = false;
    }

    // Parse price
    const parsePrice = (priceStr: string): number => {
        if (!priceStr) return 0;
        return parseFloat(
            priceStr
                .replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.')
                .trim()
        ) || 0;
    };

    return {
        data: {
            client_name: clientName,
            total_price: parsePrice(totalPriceStr),
            status: status.toLowerCase(),
            description: title,
            job_date: formatDateToISO(date),
            external_id: id,
        },
        validation,
    };
}

// ===== IMPORT TYPE DETECTION =====

export type ImportType = 'clients' | 'materials' | 'services' | 'orders' | 'financial' | 'profile' | 'unknown';

export function detectImportType(headers: string[], firstLine?: string): ImportType {
    // If it looks like a profile (vertical key-value), the first line usually doesn't look like a header row
    if (firstLine && firstLine.includes(',') && !firstLine.includes('id') && !firstLine.includes('name')) {
        const parts = firstLine.split(',');
        if (parts[0].includes('.') || parts[0] === 'email' || parts[0] === 'firstName') {
            return 'profile';
        }
    }

    const headerSet = new Set(headers.map(h => h.toLowerCase().trim()));

    // Financial (recebiveis / receipts) - Handle 'clienId' typo
    if (headerSet.has('revenue') && (headerSet.has('clientid') || headerSet.has('clienid'))) {
        return 'financial';
    }

    // Clients
    if (headerSet.has('cnpj') || headerSet.has('cpf') || headerSet.has('corporatename') ||
        headerSet.has('nome') || headerSet.has('razão social')) {
        // Double check it's not orders if 'cliente' is present
        if (headerSet.has('id do job') || headerSet.has('valor total') || headerSet.has('jobid')) return 'orders';
        return 'clients';
    }

    // Materials
    if (headerSet.has('trademark') || headerSet.has('barcode') || headerSet.has('internalcode') ||
        headerSet.has('marca') || headerSet.has('código de barras')) {
        return 'materials';
    }

    // Services
    if (headerSet.has('unitprice') && headerSet.has('unittype') && !headerSet.has('trademark')) {
        return 'services';
    }

    // Orders
    if (headerSet.has('clientid') || headerSet.has('jobstatus') || headerSet.has('jobtitle') ||
        headerSet.has('id do job') || headerSet.has('valor total') || headerSet.has('status')) {
        return 'orders';
    }

    // Heuristic for export_vencidos.csv or other financial lists
    if ((headerSet.has('cliente') || headerSet.has('client')) &&
        (headerSet.has('vencimento') || headerSet.has('valor') || headerSet.has('saldo'))) {
        return 'financial';
    }

    return 'unknown';
}

export function getImportTypeLabel(type: ImportType): string {
    const labels: Record<ImportType, string> = {
        clients: 'Clientes',
        materials: 'Materiais/Estoque',
        services: 'Serviços',
        orders: 'Pedidos/Ordens',
        financial: 'Financeiro (Recebíveis/Recibos)',
        profile: 'Perfil da Empresa',
        unknown: 'Desconhecido',
    };
    return labels[type];
}
