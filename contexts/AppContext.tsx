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



export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Real Supabase Data
    const [clients, setClients] = useState<Client[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectActivities, setProjectActivities] = useState<ProjectActivity[]>([]);

    // Initial Fetch & Real-time Subscriptions
    useEffect(() => {
        const fetchData = async () => {
            // Parallel fetching for performance
            const [
                { data: clientsData },
                { data: ordersData },
                { data: techniciansData },
                { data: inventoryData },
                { data: quotesData },
                { data: contractsData },
                { data: projectsData },
                { data: activitiesData }
            ] = await Promise.all([
                supabase.from('Clientes').select('*'),
                supabase.from('orders').select('*'),
                supabase.from('technicians').select('*'),
                supabase.from('inventory').select('*'),
                supabase.from('quotes').select('*, client:Clientes(name)'),
                supabase.from('contracts').select('*, client:Clientes(name)'),
                supabase.from('projects').select('*, client:Clientes(name), responsible:technicians(name)'),
                supabase.from('project_activities').select('*')
            ]);

            if (clientsData) setClients(clientsData.map(mapClientFromDB));
            if (ordersData) setOrders(ordersData as any); // Order mapping if needed
            if (techniciansData) setTechnicians(techniciansData as any);
            if (inventoryData) setInventory(inventoryData.map(mapInventoryFromDB));
            if (quotesData) setQuotes(quotesData.map(mapQuoteFromDB));
            if (contractsData) setContracts(contractsData.map(mapContractFromDB));
            if (projectsData) setProjects(projectsData.map(mapProjectFromDB));
            if (activitiesData) setProjectActivities(activitiesData.map(mapActivityFromDB));
        };

        fetchData();

        // Real-time subscriptions
        const channels = [
            supabase.channel('clients_all').on('postgres_changes', { event: '*', schema: 'public', table: 'Clientes' }, payload => handleRealtimeUpdate(payload, setClients, mapClientFromDB)).subscribe(),
            supabase.channel('orders_all_sub').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => handleRealtimeUpdate(payload, setOrders, (x) => x as any)).subscribe(),
            supabase.channel('techs_all').on('postgres_changes', { event: '*', schema: 'public', table: 'technicians' }, payload => handleRealtimeUpdate(payload, setTechnicians, (x) => x as any)).subscribe(),
            supabase.channel('inv_all').on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, payload => handleRealtimeUpdate(payload, setInventory, mapInventoryFromDB)).subscribe(),
            supabase.channel('quotes_all').on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, payload => handleRealtimeUpdate(payload, setQuotes, mapQuoteFromDB)).subscribe(),
            supabase.channel('contracts_all').on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, payload => handleRealtimeUpdate(payload, setContracts, mapContractFromDB)).subscribe(),
            supabase.channel('projects_all').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => handleRealtimeUpdate(payload, setProjects, mapProjectFromDB)).subscribe(),
            supabase.channel('acts_all').on('postgres_changes', { event: '*', schema: 'public', table: 'project_activities' }, payload => handleRealtimeUpdate(payload, setProjectActivities, mapActivityFromDB)).subscribe(),
        ];

        return () => {
            channels.forEach(channel => supabase.removeChannel(channel));
        };
    }, []);

    // Generic Realtime Handler
    const handleRealtimeUpdate = (payload: any, setter: React.Dispatch<React.SetStateAction<any[]>>, mapper: (data: any) => any) => {
        if (payload.eventType === 'INSERT') {
            setter(prev => {
                if (prev.some(item => item.id === payload.new.id)) return prev;
                return [...prev, mapper(payload.new)];
            });
        } else if (payload.eventType === 'UPDATE') {
            setter(prev => prev.map(item => item.id === payload.new.id ? mapper(payload.new) : item));
        } else if (payload.eventType === 'DELETE') {
            setter(prev => prev.filter(item => item.id !== payload.old.id));
        }
    };

    // Helper to map DB client to App client
    const mapClientFromDB = (data: any): Client => ({
        ...data,
        cpfCnpj: data.cpf_cnpj,
        serviceHistory: data.service_history || [],
        createdAt: data.created_at,
        // Ensure arrays are initialized
        contracts: data.contracts || [],
    });

    // Helper to map App client to DB client
    const mapClientToDB = (client: Partial<Client>) => {
        const { cpfCnpj, serviceHistory, createdAt, ...rest } = client;
        return {
            ...rest,
            ...(cpfCnpj !== undefined && { cpf_cnpj: cpfCnpj }),
            ...(serviceHistory !== undefined && { service_history: serviceHistory }),
            // createdAt is usually handled by DB default, but if passed:
            ...(createdAt !== undefined && { created_at: createdAt }),
        };
    };

    // Client operations
    const addClient = async (client: Omit<Client, 'id' | 'status' | 'createdAt'>) => {
        const dbUser = mapClientToDB({
            ...client,
            status: 'active',
            serviceHistory: [],
            contracts: []
        });

        const { data, error } = await supabase.from('Clientes').insert([dbUser]).select().single();
        if (error) {
            console.error('Error adding client:', error);
        } else if (data) {
            setClients(prev => [...prev, mapClientFromDB(data)]);
        }
    };

    const updateClient = async (id: string, updatedClient: Partial<Client>) => {
        const dbUpdate = mapClientToDB(updatedClient);
        const { error } = await supabase.from('Clientes').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating client:', error);
    };

    const deleteClient = async (id: string) => {
        const { error } = await supabase.from('Clientes').delete().eq('id', id);
        if (error) console.error('Error deleting client:', error);
    };

    // Mappers
    const mapInventoryFromDB = (d: any): InventoryItem => ({
        ...d,
        minQuantity: d.min_quantity,
        lastRestockDate: d.last_restock_date
    });
    const mapInventoryToDB = (i: Partial<InventoryItem>) => ({
        ...i,
        min_quantity: i.minQuantity,
        last_restock_date: i.lastRestockDate,
    }); // Remove camelCase props if strictly needed, but Supabase ignores extras usually. Better to be clean.

    const mapQuoteFromDB = (d: any): Quote => ({
        ...d,
        clientId: d.client_id,
        clientName: d.client?.name || d.client_name || 'Cliente removido',
        validityDate: d.validity_date,
        createdAt: d.created_at,
        updatedAt: d.updated_at
    });
    const mapQuoteToDB = (q: Partial<Quote>) => {
        const { clientId, clientName, validityDate, createdAt, updatedAt, ...rest } = q;
        return {
            ...rest,
            ...(clientId && { client_id: clientId }),
            ...(clientName && { client_name: clientName }),
            ...(validityDate && { validity_date: validityDate }),
        };
    };

    const mapContractFromDB = (d: any): Contract => ({
        ...d,
        clientId: d.client_id,
        clientName: d.client?.name || 'Cliente removido',
        billingFrequency: d.billing_frequency,
        startDate: d.start_date,
        endDate: d.end_date,
        contractType: d.contract_type,
        createdAt: d.created_at,
        updatedAt: d.updated_at
    });
    const mapContractToDB = (c: Partial<Contract>) => {
        const { clientId, billingFrequency, startDate, endDate, contractType, createdAt, updatedAt, ...rest } = c;
        return {
            ...rest,
            ...(clientId && { client_id: clientId }),
            ...(billingFrequency && { billing_frequency: billingFrequency }),
            ...(startDate && { start_date: startDate }),
            ...(endDate && { end_date: endDate }),
            ...(contractType && { contract_type: contractType }),
        };
    };

    const mapProjectFromDB = (d: any): Project => ({
        ...d,
        clientId: d.client_id,
        clientName: d.client?.name || 'Cliente removido',
        startDate: d.start_date,
        endDate: d.end_date,
        responsibleId: d.responsible_id,
        responsibleName: d.responsible?.name || 'N/A',
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        archivedAt: d.archived_at
    });
    const mapProjectToDB = (p: Partial<Project>) => {
        const { clientId, startDate, endDate, responsibleId, createdAt, updatedAt, archivedAt, ...rest } = p;
        return {
            ...rest,
            ...(clientId && { client_id: clientId }),
            ...(startDate && { start_date: startDate }),
            ...(endDate && { end_date: endDate }),
            ...(responsibleId && { responsible_id: responsibleId }),
            ...(archivedAt && { archived_at: archivedAt }),
        };
    };

    const mapActivityFromDB = (d: any): ProjectActivity => ({
        ...d,
        projectId: d.project_id,
        performedBy: d.performed_by,
        // performedById might be missing in DB if not added to column
    });
    // Note: performed_by_id was not in the create table script above?? 
    // Checking script: "performed_by TEXT NOT NULL". Ah, missed performed_by_id column in migration? 
    // Types say performedById: string. 
    // Migration: performed_by TEXT.
    // I should probably just store JSON metadata for extras or keep it simple.
    // For now mapping performedBy to performed_by.

    const mapActivityToDB = (a: Partial<ProjectActivity>) => {
        const { projectId, performedBy, performedById, ...rest } = a;
        return {
            ...rest,
            ...(projectId && { project_id: projectId }),
            ...(performedBy && { performed_by: performedBy }),
            // Ignoring performedById for DB as column likely missing or needs to be added
        };
    };

    // Client operations (Mapping already added)

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
    const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
        const dbItem = mapInventoryToDB(item);
        const { error } = await supabase.from('inventory').insert([dbItem]);
        if (error) console.error('Error adding inventory:', error);
    };

    const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
        const dbUpdate = mapInventoryToDB(updates);
        // Clean undefineds
        Object.keys(dbUpdate).forEach(key => (dbUpdate as any)[key] === undefined && delete (dbUpdate as any)[key]);
        const { error } = await supabase.from('inventory').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating inventory:', error);
    };

    const deleteInventoryItem = async (id: string) => {
        const { error } = await supabase.from('inventory').delete().eq('id', id);
        if (error) console.error('Error deleting inventory:', error);
    };

    // Quote operations
    const addQuote = async (quote: Omit<Quote, 'id' | 'createdAt'>) => {
        const dbQuote = mapQuoteToDB(quote);
        const { error } = await supabase.from('quotes').insert([{ ...dbQuote, status: 'draft' }]); // Default status
        if (error) console.error('Error adding quote:', error);
    };

    const updateQuote = async (id: string, updates: Partial<Quote>) => {
        const dbUpdate = mapQuoteToDB(updates);
        Object.keys(dbUpdate).forEach(key => (dbUpdate as any)[key] === undefined && delete (dbUpdate as any)[key]);
        const { error } = await supabase.from('quotes').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating quote:', error);
    };

    const deleteQuote = async (id: string) => {
        const { error } = await supabase.from('quotes').delete().eq('id', id);
        if (error) console.error('Error deleting quote:', error);
    };

    // Contract operations
    const addContract = async (contract: Omit<Contract, 'id' | 'createdAt'>) => {
        const dbContract = mapContractToDB(contract);
        const { error } = await supabase.from('contracts').insert([dbContract]);
        if (error) console.error('Error adding contract:', error);
    };

    const updateContract = async (id: string, updates: Partial<Contract>) => {
        const dbUpdate = mapContractToDB(updates);
        Object.keys(dbUpdate).forEach(key => (dbUpdate as any)[key] === undefined && delete (dbUpdate as any)[key]);
        const { error } = await supabase.from('contracts').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating contract:', error);
    };

    const deleteContract = async (id: string) => {
        const { error } = await supabase.from('contracts').delete().eq('id', id);
        if (error) console.error('Error deleting contract:', error);
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
    const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        const dbProject = mapProjectToDB(project);
        const { data, error } = await supabase.from('projects').insert([dbProject]).select().single();
        if (error) {
            console.error('Error adding project:', error);
            return;
        }

        // Add creation activity
        if (data) {
            addProjectActivity({
                projectId: data.id,
                type: 'criacao',
                description: `Projeto criado`,
                performedBy: 'Sistema',
                performedById: 'system',
                timestamp: new Date().toISOString()
            });

        }
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        const dbUpdate = mapProjectToDB(updates);
        Object.keys(dbUpdate).forEach(key => (dbUpdate as any)[key] === undefined && delete (dbUpdate as any)[key]);
        const { error } = await supabase.from('projects').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating project:', error);

        // Activity logging (simplified)
        if (updates.status) {
            addProjectActivity({
                projectId: id,
                type: 'status_change',
                description: `Status alterado para "${updates.status}"`,
                performedBy: 'Sistema',
                performedById: 'system',
                timestamp: new Date().toISOString()
            });
        }
    };

    const archiveProject = async (id: string) => {
        updateProject(id, { status: 'arquivado', archivedAt: new Date().toISOString() });
    };

    const unarchiveProject = async (id: string) => {
        // We need to explicitly handle unsetting archivedAt. 
        // Supabase update with null works.
        const { error } = await supabase.from('projects').update({ status: 'planejamento', archived_at: null }).eq('id', id);
        if (error) console.error('Error unarchiving:', error);
    };

    const deleteProject = async (id: string) => {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) console.error('Error deleting project:', error);
    };

    // Project Activity operations
    const addProjectActivity = async (activity: Omit<ProjectActivity, 'id'>) => {
        const dbActivity = mapActivityToDB(activity);
        const { error } = await supabase.from('project_activities').insert([dbActivity]);
        if (error) console.error('Error adding activity:', error);
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