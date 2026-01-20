-- Add attachments column to quotes table
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Add payment_terms column to quotes table as it was in the design but not in the interface
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS payment_terms TEXT;

-- Add discount column to quotes table
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
