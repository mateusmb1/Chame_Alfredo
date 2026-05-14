// Product/Service Type
export interface ProductService {
    id: string;
    name: string;
    description?: string;
    category: 'servico' | 'produto' | 'pacote';
    price: number;
    unit?: string; // hora, unidade, m², etc
    active: boolean;
    createdAt: string;
    updatedAt: string;
}
