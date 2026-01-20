-- Create Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('administrador-tecnico', 'administrador-cliente', 'tecnico-cliente')),
  participants UUID[] NOT NULL DEFAULT '{}',
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations - allow all for now (adjust for production)
CREATE POLICY IF NOT EXISTS "Allow all operations on conversations" ON conversations
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for messages - allow all for now (adjust for production)
CREATE POLICY IF NOT EXISTS "Allow all operations on messages" ON messages
  FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Auto-delete old messages (older than 90 days) - Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM messages WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- You can call this function periodically via a cron job or scheduled function
-- Example: SELECT cron.schedule('cleanup-old-messages', '0 3 * * *', 'SELECT cleanup_old_messages()');
