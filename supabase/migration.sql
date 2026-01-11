-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Technicians Table
create table if not exists public.technicians (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  username text unique not null,
  password text not null, -- Storing as text to match current mock implementation
  specialization text[] default '{}',
  status text check (status in ('ativo', 'inativo')) default 'ativo',
  current_projects text[] default '{}',
  allocated_hours_this_month numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Clients Table
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  address text,
  cpf_cnpj text,
  type text check (type in ('pf', 'pj')) default 'pf',
  status text check (status in ('active', 'inactive')) default 'active',
  service_history text[] default '{}',
  contracts text[] default '{}',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Orders Table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id),
  client_name text not null, -- Denormalized for easier display
  service_type text not null,
  description text,
  status text check (status in ('nova', 'em_andamento', 'pendente', 'finalizada', 'cancelada', 'concluida')) default 'nova',
  priority text check (priority in ('baixa', 'media', 'alta', 'urgente')) default 'baixa',
  scheduled_date timestamp with time zone,
  completed_date timestamp with time zone,
  technician_id uuid references public.technicians(id),
  technician_name text, -- Denormalized
  value numeric default 0,
  observations text,
  project_id text,
  project_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies (Open for now to match current behavior, restrict later)
alter table public.technicians enable row level security;
alter table public.clients enable row level security;
alter table public.orders enable row level security;

create policy "Enable all access for all users" on public.technicians for all using (true) with check (true);
create policy "Enable all access for all users" on public.clients for all using (true) with check (true);
create policy "Enable all access for all users" on public.orders for all using (true) with check (true);

-- Functions
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_order_updated
  before update on public.orders
  for each row execute procedure public.handle_updated_at();
