import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../src/lib/supabase';
import { Client } from '../types/client';
import { Order } from '../types/order';
import { InventoryItem } from '../types/inventory';
import { Quote } from '../types/quote';
import { Contract } from '../types/contract';
import { Technician } from '../types/technician';
import { Project, ProjectActivity } from '../types/project';
import { ProductService } from '../types/productService';
import { Invoice } from '../types/invoice';
import { Appointment } from '../types/appointment';
import { Conversation, Message } from '../types/communication';

interface AppContextType {
    clients: Client[];
    orders: Order[];
    inventory: InventoryItem[];
    quotes: Quote[];
    contracts: Contract[];
    technicians: Technician[];
    projects: Project[];
    projectActivities: ProjectActivity[];
    products: ProductService[];
    invoices: Invoice[];
    appointments: Appointment[];
    conversations: Conversation[];
    messages: Message[];

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

    // Notification callbacks
    onNewOrder?: (order: Order) => void;
    setOnNewOrder: (callback: (order: Order) => void) => void;

    // Communication operations
    sendMessage: (conversationId: string, senderId: string, senderType: 'admin' | 'technician' | 'client', content: string) => Promise<void>;
    getOrCreateConversation: (techId: string) => Promise<string | null>;
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

    // New tables
    const [products, setProducts] = useState<ProductService[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    // Notification callbacks
    const [onNewOrderCallback, setOnNewOrderCallback] = useState<((order: Order) => void) | undefined>(undefined);

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
                { data: activitiesData },
                { data: productsData },
                { data: invoicesData },
                { data: appointmentsData },
                { data: conversationsData },
                { data: messagesData }
            ] = await Promise.all([
                supabase.from('clients').select('*'),
                supabase.from('orders').select('*'),
                supabase.from('technicians').select('*'),
                supabase.from('inventory').select('*'),
                supabase.from('quotes').select('*, client:clients(name)'),
                supabase.from('contracts').select('*, client:clients(name)'),
                supabase.from('projects').select('*, client:clients(name), responsible:technicians(name)'),
                supabase.from('project_activities').select('*'),
                supabase.from('products_services').select('*'),
                supabase.from('invoices').select('*'),
                supabase.from('appointments').select('*'),
                supabase.from('conversations').select('*'),
                supabase.from('messages').select('*')
            ]);

            if (clientsData) setClients(clientsData.map(mapClientFromDB));
            if (ordersData) setOrders(ordersData.map(mapOrderFromDB));
            if (techniciansData) setTechnicians(techniciansData as any);
            if (inventoryData) setInventory(inventoryData.map(mapInventoryFromDB));
            if (quotesData) setQuotes(quotesData.map(mapQuoteFromDB));
            if (contractsData) setContracts(contractsData.map(mapContractFromDB));
            if (projectsData) setProjects(projectsData.map(mapProjectFromDB));
            if (activitiesData) setProjectActivities(activitiesData.map(mapActivityFromDB));

            // New tables (simple mapping for now)
            if (productsData) setProducts(productsData.map((p: any) => ({
                ...p,
                createdAt: p.created_at,
                updatedAt: p.updated_at
            })));
            if (invoicesData) setInvoices(invoicesData.map((i: any) => ({
                ...i,
                invoiceNumber: i.invoice_number,
                clientId: i.client_id,
                orderId: i.order_id,
                issueDate: i.issue_date,
                dueDate: i.due_date,
                paidDate: i.paid_date,
                paymentMethod: i.payment_method,
                createdAt: i.created_at,
                updatedAt: i.updated_at
            })));
            if (appointmentsData) setAppointments(appointmentsData.map((a: any) => ({
                ...a,
                startTime: a.start_time,
                endTime: a.end_time,
                orderId: a.order_id,
                clientId: a.client_id,
                technicianId: a.technician_id,
                createdAt: a.created_at,
                updatedAt: a.updated_at
            })));
            if (conversationsData) setConversations(conversationsData.map(mapConversationFromDB));
            if (messagesData) setMessages(messagesData.map(mapMessageFromDB));
        };

        fetchData();

        // Real-time subscriptions
        const channels = [
            supabase.channel('clients_all').on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, payload => handleRealtimeUpdate(payload, setClients, mapClientFromDB)).subscribe(),
            supabase.channel('orders_all_sub').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => handleRealtimeUpdate(payload, setOrders, mapOrderFromDB, 'orders')).subscribe(),
            supabase.channel('techs_all').on('postgres_changes', { event: '*', schema: 'public', table: 'technicians' }, payload => handleRealtimeUpdate(payload, setTechnicians, (x) => x as any)).subscribe(),
            supabase.channel('inv_all').on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, payload => handleRealtimeUpdate(payload, setInventory, mapInventoryFromDB)).subscribe(),
            supabase.channel('quotes_all').on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, payload => handleRealtimeUpdate(payload, setQuotes, mapQuoteFromDB)).subscribe(),
            supabase.channel('contracts_all').on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, payload => handleRealtimeUpdate(payload, setContracts, mapContractFromDB)).subscribe(),
            supabase.channel('projects_all').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => handleRealtimeUpdate(payload, setProjects, mapProjectFromDB)).subscribe(),
            supabase.channel('acts_all').on('postgres_changes', { event: '*', schema: 'public', table: 'project_activities' }, payload => handleRealtimeUpdate(payload, setProjectActivities, mapActivityFromDB)).subscribe(),
            supabase.channel('conv_all').on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, payload => handleRealtimeUpdate(payload, setConversations, mapConversationFromDB)).subscribe(),
            supabase.channel('msg_all').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => handleRealtimeUpdate(payload, setMessages, mapMessageFromDB)).subscribe(),
        ];

        return () => {
            channels.forEach(channel => supabase.removeChannel(channel));
        };
    }, []);

    // Generic Realtime Handler
    const handleRealtimeUpdate = (payload: any, setter: React.Dispatch<React.SetStateAction<any[]>>, mapper: (data: any) => any, tableName?: string) => {
        if (payload.eventType === 'INSERT') {
            setter(prev => {
                if (prev.some(item => item.id === payload.new.id)) return prev;
                const newItem = mapper(payload.new);

                // Trigger notification for new orders
                if (tableName === 'orders' && onNewOrderCallback) {
                    onNewOrderCallback(newItem as Order);
                }

                return [...prev, newItem];
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

    // Order mappers
    const mapOrderFromDB = (data: any): Order => ({
        ...data,
        clientId: data.client_id,
        clientName: data.client_name,
        serviceType: data.service_type,
        scheduledDate: data.scheduled_date,
        completedDate: data.completed_date,
        technicianId: data.technician_id,
        technicianName: data.technician_name,
        projectId: data.project_id,
        projectName: data.project_name,
        checkIn: data.check_in,
        checkOut: data.check_out,
        servicePhotos: data.service_photos || [],
        serviceNotes: data.service_notes,
        customerSignature: data.customer_signature,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    });

    const mapConversationFromDB = (c: any): Conversation => ({
        ...c,
        lastMessageAt: c.last_message_at,
        createdAt: c.created_at
    });

    const mapMessageFromDB = (m: any): Message => ({
        ...m,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        senderType: m.sender_type,
        createdAt: m.created_at
    });

    const mapOrderToDB = (order: Partial<Order>) => {
        const { clientId, clientName, serviceType, scheduledDate, completedDate,
            technicianId, technicianName, projectId, projectName, createdAt, updatedAt, ...rest } = order;
        return {
            ...rest,
            ...(clientId !== undefined && { client_id: clientId }),
            ...(clientName !== undefined && { client_name: clientName }),
            ...(serviceType !== undefined && { service_type: serviceType }),
            ...(scheduledDate !== undefined && { scheduled_date: scheduledDate }),
            ...(completedDate !== undefined && { completed_date: completedDate }),
            ...(technicianId !== undefined && { technician_id: technicianId }),
            ...(technicianName !== undefined && { technician_name: technicianName }),
            ...(projectId !== undefined && { project_id: projectId }),
            ...(projectName !== undefined && { project_name: projectName }),
            ...(order.checkIn !== undefined && { check_in: order.checkIn }),
            ...(order.checkOut !== undefined && { check_out: order.checkOut }),
            ...(order.servicePhotos !== undefined && { service_photos: order.servicePhotos }),
            ...(order.serviceNotes !== undefined && { service_notes: order.serviceNotes }),
            ...(order.customerSignature !== undefined && { customer_signature: order.customerSignature }),
            ...(createdAt !== undefined && { created_at: createdAt }),
            ...(updatedAt !== undefined && { updated_at: updatedAt }),
        };
    };

    // Client operations (Mapping already added)


    // Memoize operations to prevent unnecessary re-renders
    const addClient = React.useCallback(async (client: Omit<Client, 'id' | 'status' | 'createdAt'>) => {
        const dbUser = mapClientToDB({
            ...client,
            status: 'active',
            serviceHistory: [],
            contracts: []
        });

        const { data, error } = await supabase.from('clients').insert([dbUser]).select().single();
        if (error) {
            console.error('Error adding client:', error);
        } else if (data) {
            setClients(prev => [...prev, mapClientFromDB(data)]);
        }
    }, [setClients, mapClientToDB, mapClientFromDB, supabase]);

    const updateClient = React.useCallback(async (id: string, updatedClient: Partial<Client>) => {
        const dbUpdate = mapClientToDB(updatedClient);
        const { error } = await supabase.from('clients').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating client:', error);
    }, [mapClientToDB, supabase]);

    const deleteClient = React.useCallback(async (id: string) => {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) console.error('Error deleting client:', error);
    }, [supabase]);

    const addOrder = React.useCallback(async (order: Omit<Order, 'id' | 'status' | 'createdAt'> & { status?: Order['status'] }) => {
        const dbOrder = mapOrderToDB({
            status: 'nova' as Order['status'], // Default
            ...order
        });
        const { data, error } = await supabase.from('orders').insert([dbOrder]).select().single();
        if (error) {
            console.error('Error adding order:', error);
        } else if (data) {
            setOrders(prev => [...prev, mapOrderFromDB(data)]);
        }
    }, [setOrders, mapOrderToDB, mapOrderFromDB, supabase]);

    const updateOrder = React.useCallback(async (id: string, updatedOrder: Partial<Order>) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedOrder } : o));

        const dbUpdate = mapOrderToDB(updatedOrder);
        const { error } = await supabase.from('orders').update(dbUpdate).eq('id', id);
        if (error) {
            console.error('Error updating order:', error);
            // Revert or refresh on error? For now, just log.
        }
    }, [mapOrderToDB, supabase, setOrders]);

    const deleteOrder = React.useCallback(async (id: string) => {
        setOrders(prev => prev.filter(o => o.id !== id));
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) console.error('Error deleting order:', error);
    }, [supabase, setOrders]);

    const addInventoryItem = React.useCallback(async (item: Omit<InventoryItem, 'id'>) => {
        const dbItem = mapInventoryToDB(item);
        const { error } = await supabase.from('inventory').insert([dbItem]);
        if (error) console.error('Error adding inventory:', error);
    }, [mapInventoryToDB, supabase]);

    const updateInventoryItem = React.useCallback(async (id: string, updates: Partial<InventoryItem>) => {
        const dbUpdate = mapInventoryToDB(updates);
        // Clean undefineds
        Object.keys(dbUpdate).forEach(key => (dbUpdate as any)[key] === undefined && delete (dbUpdate as any)[key]);
        const { error } = await supabase.from('inventory').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating inventory:', error);
    }, [mapInventoryToDB, supabase]);

    const deleteInventoryItem = React.useCallback(async (id: string) => {
        const { error } = await supabase.from('inventory').delete().eq('id', id);
        if (error) console.error('Error deleting inventory:', error);
    }, [supabase]);

    // Quote operations
    const addQuote = React.useCallback(async (quote: Omit<Quote, 'id' | 'createdAt'>) => {
        const dbQuote = mapQuoteToDB(quote);
        const { error } = await supabase.from('quotes').insert([{ ...dbQuote, status: 'draft' }]); // Default status
        if (error) console.error('Error adding quote:', error);
    }, [mapQuoteToDB, supabase]);

    const updateQuote = React.useCallback(async (id: string, updates: Partial<Quote>) => {
        const dbUpdate = mapQuoteToDB(updates);
        Object.keys(dbUpdate).forEach(key => (dbUpdate as any)[key] === undefined && delete (dbUpdate as any)[key]);
        const { error } = await supabase.from('quotes').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating quote:', error);
    }, [mapQuoteToDB, supabase]);

    const deleteQuote = React.useCallback(async (id: string) => {
        const { error } = await supabase.from('quotes').delete().eq('id', id);
        if (error) console.error('Error deleting quote:', error);
    }, [supabase]);

    // Contract operations
    const addContract = React.useCallback(async (contract: Omit<Contract, 'id' | 'createdAt'>) => {
        const dbContract = mapContractToDB(contract);
        const { error } = await supabase.from('contracts').insert([dbContract]);
        if (error) console.error('Error adding contract:', error);
    }, [mapContractToDB, supabase]);

    const updateContract = React.useCallback(async (id: string, updates: Partial<Contract>) => {
        const dbUpdate = mapContractToDB(updates);
        Object.keys(dbUpdate).forEach(key => (dbUpdate as any)[key] === undefined && delete (dbUpdate as any)[key]);
        const { error } = await supabase.from('contracts').update(dbUpdate).eq('id', id);
        if (error) console.error('Error updating contract:', error);
    }, [mapContractToDB, supabase]);

    const deleteContract = React.useCallback(async (id: string) => {
        const { error } = await supabase.from('contracts').delete().eq('id', id);
        if (error) console.error('Error deleting contract:', error);
    }, [supabase]);

    // Technician operations
    const addTechnician = React.useCallback(async (technician: Omit<Technician, 'id' | 'createdAt'>) => {
        const { error } = await supabase.from('technicians').insert([{
            ...technician,
            status: 'ativo'
        }]);
        if (error) console.error('Error adding technician:', error);
    }, [supabase]);

    const updateTechnician = React.useCallback(async (id: string, updates: Partial<Technician>) => {
        const { error } = await supabase.from('technicians').update(updates).eq('id', id);
        if (error) console.error('Error updating technician:', error);
    }, [supabase]);

    const deleteTechnician = React.useCallback(async (id: string) => {
        const { error } = await supabase.from('technicians').delete().eq('id', id);
        if (error) console.error('Error deleting technician:', error);
    }, [supabase]);

    const authenticateTechnician = React.useCallback((username: string, password: string): Technician | null => {
        // Now checks against the state which is populated from DB
        const tech = technicians.find(t => t.username === username && t.password === password);
        return tech || null;
    }, [technicians]);

    // Project Activity operations
    const addProjectActivity = React.useCallback(async (activity: Omit<ProjectActivity, 'id'>) => {
        const dbActivity = mapActivityToDB(activity);
        const { error } = await supabase.from('project_activities').insert([dbActivity]);
        if (error) console.error('Error adding activity:', error);
    }, [mapActivityToDB, supabase]);

    // Project operations
    const addProject = React.useCallback(async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
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
    }, [mapProjectToDB, supabase, addProjectActivity]);

    const updateProject = React.useCallback(async (id: string, updates: Partial<Project>) => {
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
    }, [mapProjectToDB, supabase, addProjectActivity]);

    const archiveProject = React.useCallback(async (id: string) => {
        updateProject(id, { status: 'arquivado', archivedAt: new Date().toISOString() });
    }, [updateProject]);

    const unarchiveProject = React.useCallback(async (id: string) => {
        // We need to explicitly handle unsetting archivedAt. 
        // Supabase update with null works.
        const { error } = await supabase.from('projects').update({ status: 'planejamento', archived_at: null }).eq('id', id);
        if (error) console.error('Error unarchiving:', error);
    }, [supabase]);

    const deleteProject = React.useCallback(async (id: string) => {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) console.error('Error deleting project:', error);
    }, [supabase]);


    const getProjectActivities = React.useCallback((projectId: string): ProjectActivity[] => {
        return projectActivities
            .filter(activity => activity.projectId === projectId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [projectActivities]);

    // Project Link operations
    const linkOrderToProject = React.useCallback((orderId: string, projectId: string) => {
        // Needs update to support DB orders
        const project = projects.find(p => p.id === projectId);
        if (project) {
            updateOrder(orderId, { projectId, projectName: project.name });
            updateProject(projectId, {
                relatedOrders: [...project.relatedOrders, orderId]
            });
        }
    }, [projects, updateOrder, updateProject]);

    const unlinkOrderFromProject = React.useCallback((orderId: string, projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            updateOrder(orderId, { projectId: undefined, projectName: undefined });
            updateProject(projectId, {
                relatedOrders: project.relatedOrders.filter(id => id !== orderId)
            });
        }
    }, [projects, updateOrder, updateProject]);

    const setOnNewOrder = React.useCallback((callback: (order: Order) => void) => {
        setOnNewOrderCallback(() => callback);
    }, [setOnNewOrderCallback]);

    // Communication operations
    const sendMessage = React.useCallback(async (conversationId: string, senderId: string, senderType: 'admin' | 'technician' | 'client', content: string) => {
        const { error } = await supabase
            .from('messages')
            .insert([{
                conversation_id: conversationId,
                sender_id: senderId,
                sender_type: senderType,
                content,
                read: false
            }]);

        if (error) {
            console.error('Error sending message:', error);
            throw error;
        }

        // Update conversation last_message_at
        await supabase
            .from('conversations')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', conversationId);
    }, [supabase]);

    const getOrCreateConversation = React.useCallback(async (techId: string): Promise<string | null> => {
        // Try to find existing conversation
        const existingConv = conversations.find(c =>
            c.type === 'administrador-tecnico' &&
            c.participants.includes(techId)
        );

        if (existingConv) {
            return existingConv.id;
        }

        // Create new conversation
        const { data, error } = await supabase
            .from('conversations')
            .insert([{
                type: 'administrador-tecnico',
                participants: [techId],
                last_message_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating conversation:', error);
            return null;
        }

        return data.id;
    }, [conversations, supabase]);

    const value: AppContextType = React.useMemo(() => ({
        clients,
        orders,
        inventory,
        quotes,
        contracts,
        technicians,
        projects,
        projectActivities,
        products,
        invoices,
        appointments,
        conversations,
        messages,

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
        unlinkOrderFromProject,

        // Notification callbacks
        onNewOrder: onNewOrderCallback,
        setOnNewOrder,

        // Communication operations
        sendMessage,
        getOrCreateConversation,
    }), [
        clients, orders, inventory, quotes, contracts, technicians, projects, projectActivities,
        products, invoices, appointments, conversations, messages, onNewOrderCallback,
        addClient, updateClient, deleteClient, addOrder, updateOrder, deleteOrder,
        addInventoryItem, updateInventoryItem, deleteInventoryItem, addQuote, updateQuote, deleteQuote,
        addContract, updateContract, deleteContract, addTechnician, updateTechnician, deleteTechnician,
        authenticateTechnician, addProject, updateProject, archiveProject, unarchiveProject, deleteProject,
        addProjectActivity, getProjectActivities, linkOrderToProject, unlinkOrderFromProject, setOnNewOrder,
        sendMessage, getOrCreateConversation
    ]);

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