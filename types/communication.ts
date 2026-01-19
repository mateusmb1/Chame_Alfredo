// Communication Types
export interface Conversation {
    id: string;
    type: 'administrador-tecnico' | 'administrador-cliente' | 'grupo';
    participants: string[]; // IDs dos participantes
    lastMessageAt?: string;
    createdAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderType: 'admin' | 'technician' | 'client';
    content: string;
    read: boolean;
    createdAt: string;
}
