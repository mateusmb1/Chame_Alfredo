-- Migration: System Flow Improvements (Leads, Order Items, Enums)
-- Date: 2026-01-24
-- Description: Creates specific table for Leads (separating from Orders), 
--              standardizes relational Order Items (linked to Inventory),
--              and updates Enums for the new flow states.

-- Ensure UUID extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure helper function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. ENUMS Updates
-- ==============================================================================

-- Create Lead Status Enum
DO $$ BEGIN
    CREATE TYPE lead_status_enum AS ENUM ('novo', 'qualificado', 'perdido', 'convertido');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update Order Status Enum (Add 'faturada')
DO $$ BEGIN
    ALTER TYPE order_status_enum ADD VALUE 'faturada';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Quote Status Enum (if not exists)
DO $$ BEGIN
    CREATE TYPE quote_status_enum AS ENUM ('draft', 'sent', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. LEADS Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, -- Name of the contact/potential client
    phone VARCHAR(50),
    email VARCHAR(255),
    
    -- Metadata
    origin VARCHAR(50) DEFAULT 'manual', -- whatsapp, landing_page, referral, etc.
    status lead_status_enum DEFAULT 'novo',
    priority VARCHAR(20) DEFAULT 'media', -- baixa, media, alta
    
    -- Context
    description TEXT, -- Main requirement
    service_interest VARCHAR(100), -- Type of service interested in
    expected_value DECIMAL(10,2),
    
    -- Relations
    client_id UUID REFERENCES clients(id), -- Linked only if converted or existing client
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS for Leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leads All Access Staff" ON leads;
CREATE POLICY "Leads All Access Staff" ON leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Leads Insert Public" ON leads;
CREATE POLICY "Leads Insert Public" ON leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Triggers for Leads
DROP TRIGGER IF EXISTS trg_update_leads_timestamp ON leads;
CREATE TRIGGER trg_update_leads_timestamp
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();


-- 3. ORDER ITEMS Table (Relational Inventory Link)
-- ==============================================================================
-- Allows proper inventory tracking instead of JSON blobs
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Link to inventory (optional, allows ad-hoc items)
    inventory_item_id UUID REFERENCES inventory(id),
    
    -- Snapshot data (in case inventory changes)
    description VARCHAR(255) NOT NULL, -- Item name or service desc
    sku VARCHAR(50),
    
    -- Financials
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount NUMERIC(10,2) DEFAULT 0,
    
    -- Computed (Postgres 12+) or Manual
    total_price NUMERIC(10,2) GENERATED ALWAYS AS ((quantity * unit_price) - discount) STORED,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- RLS for Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Order Items Access Staff" ON order_items;
CREATE POLICY "Order Items Access Staff" ON order_items
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_client ON leads(client_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
