-- setup_social_features.sql
-- Run this in your Supabase SQL Editor to enable subscriptions

-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (follower_id, following_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Public profiles can see subscriptions" 
    ON public.user_subscriptions FOR SELECT 
    USING (true);

CREATE POLICY "Users can subscribe as themselves" 
    ON public.user_subscriptions FOR INSERT 
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unsubscribe as themselves" 
    ON public.user_subscriptions FOR DELETE 
    USING (auth.uid() = follower_id);

-- 4. Enable realtime for live follower counts (optional)
alter publication supabase_realtime add table user_subscriptions;
