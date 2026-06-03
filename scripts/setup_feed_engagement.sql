-- ============================================================
-- setup_feed_engagement.sql – Domtom Connect
-- Tables pour les Likes et Commentaires du Flux Territorial
-- ============================================================

-- 1. Table pour les Likes
CREATE TABLE IF NOT EXISTS public.feed_likes (
    post_id UUID REFERENCES public.showcase_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- RLS pour les Likes
ALTER TABLE public.feed_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les likes sont visibles par tous" ON public.feed_likes;
DROP POLICY IF EXISTS "Les utilisateurs connectés peuvent liker" ON public.feed_likes;
DROP POLICY IF EXISTS "Les utilisateurs connectés peuvent enlever leur like" ON public.feed_likes;

CREATE POLICY "Les likes sont visibles par tous" 
ON public.feed_likes FOR SELECT TO public 
USING (true);

CREATE POLICY "Les utilisateurs connectés peuvent liker" 
ON public.feed_likes FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs connectés peuvent enlever leur like" 
ON public.feed_likes FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- 2. Table pour les Commentaires
CREATE TABLE IF NOT EXISTS public.feed_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.showcase_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS pour les Commentaires
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les commentaires sont visibles par tous" ON public.feed_comments;
DROP POLICY IF EXISTS "Les utilisateurs connectés peuvent commenter" ON public.feed_comments;
DROP POLICY IF EXISTS "Les auteurs peuvent supprimer leurs commentaires" ON public.feed_comments;

CREATE POLICY "Les commentaires sont visibles par tous" 
ON public.feed_comments FOR SELECT TO public 
USING (true);

CREATE POLICY "Les utilisateurs connectés peuvent commenter" 
ON public.feed_comments FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les auteurs peuvent supprimer leurs commentaires" 
ON public.feed_comments FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_feed_likes_post ON public.feed_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_comments_post ON public.feed_comments(post_id);
