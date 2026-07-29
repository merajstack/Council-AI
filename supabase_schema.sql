-- ========================================================
-- COUNCIL AI SUPABASE DATABASE SCHEMA
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================
-- TABLE 1: USERS (Stores Google Auth & User Profiles)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,                       -- Google ID (sub) or Council User ID
    email TEXT UNIQUE NOT NULL,                -- User's email address
    name TEXT NOT NULL,                        -- User's display name
    picture TEXT,                              -- Profile avatar URL
    verified_email BOOLEAN DEFAULT TRUE,      -- Google email verification status
    created_at TIMESTAMPTZ DEFAULT NOW(),      -- Account creation timestamp
    last_login_at TIMESTAMPTZ DEFAULT NOW()   -- Last active login timestamp
);

-- ========================================================
-- TABLE 2: CONVERSATIONS (Stores Whiteboard Sessions & Prompts)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Unique conversation / video ID
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE, -- Linked user
    title TEXT NOT NULL,                           -- Whiteboard title
    prompt TEXT NOT NULL,                          -- Original user prompt
    category TEXT DEFAULT 'General',              -- Finance, Science, Operations, AI & Tech, etc.
    aspect_ratio TEXT DEFAULT '16:9',             -- 16:9, 9:16, 1:1
    status TEXT DEFAULT 'ready',                  -- 'ready', 'generating', 'failed'
    total_duration_seconds INT DEFAULT 30,       -- Video duration
    
    -- JSONB columns for flexible AI multi-agent schema storage
    multi_agent_data JSONB,                        -- Summary, strategic risks, proof points, actions
    scenes JSONB,                                  -- Detailed array of 3 scenes & SVG elements
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- TABLE 3: CHAT_MESSAGES (Stores Detailed Agent Logs & Chat)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    role TEXT CHECK (role IN ('user', 'assistant', 'system', 'agent')) NOT NULL,
    content TEXT NOT NULL,                          -- Message text / prompt / answer
    agent_name TEXT,                                -- e.g. 'Scriptwriter', 'Decision Analyst'
    agent_insights JSONB,                           -- Specific telemetry / proof points
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public access for quick API reads & writes
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update users" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public read conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update conversations" ON public.conversations FOR ALL USING (true);

CREATE POLICY "Allow public read chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_messages" ON public.chat_messages FOR ALL USING (true);

-- ========================================================
-- AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER
-- ========================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conversations_timestamp ON public.conversations;
CREATE TRIGGER update_conversations_timestamp
BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
