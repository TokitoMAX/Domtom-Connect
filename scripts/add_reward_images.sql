-- Ajout des visuels pour les contreparties
ALTER TABLE project_rewards 
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN project_rewards.image_url IS 'Lien vers l''image illustrative de la contrepartie.';
