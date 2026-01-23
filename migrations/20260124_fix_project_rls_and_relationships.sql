-- Fix RLS for Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all authenticated users" ON "public"."projects"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for all authenticated users" ON "public"."projects"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for all authenticated users" ON "public"."projects"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete access for all authenticated users" ON "public"."projects"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);

-- Add relationship columns
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Create order_extra_items table for Phase 4
CREATE TABLE IF NOT EXISTS order_extra_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit_price NUMERIC DEFAULT 0,
  total_price NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for extra items
ALTER TABLE order_extra_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for extra items" ON "public"."order_extra_items"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
