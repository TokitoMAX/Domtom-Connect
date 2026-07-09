-- Table pour les contreparties (récompenses)
CREATE TABLE IF NOT EXISTS project_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    stock INTEGER DEFAULT NULL, -- NULL = Illimité
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter le lien dans la table contributions
ALTER TABLE contributions 
ADD COLUMN IF NOT EXISTS reward_id UUID REFERENCES project_rewards(id);

-- Index pour la performance
CREATE INDEX IF NOT EXISTS idx_rewards_project ON project_rewards(project_id);

-- RLS (Row Level Security) - Optionnel mais recommandé
ALTER TABLE project_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read rewards" ON project_rewards FOR SELECT USING (true);
CREATE POLICY "Owners can manage rewards" ON project_rewards FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_rewards.project_id AND owner_id = auth.uid())
);
