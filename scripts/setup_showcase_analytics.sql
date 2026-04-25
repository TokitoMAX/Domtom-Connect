-- Ajout du tracking des vues pour l'analytics de conversion
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS showcase_views INTEGER DEFAULT 0;
ALTER TABLE showcase_items ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Commentaire pour l'historique
COMMENT ON COLUMN profiles.showcase_views IS 'Nombre total de vues sur la vitrine digitale';
COMMENT ON COLUMN showcase_items.views IS 'Nombre de vues spécifiques à cet article';
