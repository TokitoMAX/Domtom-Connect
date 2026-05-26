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
    is_published BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'live', 'finished'
    replay_url TEXT
);

-- 2. Create Webinar Messages Table (for Chat)
CREATE TABLE IF NOT EXISTS webinar_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);

-- 3. Create Q&A Table
CREATE TABLE IF NOT EXISTS webinar_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    is_answered BOOLEAN DEFAULT false,
    is_highlighted BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0
);

-- 4. Create Polls Table
CREATE TABLE IF NOT EXISTS webinar_polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 5. Create Poll Options Table
CREATE TABLE IF NOT EXISTS webinar_poll_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES webinar_polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    votes_count INTEGER DEFAULT 0
);

-- 6. Create Attendee Tracking Table
CREATE TABLE IF NOT EXISTS webinar_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT now(),
    attended_at TIMESTAMPTZ,
    UNIQUE(webinar_id, user_id)
);

-- 7. Enable RLS
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_attendees ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- (Simplified for brevity, allow viewing to all, management to admins/hosts)
CREATE POLICY "Anyone can view webinar content" ON webinars FOR SELECT USING (true);
CREATE POLICY "Anyone can view questions" ON webinar_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view polls" ON webinar_polls FOR SELECT USING (true);
CREATE POLICY "Anyone can view poll options" ON webinar_poll_options FOR SELECT USING (true);
CREATE POLICY "Anyone can view messages" ON webinar_messages FOR SELECT USING (true);

CREATE POLICY "Users can interact with webinars" ON webinar_attendees FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can ask questions" ON webinar_questions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can post messages" ON webinar_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 9. Create Poll Votes Table (Prevent double voting)
CREATE TABLE IF NOT EXISTS webinar_poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES webinar_polls(id) ON DELETE CASCADE,
    option_id UUID REFERENCES webinar_poll_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(poll_id, user_id)
);

-- 10. Create CTA Table (Featured Offers)
CREATE TABLE IF NOT EXISTS webinar_ctas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    button_text TEXT NOT NULL,
    link_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false
);

ALTER TABLE webinar_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_ctas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view CTA" ON webinar_ctas FOR SELECT USING (true);
CREATE POLICY "Anyone can view poll votes" ON webinar_poll_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote once" ON webinar_poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11. Create Resources Table
CREATE TABLE IF NOT EXISTS webinar_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    file_url TEXT,
    link_url TEXT,
    type TEXT DEFAULT 'link' -- 'file' or 'link'
);

ALTER TABLE webinar_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view resources" ON webinar_resources FOR SELECT USING (true);
