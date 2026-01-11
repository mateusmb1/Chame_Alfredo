export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  specialization: string[];
  status: 'ativo' | 'inativo';
  currentProjects?: string[];
  allocatedHoursThisMonth: number;
  createdAt: string;
}