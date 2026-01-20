-- Enable RLS on orders if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for orders if it doesn't exist
-- This allows SELECT, INSERT, UPDATE, DELETE for anyone (anon or authenticated)
-- Note: In a production app with real auth, this should be restricted.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Enable all access for all users'
    ) THEN
        CREATE POLICY "Enable all access for all users" ON orders FOR ALL USING (true) WITH CHECK (true);
    END IF;
END
$$;
