-- Ajout de la colonne agenda à la table events pour la billetterie
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS agenda jsonb DEFAULT '[]'::jsonb;
