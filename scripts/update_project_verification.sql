-- Mise à jour pour la professionnalisation du crowdfunding
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS siret TEXT,
ADD COLUMN IF NOT EXISTS identity_verified BOOLEAN DEFAULT FALSE;

-- Commentaire pour la clarté
COMMENT ON COLUMN projects.is_approved IS 'Un projet doit être approuvé par un admin pour être visible sur la marketplace.';
COMMENT ON COLUMN projects.siret IS 'Numéro SIRET obligatoire pour les porteurs professionnels.';
COMMENT ON COLUMN projects.identity_verified IS 'Statut de vérification de l''identité du porteur.';

-- Optionnel : Index pour la performance de filtrage
CREATE INDEX IF NOT EXISTS idx_projects_approved ON projects(is_approved) WHERE is_approved = true;
