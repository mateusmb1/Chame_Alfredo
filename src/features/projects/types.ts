// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'instalacao' | 'manutencao' | 'consultoria' | 'suporte' | 'inspecao' | 'treinamento' | 'outro';
  status: 'planejamento' | 'em_andamento' | 'em_pausa' | 'pendente' | 'concluido' | 'cancelado' | 'arquivado';
  clientId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  progress: number;
  responsibleId: string;
  responsibleName: string;
  team: ProjectMember[];
  relatedOrders: string[]; // Order IDs
  quoteId?: string; // Linked quote ID
  quoteName?: string; // Quote reference number
  documents: ProjectDocument[];
  notes: ProjectNote[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ProjectMember {
  technicianId: string;
  name: string;
  role: 'gerente' | 'tecnico_principal' | 'tecnico' | 'auxiliar';
  allocatedHours: number;
  actualHours: number;
  status: 'ativo' | 'concluido' | 'removido';
  joinedAt: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'contrato' | 'imagem' | 'relatorio' | 'outro';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProjectNote {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  type: 'criacao' | 'status_change' | 'member_added' | 'member_removed' | 'order_linked' | 'document_added' | 'note_added';
  description: string;
  performedBy: string;
  performedById: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
