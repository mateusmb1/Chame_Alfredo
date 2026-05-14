export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sourceId?: string;
  sourceType?: 'order' | 'contract' | 'quote';
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  type: 'service' | 'recurring';
  paymentDate?: string;
  paymentMethod?: string;
  observations?: string;
  contractId?: string;
  quoteId?: string;
  orderId?: string;
  sourceQuoteId?: string;
  sourceOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  clientId: string;
  items: Omit<InvoiceItem, 'id' | 'totalPrice'>[];
  dueDate: string;
  type: 'service' | 'recurring';
  discount?: number;
  observations?: string;
  contractId?: string;
  quoteId?: string;
  orderId?: string;
  sourceQuoteId?: string;
  sourceOrderId?: string;
}