-- SCRIPT DE MIGRATION SQL : Ajout de la colonne availability à la table profiles
-- À exécuter dans la console Supabase (SQL Editor)

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'available';
COMMENT ON COLUMN public.profiles.availability IS 'Statut de disponibilité de l''expert (available, busy, off)';
