-- AJOUT DE LA COLONNE OBJECTIF DE FINANCEMENT (funding_goal)
-- Utilisée pour la barre de progression sur la Marketplace et le Dashboard

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS funding_goal DECIMAL(10,2) DEFAULT 1000.00;

-- Mise à jour des projets existants pour s'assurer qu'ils ont un objectif par défaut
UPDATE projects SET funding_goal = 1000.00 WHERE funding_goal IS NULL;
