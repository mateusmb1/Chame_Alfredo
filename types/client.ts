export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
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