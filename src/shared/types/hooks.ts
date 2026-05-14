/**
 * Data access hook interfaces for Phase 3 migration.
 * 
 * Currently, all data flows through AppContext (a monolithic Context).
 * In Phase 3, each feature module will implement its own hook using
 * TanStack Query + Firebase, matching these interfaces.
 * 
 * These interfaces serve as the migration contract — when a component
 * is refactored to use a domain hook instead of AppContext, it will
 * consume this exact interface.
 */

export interface UseOrdersReturn {
  orders: any[]
  addOrder: (order: any) => Promise<void>
  updateOrder: (id: string, updates: any) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
  deleteOrders: (ids: string[]) => Promise<void>
  isLoading: boolean
}

export interface UseClientsReturn {
  clients: any[]
  addClient: (client: any) => Promise<void>
  updateClient: (id: string, updates: any) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  isLoading: boolean
}

export interface UseQuotesReturn {
  quotes: any[]
  addQuote: (quote: any) => Promise<any>
  updateQuote: (id: string, updates: any) => void
  deleteQuote: (id: string) => void
  isLoading: boolean
}

export interface UseInvoicesReturn {
  invoices: any[]
  isLoading: boolean
}

export interface UseInventoryReturn {
  inventory: any[]
  addInventoryItem: (item: any) => void
  updateInventoryItem: (id: string, updates: any) => void
  deleteInventoryItem: (id: string) => void
  isLoading: boolean
}

export interface UseTeamReturn {
  technicians: any[]
  addTechnician: (tech: any) => Promise<void>
  updateTechnician: (id: string, updates: any) => Promise<any>
  deleteTechnician: (id: string) => Promise<void>
  isLoading: boolean
}

export interface UseProjectsReturn {
  projects: any[]
  addProject: (project: any) => Promise<any>
  updateProject: (id: string, updates: any) => void
  deleteProject: (id: string) => void
  isLoading: boolean
}

export interface UseContractsReturn {
  contracts: any[]
  addContract: (contract: any) => void
  updateContract: (id: string, updates: any) => void
  deleteContract: (id: string) => void
  isLoading: boolean
}

export interface UseCommunicationReturn {
  conversations: any[]
  messages: any[]
  sendMessage: (...args: any[]) => Promise<void>
  isLoading: boolean
}

export interface UseAgendaReturn {
  appointments: any[]
  addAppointment: (apt: any) => Promise<void>
  updateAppointment: (id: string, updates: any) => Promise<void>
  deleteAppointment: (id: string) => Promise<void>
  isLoading: boolean
}
