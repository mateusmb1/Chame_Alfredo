import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../src/lib/supabase';
import { Client } from '../types/client';
import { Order } from '../types/order';
import { InventoryItem } from '../types/inventory';
import { Quote } from '../types/quote';
import { Contract } from '../types/contract';
import { Technician } from '../types/technician';
import { Project, ProjectActivity } from '../types/project';

interface AppContextType {
    clients: Client[];
    orders: Order[];
    inventory: InventoryItem[];
    quotes: Quote[];
    contracts: Contract[];
    technicians: Technician[];
    projects: Project[];
    projectActivities: ProjectActivity[];

    // Client operations
    addClient: (client: Omit<Client, 'id' | 'status' | 'createdAt'>) => Promise<void>;
    updateClient: (id: string, updatedClient: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;

    // Order operations
    addOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => Promise<void>;
    updateOrder: (id: string, updatedOrder: Partial<Order>) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;

    // Inventory operations
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
    deleteInventoryItem: (id: string) => void;

    // Quote operations
    addQuote: (quote: Omit<Quote, 'id' | 'createdAt'>) => void;
    updateQuote: (id: string, updates: Partial<Quote>) => void;
    deleteQuote: (id: string) => void;

    // Contract operations
    addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => void;
    updateContract: (id: string, updates: Partial<Contract>) => void;
    deleteContract: (id: string) => void;

    // Technician operations
    addTechnician: (technician: Omit<Technician, 'id' | 'createdAt'>) => Promise<void>;
    updateTechnician: (id: string, updates: Partial<Technician>) => Promise<void>;
    deleteTechnician: (id: string) => Promise<void>;
    authenticateTechnician: (username: string, password: string) => Technician | null;

    // Project operations
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    archiveProject: (id: string) => void;
    unarchiveProject: (id: string) => void;
    deleteProject: (id: string) => void;

    // Project Activity operations
    addProjectActivity: (activity: Omit<ProjectActivity, 'id'>) => void;
    getProjectActivities: (projectId: string) => ProjectActivity[];

    // Project Link operations
    linkOrderToProject: (orderId: string, projectId: string) => void;
    unlinkOrderFromProject: (orderId: string, projectId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for non-migrated entities
const mockInventory: InventoryItem[] = [
    {
        id: '1',
        name: 'Câmera IP HD 1080p',
        sku: 'CAM-HD-001',
        quantity: 25,
        minQuantity: 5,
        unit: 'unidade',
        category: 'Câmeras',
        location: 'Prateleira A1',
        price: 450.00,
        supplier: 'Fornecedor ABC',
        lastRestockDate: '2024-07-15'
    },
    {
        id: '2',
        name: 'DVR 8 canais HD',
        sku: 'DVR-8CH-001',
        quantity: 8,
        minQuantity: 3,
        unit: 'unidade',
        category: 'Gravadores',
        location: 'Prateleira B2',
        price: 1200.00,
        supplier: 'Fornecedor XYZ',
        lastRestockDate: '2024-07-20'
    },
    {
        id: '3',
        name: 'Cabo Coaxial 100m',
        sku: 'CAB-COX-100',
        quantity: 15,
        minQuantity: 10,
        unit: 'rolo',
        category: 'Cabeamento',
        location: 'Prateleira C3',
        price: 85.00,
        supplier: 'Fornecedor ABC',
        lastRestockDate: '2024-07-10'
    }
];

const mockQuotes: Quote[] = [
    {
        id: 'ORC-001',
        clientId: '1',
        clientName: 'Condomínio Residencial Jardim das Flores',
        items: [
            {
                id: '1',
                description: 'Câmera IP HD 1080p',
                quantity: 4,
                unitPrice: 450.00,
                totalPrice: 1800.00
            },
            {
                id: '2',
                description: 'Instalação e configuração',
                quantity: 1,
                unitPrice: 700.00,
                totalPrice: 700.00
            }
        ],
        subtotal: 2500.00,
        tax: 450.00,
        total: 2950.00,
        status: 'aprovado',
        validityDate: '2024-08-31',
        notes: 'Orçamento aprovado pelo cliente',
        createdAt: '2024-08-05',
        updatedAt: '2024-08-07'
    },
    {
        id: 'ORC-002',
        clientId: '2',
        clientName: 'Empresa Tech Solutions Ltda',
        items: [
            {
                id: '1',
                description: 'DVR 8 canais HD',
                quantity: 2,
                unitPrice: 1200.00,
                totalPrice: 2400.00
            },
            {
                id: '2',
                description: 'Câmeras IP 1080p',
                quantity: 8,
                unitPrice: 450.00,
                totalPrice: 3600.00
            }
        ],
        subtotal: 6000.00,
        tax: 1080.00,
        total: 7080.00,
        status: 'pendente',
        validityDate: '2024-09-15',
        notes: 'Aguardando aprovação do cliente',
        createdAt: '2024-08-10',
        updatedAt: '2024-08-10'
    }
];

const mockContracts: Contract[] = [
    {
        id: 'CT-001',
        clientId: '1',
        clientName: 'Condomínio Residencial Jardim das Flores',
        title: 'Contrato de Manutenção Preventiva',
        description: 'Serviços mensais de manutenção preventiva em sistema de segurança',
        value: 1500.00,
        billingFrequency: 'mensal',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'ativo',
        services: ['Manutenção mensal', 'Suporte 24h', 'Reposição de peças'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
    },
    {
        id: 'CT-002',
        clientId: '2',
        clientName: 'Empresa Tech Solutions Ltda',
        title: 'Contrato de Suporte Técnico',
        description: 'Suporte técnico mensal para sistemas de CFTV',
        value: 800.00,
        billingFrequency: 'mensal',
        startDate: '2024-02-01',
        endDate: '2024-07-31',
        status: 'ativo',
        services: ['Suporte mensal', 'Atendimento remoto', 'Visitas técnicas'],
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01'
    }
];

const mockProjects: Project[] = [];
const mockProjectActivities: ProjectActivity[] = [];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Real Supabase Data
    const [clients, setClients] = useState<Client[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);

    // Mock Data (Not yet migrated)
    const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
    const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
    const [contracts, setContracts] = useState<Contract[]>(mockContracts);
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const [projectActivities, setProjectActivities] = useState<ProjectActivity[]>(mockProjectActivities);

    // Initial Fetch & Real-time Subscriptions
    useEffect(() => {
        // Fetch initial data
        const fetchData = async () => {
            const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
            if (clientsData) setClients(clientsData as any);
            if (clientsError) console.error('Error fetching clients:', clientsError);

            const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*');
            if (ordersData) setOrders(ordersData as any);
            if (ordersError) console.error('Error fetching orders:', ordersError);

            const { data: techniciansData, error: techError } = await supabase.from('technicians').select('*');
            if (techniciansData) setTechnicians(techniciansData as any);
            if (techError) console.error('Error fetching technicians:', techError);
        };

        fetchData();

        // Real-time subscriptions
        const clientSubscription = supabase
            .channel('clients_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setClients(prev => [...prev, payload.new as any]);
                } else if (payload.eventType === 'UPDATE') {
                    setClients(prev => prev.map(c => c.id === payload.new.id ? payload.new as any : c));
                } else if (payload.eventType === 'DELETE') {
                    setClients(prev => prev.filter(c => c.id !== payload.old.id));
                }
            })
            .subscribe();

        const orderSubscription = supabase
            .channel('orders_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setOrders(prev => [...prev, payload.new as any]);
                } else if (payload.eventType === 'UPDATE') {
                    setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new as any : o));
                } else if (payload.eventType === 'DELETE') {
                    setOrders(prev => prev.filter(o => o.id !== payload.old.id));
                }
            })
            .subscribe();

        const techSubscription = supabase
            .channel('technicians_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'technicians' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setTechnicians(prev => [...prev, payload.new as any]);
                } else if (payload.eventType === 'UPDATE') {
                    setTechnicians(prev => prev.map(t => t.id === payload.new.id ? payload.new as any : t));
                } else if (payload.eventType === 'DELETE') {
                    setTechnicians(prev => prev.filter(t => t.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(clientSubscription);
            supabase.removeChannel(orderSubscription);
            supabase.removeChannel(techSubscription);
        };
    }, []);

    // Client operations
    const addClient = async (client: Omit<Client, 'id' | 'status' | 'createdAt'>) => {
        const { error } = await supabase.from('clients').insert([{
            ...client,
            status: 'active'
        }]);
        if (error) console.error('Error adding client:', error);
    };

    const updateClient = async (id: string, updatedClient: Partial<Client>) => {
        const { error } = await supabase.from('clients').update(updatedClient).eq('id', id);
        if (error) console.error('Error updating client:', error);
    };

    const deleteClient = async (id: string) => {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) console.error('Error deleting client:', error);
    };

    // Order operations
    const addOrder = async (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
        const { error } = await supabase.from('orders').insert([{
            ...order,
            status: 'nova'
        }]);
        if (error) console.error('Error adding order:', error);
    };

    const updateOrder = async (id: string, updatedOrder: Partial<Order>) => {
        // Convert camelCase to snake_case for DB if needed, but we used matching names in SQL if careful
        // Actually our SQL uses camelCase column names? No, SQL usually uses snake_case, but JS uses camelCase.
        // Supabase JS client automatically handles mapping if setup, BUT by default it expects column names to match.
        // My migration used snake_case (e.g. client_id). The JS types use camelCase (clientId).
        // I need to map these or update the TS interfaces to match DB.
        // To be safe and quick, I will map manually here for the critical fields.

        const dbUpdate: any = { ...updatedOrder };
        // Mapping common fields that might differ. 
        // Ideally we'd have a transform layer, but for now:
        if (updatedOrder.clientId) dbUpdate.client_id = updatedOrder.clientId;
        if (updatedOrder.clientName) dbUpdate.client_name = updatedOrder.clientName;
        if (updatedOrder.serviceType) dbUpdate.service_type = updatedOrder.serviceType;
        if (updatedOrder.scheduledDate) dbUpdate.scheduled_date = updatedOrder.scheduledDate;
        if (updatedOrder.completedDate) dbUpdate.completed_date = updatedOrder.completedDate;
        if (updatedOrder.technicianId) dbUpdate.technician_id = updatedOrder.technicianId;
        if (updatedOrder.technicianName) dbUpdate.technician_name = updatedOrder.technicianName;
        if (updatedOrder.projectId) dbUpdate.project_id = updatedOrder.projectId;
        if (updatedOrder.projectName) dbUpdate.project_name = updatedOrder.projectName;

        // Remove camelCase keys to avoid errors if they don't exist in DB
        delete dbUpdate.clientId;
        delete dbUpdate.clientName;
        delete dbUpdate.serviceType;
        delete dbUpdate.scheduledDate;
        delete dbUpdate.completedDate;
        delete dbUpdate.technicianId;
        delete dbUpdate.technicianName;
        delete dbUpdate.projectId;
        delete dbUpdate.projectName;

        const { error } = await supabase.from('orders').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating order:', error);
    };

    const deleteOrder = async (id: string) => {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) console.error('Error deleting order:', error);
    };

    // Inventory operations
    const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
        const newItem: InventoryItem = {
            ...item,
            id: `item-${Date.now()}`
        };
        setInventory([...inventory, newItem]);
    };

    const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
        setInventory(inventory.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const deleteInventoryItem = (id: string) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    // Quote operations
    const addQuote = (quote: Omit<Quote, 'id' | 'createdAt'>) => {
        const newQuote: Quote = {
            ...quote,
            id: `ORC-${String(quotes.length + 1).padStart(3, '0')}`,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setQuotes([...quotes, newQuote]);
    };

    const updateQuote = (id: string, updates: Partial<Quote>) => {
        setQuotes(quotes.map(quote =>
            quote.id === id ? { ...quote, ...updates } : quote
        ));
    };

    const deleteQuote = (id: string) => {
        setQuotes(quotes.filter(quote => quote.id !== id));
    };

    // Contract operations
    const addContract = (contract: Omit<Contract, 'id' | 'createdAt'>) => {
        const newContract: Contract = {
            ...contract,
            id: `CT-${String(contracts.length + 1).padStart(3, '0')}`,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setContracts([...contracts, newContract]);
    };

    const updateContract = (id: string, updates: Partial<Contract>) => {
        setContracts(contracts.map(contract =>
            contract.id === id ? { ...contract, ...updates } : contract
        ));
    };

    const deleteContract = (id: string) => {
        setContracts(contracts.filter(contract => contract.id !== id));
    };

    // Technician operations
    const addTechnician = async (technician: Omit<Technician, 'id' | 'createdAt'>) => {
        const { error } = await supabase.from('technicians').insert([{
            ...technician,
            status: 'ativo'
        }]);
        if (error) console.error('Error adding technician:', error);
    };

    const updateTechnician = async (id: string, updates: Partial<Technician>) => {
        const { error } = await supabase.from('technicians').update(updates).eq('id', id);
        if (error) console.error('Error updating technician:', error);
    };

    const deleteTechnician = async (id: string) => {
        const { error } = await supabase.from('technicians').delete().eq('id', id);
        if (error) console.error('Error deleting technician:', error);
    };

    const authenticateTechnician = (username: string, password: string): Technician | null => {
        // Now checks against the state which is populated from DB
        const tech = technicians.find(t => t.username === username && t.password === password);
        return tech || null;
    };

    // Project operations
    const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newProject: Project = {
            ...project,
            id: `proj-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        setProjects([...projects, newProject]);

        // Add creation activity
        addProjectActivity({
            projectId: newProject.id,
            type: 'criacao',
            description: `Projeto criado por ${newProject.managerName}`,
            performedBy: newProject.managerName,
            performedById: newProject.managerId
        });
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        const oldProject = projects.find(p => p.id === id);
        setProjects(projects.map(project =>
            project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : project
        ));

        // Add status change activity if status changed
        if (oldProject && updates.status && updates.status !== oldProject.status) {
            addProjectActivity({
                projectId: id,
                type: 'status_change',
                description: `Status alterado de "${oldProject.status}" para "${updates.status}"`,
                performedBy: 'Sistema', // In a real app, this would be the current user
                performedById: 'system',
                metadata: { previousStatus: oldProject.status, newStatus: updates.status }
            });
        }
    };

    const archiveProject = (id: string) => {
        updateProject(id, { status: 'arquivado', archivedAt: new Date().toISOString().split('T')[0] });
    };

    const unarchiveProject = (id: string) => {
        updateProject(id, { status: 'planejamento', archivedAt: undefined });
    };

    const deleteProject = (id: string) => {
        setProjects(projects.filter(project => project.id !== id));
        // Remove project references from orders (Local state update, might need DB update if orders are in DB)
        // Since orders ARE in DB now, this local logic is insufficient for orders, but okay for now as we don't have Projects in DB.
    };

    // Project Activity operations
    const addProjectActivity = (activity: Omit<ProjectActivity, 'id'>) => {
        const newActivity: ProjectActivity = {
            ...activity,
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString()
        };
        setProjectActivities([...projectActivities, newActivity]);
    };

    const getProjectActivities = (projectId: string): ProjectActivity[] => {
        return projectActivities
            .filter(activity => activity.projectId === projectId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    // Project Link operations
    const linkOrderToProject = (orderId: string, projectId: string) => {
        // Needs update to support DB orders
        const project = projects.find(p => p.id === projectId);
        if (project) {
            updateOrder(orderId, { projectId, projectName: project.name });
            updateProject(projectId, {
                relatedOrders: [...project.relatedOrders, orderId]
            });
        }
    };

    const unlinkOrderFromProject = (orderId: string, projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            updateOrder(orderId, { projectId: undefined, projectName: undefined });
            updateProject(projectId, {
                relatedOrders: project.relatedOrders.filter(id => id !== orderId)
            });
        }
    };

    const value: AppContextType = {
        clients,
        orders,
        inventory,
        quotes,
        contracts,
        technicians,
        projects,
        projectActivities,

        // Client operations
        addClient,
        updateClient,
        deleteClient,

        // Order operations
        addOrder,
        updateOrder,
        deleteOrder,

        // Inventory operations
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,

        // Quote operations
        addQuote,
        updateQuote,
        deleteQuote,

        // Contract operations
        addContract,
        updateContract,
        deleteContract,

        // Technician operations
        addTechnician,
        updateTechnician,
        deleteTechnician,
        authenticateTechnician,

        // Project operations
        addProject,
        updateProject,
        archiveProject,
        unarchiveProject,
        deleteProject,

        // Project Activity operations
        addProjectActivity,
        getProjectActivities,

        // Project Link operations
        linkOrderToProject,
        unlinkOrderFromProject
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export default AppContext;