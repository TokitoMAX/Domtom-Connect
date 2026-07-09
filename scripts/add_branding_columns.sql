-- SCRIPT : Excellence Branding (Couverture & Chiffres Clés)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS creation_year TEXT,
ADD COLUMN IF NOT EXISTS team_size TEXT,
ADD COLUMN IF NOT EXISTS founding_expert_id UUID REFERENCES auth.users(id);

COMMENT ON COLUMN public.profiles.banner_url IS 'URL de l''image de couverture de l''entreprise.';
COMMENT ON COLUMN public.profiles.creation_year IS 'Année de création / fondation.';
COMMENT ON COLUMN public.profiles.team_size IS 'Taille de l''équipe (ex: 1-10, 50+).';
