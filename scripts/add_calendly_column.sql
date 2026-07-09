-- ============================================================
-- DOMTOM CONNECT - ADD CALENDLY URL TO PROFILES
-- Permet aux utilisateurs d'ajouter leur propre lien de RDV
-- ============================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS calendly_url TEXT;

COMMENT ON COLUMN public.profiles.calendly_url IS 'Lien de réservation Calendly personnalisé de l''utilisateur';
