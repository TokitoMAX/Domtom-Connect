-- SQL Script : Mise à jour de la BDD pour DTC Social 2.0

-- 0. Colonnes Social 2.0 sur showcase_items
ALTER TABLE public.showcase_items
ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'status',
ADD COLUMN IF NOT EXISTS meta_info TEXT;

-- 1. Table pour stocker les options des sondages
CREATE TABLE IF NOT EXISTS public.feed_polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.showcase_items(id) ON DELETE CASCADE NOT NULL,
    question TEXT,
    options JSONB NOT NULL, -- Format: [{"id": 0, "text": "Oui"}, {"id": 1, "text": "Non"}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feed_polls ADD COLUMN IF NOT EXISTS question TEXT;

-- 2. Table pour stocker les votes des utilisateurs sur les sondages
CREATE TABLE IF NOT EXISTS public.feed_poll_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.feed_polls(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    option_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(poll_id, user_id) -- Un utilisateur ne peut voter qu'une fois par sondage
);

-- Sécurité RLS pour les sondages
ALTER TABLE public.feed_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les sondages" ON public.feed_polls FOR SELECT USING (true);
CREATE POLICY "Les utilisateurs peuvent créer des sondages" ON public.feed_polls FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Tout le monde peut lire les votes" ON public.feed_poll_votes FOR SELECT USING (true);
CREATE POLICY "Les utilisateurs peuvent voter" ON public.feed_poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Les utilisateurs peuvent modifier leur vote" ON public.feed_poll_votes FOR UPDATE USING (auth.uid() = user_id);

-- 3. Ajout du parent_id pour les commentaires imbriqués (Threads)
ALTER TABLE public.feed_comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.feed_comments(id) ON DELETE CASCADE;

-- 4. Ajout des colonnes pour la chaîne (Profil)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pinned_post_id TEXT,
ADD COLUMN IF NOT EXISTS about_text TEXT;

-- 5. Ajout de la colonne pour les Stories "À la une"
ALTER TABLE public.showcase_items 
ADD COLUMN IF NOT EXISTS is_highlight BOOLEAN DEFAULT false;

-- 6. Réactions enrichies sur les likes (🔥 💡 👏 ❤️)
ALTER TABLE public.feed_likes
ADD COLUMN IF NOT EXISTS reaction_type TEXT DEFAULT 'heart';

DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur reaction" ON public.feed_likes;
CREATE POLICY "Les utilisateurs peuvent modifier leur reaction"
ON public.feed_likes FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
