export interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  value: number;
  billingFrequency: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  startDate: string;
  endDate: string;
  status: 'ativo' | 'suspenso' | 'cancelado' | 'expirado';
  services: string[];
  createdAt: string;
  updatedAt: string;
  contractNumber?: string;
  clientType?: 'pf' | 'pj';
  autoRenewal?: boolean;
  paymentDay?: number;
  notes?: string;
  periodicity?: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  contractType?: 'manutencao' | 'instalacao' | 'consultoria' | 'suporte' | 'outro';
}

export interface CreateContractData {
  clientId: string;
  title: string;
  description: string;
  value: number;
  billingFrequency: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  startDate: string;
  endDate: string;
  services: string[];
  autoRenewal?: boolean;
  paymentDay?: number;
  notes?: string;
}