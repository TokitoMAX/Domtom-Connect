-- Script to add institutional and SRE metrics to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS equipe TEXT,
ADD COLUMN IF NOT EXISTS motivation TEXT,
ADD COLUMN IF NOT EXISTS marche TEXT,
ADD COLUMN IF NOT EXISTS impact_local TEXT,
ADD COLUMN IF NOT EXISTS innovation TEXT,
ADD COLUMN IF NOT EXISTS emplois TEXT,
ADD COLUMN IF NOT EXISTS pitch_texte TEXT,
ADD COLUMN IF NOT EXISTS verification_id_url TEXT;

COMMENT ON COLUMN public.projects.equipe IS 'Présentation de l''équipe ou du porteur.';
COMMENT ON COLUMN public.projects.motivation IS 'Motivation du porteur de projet.';
COMMENT ON COLUMN public.projects.marche IS 'Marché cible et clients potentiels.';
COMMENT ON COLUMN public.projects.impact_local IS 'Retombées pour le territoire (social, enviro).';
COMMENT ON COLUMN public.projects.innovation IS 'Caractère innovant ou différenciant.';
COMMENT ON COLUMN public.projects.emplois IS 'Nombre d''emplois prévus ou créés.';
COMMENT ON COLUMN public.projects.pitch_texte IS 'Texte du pitch du projet.';
COMMENT ON COLUMN public.projects.verification_id_url IS 'URL de la carte d''identité ou document de vérification.';
