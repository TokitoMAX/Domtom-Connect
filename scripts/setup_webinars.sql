-- SQL Migration for Webinar Module
-- Run this in your Supabase SQL Editor

-- 1. Create Webinars Table
CREATE TABLE IF NOT EXISTS webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    meeting_link TEXT NOT NULL,
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT true
);

-- 2. Create Webinar Messages Table (for Chat)
CREATE TABLE IF NOT EXISTS webinar_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);

-- 3. Enable RLS
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Webinars
DROP POLICY IF EXISTS "Anyone can view published webinars" ON webinars;
CREATE POLICY "Anyone can view published webinars" ON webinars 
FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins and hosts can manage webinars" ON webinars;
CREATE POLICY "Admins and hosts can manage webinars" ON webinars 
FOR ALL USING (
    auth.uid() = host_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. RLS Policies for Webinar Messages
DROP POLICY IF EXISTS "Anyone can view messages for a webinar" ON webinar_messages;
CREATE POLICY "Anyone can view messages for a webinar" ON webinar_messages 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can post messages" ON webinar_messages;
CREATE POLICY "Authenticated users can post messages" ON webinar_messages 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
