-- Add approval fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending_check', -- pending_check, approved, rejected
ADD COLUMN IF NOT EXISTS approval_signature TEXT,
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN orders.approval_status IS 'Status of client approval for extra items/service completion';
COMMENT ON COLUMN orders.approval_signature IS 'Base64 signature of the client approving the changes';
