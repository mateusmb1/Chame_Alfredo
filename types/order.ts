export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  description: string;
  status: 'nova' | 'em_andamento' | 'pendente' | 'finalizada' | 'cancelada';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  scheduledDate: string;
  completedDate: string | null;
  technicianId: string;
  technicianName: string;
  value: number;
  observations: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  projectName?: string;
  checkIn?: any;
  checkOut?: any;
  servicePhotos?: any[];
  serviceNotes?: string;
  customerSignature?: string;
}

export interface CreateOrderData {
  client: string;
  clientName: string;
  serviceType: string;
  technician: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
}