-- 🛡️ Migration Integrity Fix Script
-- Run this script in the Supabase SQL Editor to ensure your database supports all recent features.
-- This script is IDEMPOTENT (safe to run multiple times).

-- 1. Orders Table Updates
DO $$
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'status') THEN
        ALTER TABLE orders ADD COLUMN status text NOT NULL DEFAULT 'nova';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'scheduled_date') THEN
        ALTER TABLE orders ADD COLUMN scheduled_date timestamp with time zone;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'completed_date') THEN
        ALTER TABLE orders ADD COLUMN completed_date timestamp with time zone;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'check_in') THEN
        ALTER TABLE orders ADD COLUMN check_in timestamp with time zone;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'check_out') THEN
        ALTER TABLE orders ADD COLUMN check_out timestamp with time zone;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'service_photos') THEN
        ALTER TABLE orders ADD COLUMN service_photos text[] DEFAULT ARRAY[]::text[];
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'approval_status') THEN
        ALTER TABLE orders ADD COLUMN approval_status text DEFAULT 'pending';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'approval_signature') THEN
        ALTER TABLE orders ADD COLUMN approval_signature text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'approval_date') THEN
        ALTER TABLE orders ADD COLUMN approval_date timestamp with time zone;
    END IF;
    
    -- Ensure quote_id exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'quote_id') THEN
        ALTER TABLE orders ADD COLUMN quote_id uuid REFERENCES quotes(id);
    END IF;
END $$;

-- 2. Quotes Table Updates
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'source_order_id') THEN
        ALTER TABLE quotes ADD COLUMN source_order_id uuid REFERENCES orders(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'invoice_id') THEN
        ALTER TABLE quotes ADD COLUMN invoice_id uuid REFERENCES invoices(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'status') THEN
        ALTER TABLE quotes ADD COLUMN status text DEFAULT 'draft';
    END IF;
END $$;

-- 3. Appointments Table Updates
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'order_id') THEN
        ALTER TABLE appointments ADD COLUMN order_id uuid REFERENCES orders(id);
    END IF;
END $$;

-- 4. Enable Realtime for key tables (if not already enabled)
DO $$
BEGIN
  -- This creates the publication if it doesn't exist, effectively harmless if it does or throws a manageable error in some setups, 
  -- but generally 'supabase_realtime' exists. We add tables to it.
  -- Note: This part might fail if you are not a superuser, but it's good to try.
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not add tables to realtime publication (might already exist or permission denied).';
END $$;
