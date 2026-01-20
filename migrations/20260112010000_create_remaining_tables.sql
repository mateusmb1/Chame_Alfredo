-- Create Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  supplier TEXT,
  last_restock_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Using UUID internally, but mapping to ORC-XXX in app if needed, or better, keep UUID
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'expired')),
  validity_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  billing_frequency TEXT NOT NULL CHECK (billing_frequency IN ('mensal', 'trimestral', 'semestral', 'anual')),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'suspenso', 'cancelado', 'expirado')),
  services TEXT[] DEFAULT '{}',
  contract_type TEXT CHECK (contract_type IN ('manutencao', 'instalacao', 'consultoria', 'suporte', 'outro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('instalacao', 'manutencao', 'consultoria', 'suporte', 'inspecao', 'treinamento', 'outro')),
  status TEXT NOT NULL DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'em_andamento', 'em_pausa', 'pendente', 'concluido', 'cancelado', 'arquivado')),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10, 2) DEFAULT 0,
  progress INTEGER DEFAULT 0,
  responsible_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  team JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- Create Project Activities Table
CREATE TABLE IF NOT EXISTS project_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Enable RLS (and allow public access for development speed as requested before)
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON inventory FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON inventory FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON inventory FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON quotes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON quotes FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON quotes FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON contracts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON contracts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON contracts FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON projects FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON projects FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON project_activities FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON project_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON project_activities FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON project_activities FOR DELETE USING (true);

-- Create Company Settings Table
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  cnpj TEXT,
  email TEXT,
  phone TEXT,
  logo_url TEXT,
  cep TEXT,
  street TEXT,
  number TEXT,
  complement TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON company_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON company_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON company_settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON company_settings FOR DELETE USING (true);
