-- Add fantasy_name column to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS fantasy_name TEXT;

COMMENT ON COLUMN clients.fantasy_name IS 'Trade name / Fantasy name (Nome Fantasia) of the company';
