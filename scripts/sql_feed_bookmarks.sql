-- Création de la table pour les signets (bookmarks) du feed DTC
CREATE TABLE IF NOT EXISTS public.feed_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    post_id TEXT NOT NULL, -- ID du post (showcase_item ou project)
    post_type TEXT DEFAULT 'status', -- 'status', 'project'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, post_id)
);

ALTER TABLE public.feed_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
    ON public.feed_bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add bookmarks"
    ON public.feed_bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own bookmarks"
    ON public.feed_bookmarks FOR DELETE
    USING (auth.uid() = user_id);
