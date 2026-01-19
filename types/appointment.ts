// Appointment Type
export interface Appointment {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    type: 'ordem' | 'reuniao' | 'visita' | 'outro';
    orderId?: string;
    clientId?: string;
    technicianId?: string;
    status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
    location?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
