-- SCRIPT : Showcase Branding Customization
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS showcase_primary_color TEXT DEFAULT '#0f172a',
ADD COLUMN IF NOT EXISTS showcase_secondary_color TEXT DEFAULT '#0070ba',
ADD COLUMN IF NOT EXISTS showcase_banner_url TEXT,
ADD COLUMN IF NOT EXISTS showcase_intro_text TEXT;

COMMENT ON COLUMN public.profiles.showcase_primary_color IS 'Couleur primaire pour la boutique de l''expert.';
COMMENT ON COLUMN public.profiles.showcase_secondary_color IS 'Couleur secondaire pour les boutons PayPal/Action.';
COMMENT ON COLUMN public.profiles.showcase_banner_url IS 'Image de fond pour la section vitrine de l''expert.';
COMMENT ON COLUMN public.profiles.showcase_intro_text IS 'Texte de présentation personnalisé pour la boutique.';
