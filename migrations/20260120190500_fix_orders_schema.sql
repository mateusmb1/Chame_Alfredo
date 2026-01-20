-- Migration: Fix Orders Schema for Mobile App
-- Date: 2026-01-20
-- Description: Adds missing columns required for mobile app functionality that were preventing data sync.

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS service_photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS service_notes TEXT,
ADD COLUMN IF NOT EXISTS customer_signature TEXT,
ADD COLUMN IF NOT EXISTS check_in JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS check_out JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS completed_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invoiced BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS invoice_id UUID;

-- Optional: Add index for technician queries if not exists
CREATE INDEX IF NOT EXISTS idx_orders_technician_id ON orders(technician_id);
