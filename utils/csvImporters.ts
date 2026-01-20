/**
 * Agenda Boa CSV Import Utilities
 * Parse and map CSV data from legacy system to Supabase schema
 */

// Parse CSV string to array of objects
export function parseCSV<T>(csvContent: string): T[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const records: T[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const record: Record<string, string> = {};

        headers.forEach((header, index) => {
            record[header] = values[index] || '';
        });

        records.push(record as T);
    }

    return records;
}

// Parse a single CSV line handling quoted values
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

// ===== IMPORT TYPE DETECTION =====

export type ImportType = 'clients' | 'materials' | 'services' | 'orders' | 'unknown';

export function detectImportType(headers: string[]): ImportType {
    const headerSet = new Set(headers.map(h => h.toLowerCase()));

    if (headerSet.has('cnpj') || headerSet.has('cpf') || headerSet.has('corporatename')) {
        return 'clients';
    }
    if (headerSet.has('trademark') || headerSet.has('barcode') || headerSet.has('internalcode')) {
        return 'materials';
    }
    if (headerSet.has('unitprice') && headerSet.has('unittype') && !headerSet.has('trademark')) {
        return 'services';
    }
    if (headerSet.has('clientid') || headerSet.has('jobstatus') || headerSet.has('jobtitle')) {
        return 'orders';
    }

    return 'unknown';
}

export function getImportTypeLabel(type: ImportType): string {
    const labels: Record<ImportType, string> = {
        clients: 'Clientes',
        materials: 'Materiais/Estoque',
        services: 'Serviços',
        orders: 'Pedidos/Ordens',
        unknown: 'Desconhecido',
    };
    return labels[type];
}
