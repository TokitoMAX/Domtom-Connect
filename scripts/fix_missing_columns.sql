-- SCRIPT DE FIX : Colonnes Manquantes (SIRET & Persistance)
-- À exécuter dans l'éditeur SQL de Supabase

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS siret TEXT,
ADD COLUMN IF NOT EXISTS forme_juridique TEXT,
ADD COLUMN IF NOT EXISTS role TEXT;

-- Indexation pour la recherche
CREATE INDEX IF NOT EXISTS profiles_siret_idx ON public.profiles(siret);

COMMENT ON COLUMN public.profiles.siret IS 'Numéro SIRET pour vérification professionnelle.';
COMMENT ON COLUMN public.profiles.forme_juridique IS 'Statut juridique (SAS, SARL, Auto-entrepreneur, etc.)';
