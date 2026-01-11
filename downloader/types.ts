export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

export enum InvoiceStatus {
  PAID = 'Pago',
  PENDING = 'Pendente',
  OVERDUE = 'Atrasado',
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  type: 'Serviço' | 'Recorrência';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'Produto' | 'Serviço';
  stock?: number;
  sku?: string;
  category: string;
}

export enum ContractStatus {
  ACTIVE = 'Ativo',
  SUSPENDED = 'Suspenso',
  CLOSED = 'Encerrado',
}

export interface Contract {
  id: string;
  name: string;
  clientName: string;
  serviceType: string;
  value: number;
  period: 'Mensal' | 'Trimestral' | 'Anual';
  nextBilling: string;
  status: ContractStatus;
  startDate: string;
}