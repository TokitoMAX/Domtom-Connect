-- ============================================================
-- add_analytics_columns.sql – Domtom Connect
-- Pivot SaaS: Profile Visibility Tracking
-- ============================================================

-- 1. Ajout de la colonne views_count à la table profiles
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS views_count BIGINT DEFAULT 0;

-- 2. Index pour performance sur les analytics
CREATE INDEX IF NOT EXISTS idx_profile_views 
ON public.profiles (views_count DESC);

-- 3. Fonction RPC pour incrémenter les vues (plus propre que Update direct dans le client)
CREATE OR REPLACE FUNCTION increment_profile_views(target_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET views_count = views_count + 1
    WHERE id = target_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
