-- ========================================================
-- FIX 403 FORBIDDEN - COLLABORATORS RLS POLICY REFRESH
-- ========================================================

-- 1. Nettoyage des anciennes politiques
DROP POLICY IF EXISTS "Owners can manage their team" ON collaborators;
DROP POLICY IF EXISTS "Collaborators can view their membership" ON collaborators;

-- 2. Nouvelle politique pour les PROPRIÉTAIRES (CRUD complet)
-- Un propriétaire peut gérer toute ligne où son ID correspond à owner_id
CREATE POLICY "Owners manage team" ON collaborators
FOR ALL 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- 3. Nouvelle politique pour les COLLABORATEURS (Lecture seule)
-- Un collaborateur peut voir les lignes où son email correspond à celui de sa session JWT
CREATE POLICY "Collaborators view access" ON collaborators
FOR SELECT
USING (collaborator_email = (auth.jwt() ->> 'email'));

-- 4. Attribution des droits au rôle authentifié
GRANT ALL ON collaborators TO authenticated;

-- 5. Mise à jour de la vue (si elle existe)
GRANT SELECT ON my_collaborations TO authenticated;

-- MESSAGE DE SUCCÈS : RLS mise à jour avec succès.
