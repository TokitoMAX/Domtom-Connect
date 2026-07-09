-- Ajout des champs pour structurer l'ambition du projet
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS vision TEXT,
ADD COLUMN IF NOT EXISTS mission TEXT,
ADD COLUMN IF NOT EXISTS enjeu TEXT,
ADD COLUMN IF NOT EXISTS business_plan_url TEXT;

COMMENT ON COLUMN public.projects.vision IS 'La vision à long terme du projet.';
COMMENT ON COLUMN public.projects.mission IS 'Ce que le projet accomplit concrètement.';
COMMENT ON COLUMN public.projects.enjeu IS 'Pourquoi ce projet est crucial aujourd''hui.';
