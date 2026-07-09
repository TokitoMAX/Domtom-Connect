-- Ajout du suivi persistant de l'état de vérification
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'not_started';

-- Les statuts possibles sont : 'not_started', 'pending', 'verified', 'rejected'
COMMENT ON COLUMN projects.verification_status IS 'État du processus de vérification (not_started, pending, verified, rejected).';

-- RLS pour la table projects (Assurer la lecture publique)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des projets" ON public.projects;
CREATE POLICY "Lecture publique des projets" 
ON public.projects FOR SELECT 
USING (true);

-- Autoriser les utilisateurs à mettre à jour leur propre statut vers 'pending' lors de l'upload
DROP POLICY IF EXISTS "Update own project verification status" ON public.projects;
CREATE POLICY "Update own project verification status" 
ON public.projects FOR UPDATE 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);
