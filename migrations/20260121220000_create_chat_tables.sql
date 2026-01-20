-- Create Conversations Table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'conversations') THEN
        CREATE TABLE conversations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type TEXT NOT NULL CHECK (type IN ('administrador-tecnico', 'administrador-cliente', 'tecnico-cliente')),
            participants UUID[] NOT NULL DEFAULT '{}',
            last_message_at TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Create Messages Table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'messages') THEN
        CREATE TABLE messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
            sender_id UUID NOT NULL,
            sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'technician', 'client')),
            content TEXT,
            attachment_url TEXT,
            attachment_type TEXT CHECK (attachment_type IN ('image', 'file') OR attachment_type IS NULL),
            read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations - allow all for now (adjust for production)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Allow all operations on conversations') THEN
        CREATE POLICY "Allow all operations on conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- RLS Policies for messages - allow all for now (adjust for production)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Allow all operations on messages') THEN
        CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Enable Realtime
-- This part is tricky because ALTER PUBLICATION doesn't support IF NOT EXISTS for tables.
-- We check if the table is already in the publication.
DO $$
DECLARE
    pub_exists BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') INTO pub_exists;
    IF pub_exists THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversations'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE messages;
        END IF;
    END IF;
END $$;

-- Auto-delete old messages (older than 90 days) - Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM messages WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
