export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface QuoteAttachment {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  validityDate: string;
  paymentTerms?: string;
  notes: string;
  attachments: QuoteAttachment[];
  createdAt: string;
  updatedAt: string;
  signatureData?: string;
}

export interface CreateQuoteData {
  clientId: string;
  items: Omit<QuoteItem, 'id' | 'totalPrice'>[];
  validityDate: string;
  paymentTerms?: string;
  notes?: string;
  discount?: number;
  tax?: number;
  attachments?: QuoteAttachment[];
}