-- Create table for extra items/services
CREATE TABLE IF NOT EXISTS order_extra_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies
ALTER TABLE order_extra_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view extra items for their orders" 
ON order_extra_items FOR SELECT 
USING (
  auth.uid() IN (
    SELECT technician_id FROM orders WHERE id = order_extra_items.order_id
    UNION
    SELECT client_id FROM orders WHERE id = order_extra_items.order_id
  )
);

CREATE POLICY "Technicians can insert extra items" 
ON order_extra_items FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT technician_id FROM orders WHERE id = order_extra_items.order_id
  )
);

CREATE POLICY "Technicians and Clients can update extra items" 
ON order_extra_items FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT technician_id FROM orders WHERE id = order_extra_items.order_id
    UNION
    SELECT client_id FROM orders WHERE id = order_extra_items.order_id
  )
);
