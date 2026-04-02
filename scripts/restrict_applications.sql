-- Restreindre les candidatures pour les Porteurs de Projet (rôle 'user')
-- Seuls les Experts et les Entreprises peuvent désormais postuler aux missions.
-- Les Porteurs de Projet sont invités à recruter via l'annuaire.

DROP POLICY IF EXISTS "Les candidats peuvent postuler" ON job_applications;

CREATE POLICY "Les candidats peuvent postuler"
ON job_applications FOR INSERT
WITH CHECK (
  auth.uid() = candidate_id 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role != 'user'
  )
);

COMMENT ON POLICY "Les candidats peuvent postuler" ON job_applications IS 'Bloque les candidatures provenant du rôle Porteur de Projet (user).';
