-- ==========================================
-- DOMTOM CONNECT - MULTI-ACCOUNT SETUP (V1)
-- ==========================================

-- 1. CRÉATION DE LA TABLE DES COLLABORATEURS
CREATE TABLE IF NOT EXISTS collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    collaborator_email TEXT NOT NULL,
    role TEXT DEFAULT 'editor', -- 'editor' ou 'admin'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(owner_id, collaborator_email)
);

-- 2. ACTIVATION RLS
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- 3. POLITIQUES RLS SUR LA TABLE COLLABORATORS
-- Propriétaire : peut tout faire (CRUD) sur ses propres collaborateurs
CREATE POLICY "Owners can manage their team" ON collaborators
FOR ALL USING (auth.uid() = owner_id);

-- Collaborateur : peut voir sa propre appartenance
CREATE POLICY "Collaborators can view their membership" ON collaborators
FOR SELECT USING (collaborator_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 4. MISE À JOUR DES POLITIQUES RLS EXISTANTES (EXEMPLES)
-- Note : Il faudra adapter ces noms si tes politiques réelles sur 'jobs' ont des noms différents.

-- Exemple pour la table 'jobs' (S'il existe une politique "Users can manage their own jobs")
-- DROP POLICY IF EXISTS "Users can manage their own jobs" ON jobs;
-- CREATE POLICY "Users and collaborators can manage jobs" ON jobs
-- FOR ALL USING (
--   user_id = auth.uid() 
--   OR EXISTS (
--     SELECT 1 FROM collaborators 
--     WHERE collaborators.owner_id = jobs.user_id 
--     AND collaborators.collaborator_email = (SELECT email FROM auth.users WHERE id = auth.uid())
--   )
-- );

-- 5. AJOUT D'UNE VUE POUR FACILITER LA LECTURE (OPTIONNEL)
CREATE OR REPLACE VIEW my_collaborations AS
SELECT c.*, p.full_name as owner_name, p.company_name
FROM collaborators c
JOIN profiles p ON c.owner_id = p.id
WHERE c.collaborator_email = (SELECT email FROM auth.users WHERE id = auth.uid());
