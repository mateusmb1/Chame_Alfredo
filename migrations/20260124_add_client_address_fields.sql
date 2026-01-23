-- Add structured address columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS number TEXT,
ADD COLUMN IF NOT EXISTS complement TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT;

COMMENT ON COLUMN clients.street IS 'Street name or address line 1';
COMMENT ON COLUMN clients.number IS 'Building number';
COMMENT ON COLUMN clients.complement IS 'Apartment, suite, unit, etc.';
COMMENT ON COLUMN clients.neighborhood IS 'Neighborhood or district';
COMMENT ON COLUMN clients.city IS 'City name';
COMMENT ON COLUMN clients.state IS 'State/Province code (e.g. SP, RJ)';
COMMENT ON COLUMN clients.zip_code IS 'Postal code (CEP)';
