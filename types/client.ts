export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  cpfCnpj: string;
  status: 'active' | 'inactive';
  createdAt: string;
  serviceHistory: string[];
  contracts: string[];
  notes?: string;
  type?: 'pf' | 'pj';
  password?: string;
  username?: string;
  lastLogin?: string;
  preferences?: {
    notifications: boolean;
    emailAlerts: boolean;
  };
}