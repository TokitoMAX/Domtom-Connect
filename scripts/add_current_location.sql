-- SCRIPT DE MIGRATION : Ajout de la localisation actuelle
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor)

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_location TEXT;

COMMENT ON COLUMN public.profiles.current_location IS 'Lieu de résidence actuel de l''utilisateur (ex: Paris, Lyon, Montréal...) utilisé pour la double expertise.';
