-- SCRIPT : Ajout du Portfolio pour les Experts
-- À exécuter dans l'éditeur SQL de Supabase

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS portfolio JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.profiles.portfolio IS 'Liste des réalisations (portfolio) pour les experts [{title, url, description, type}].';
