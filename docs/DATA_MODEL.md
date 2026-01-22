# 💾 Modelo de Dados

Estrutura do banco de dados PostgreSQL gerenciado pelo Supabase.

## Diagrama de Entidade-Relacionamento

```mermaid
erDiagram
    CLIENTS ||--o{ ORDERS : "solicita"
    TECHNICIANS ||--o{ ORDERS : "executa"
    TECHNICIANS ||--o{ APPOINTMENTS : "agendado em"
    ORDERS ||--o{ ORDER_ITEMS : "contém"
    INVENTORY ||--o{ ORDER_ITEMS : "usado em"
    
    CLIENTS {
        uuid id PK
        string name
        string type "pf | pj"
        string document "cpf | cnpj"
        string address
        string phone
    }

    TECHNICIANS {
        uuid id PK
        string name
        string email
        string status "online | offline"
    }

    INVENTORY {
        uuid id PK
        string name
        string sku
        int quantity
        int min_quantity
        decimal price
        string location
    }

    ORDERS {
        uuid id PK
        uuid client_id FK
        uuid technician_id FK
        string status "nova | pendente | em_andamento | concluida"
        string priority
        decimal total_value
        timestamp scheduled_date
    }

    APPOINTMENTS {
        uuid id PK
        uuid resource_id FK
        timestamp start_time
        timestamp end_time
        string title
        string type
    }
```

---

## Dicionário de Tabelas

### 1. `orders` (Ordens de Serviço)
Tabela central do sistema. Armazena o ciclo de vida do serviço.
*   **status**: Controla o fluxo de trabalho (Kanban).
*   **priority**: Define a urgência visual no dashboard.

### 2. `inventory` (Ativos)
Catálogo de peças e equipamentos.
*   **min_quantity**: Gatilho para alertas de "Estoque Baixo".
*   **sku**: Código único de identificação para busca rápida.

### 3. `appointments` (Agenda)
Nova tabela para suporte ao módulo "Command Center".
*   Permite alocação de tempo sem necessariamente criar uma OS completa.
*   Sincronizada com a visualização de calendário.

### 4. `technicians` & `clients`
Cadastros de pessoas. No futuro, `technicians` será vinculado à tabela `auth.users` do Supabase para gestão de login seguro.
