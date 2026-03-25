-- Ajout des champs institutionnels (CCI/BPI) pour le Success Engine
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS equipe TEXT,
ADD COLUMN IF NOT EXISTS marche TEXT,
ADD COLUMN IF NOT EXISTS impact_local TEXT,
ADD COLUMN IF NOT EXISTS innovation TEXT,
ADD COLUMN IF NOT EXISTS emplois TEXT;

COMMENT ON COLUMN public.projects.equipe IS 'Présentation de l''équipe ou du porteur.';
COMMENT ON COLUMN public.projects.marche IS 'Marché cible et clients potentiels.';
COMMENT ON COLUMN public.projects.impact_local IS 'Retombées pour le territoire (social, enviro).';
COMMENT ON COLUMN public.projects.innovation IS 'Caractère innovant ou différenciant.';
COMMENT ON COLUMN public.projects.emplois IS 'Nombre d''emplois prévus ou créés.';
