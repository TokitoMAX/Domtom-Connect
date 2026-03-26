-- SQL Script to add Premium Metadata to Domtom Connect Marketplace
-- Run this in the Supabase SQL Editor

-- 1. Updates for public.profiles (Experts & Entreprises)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS zone TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS forme_juridique TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.zone IS 'Zone géographique précise (ex: Nord, Sud, Basse-Terre).';
COMMENT ON COLUMN public.profiles.linkedin_url IS 'URL du profil LinkedIn.';
COMMENT ON COLUMN public.profiles.forme_juridique IS 'Forme juridique pour les entreprises (SAS, SARL, etc.).';

-- 2. Updates for public.projects
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS zone TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.projects.zone IS 'Zone géographique du projet.';
COMMENT ON COLUMN public.projects.is_featured IS 'Si le projet doit être mis en avant sur la marketplace.';
