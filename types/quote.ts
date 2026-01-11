export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  validityDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteData {
  clientId: string;
  items: Omit<QuoteItem, 'id' | 'totalPrice'>[];
  validityDate: string;
  notes?: string;
}