-- Ajout de la colonne company à la table profiles pour éviter la perte de données
-- lors du changement de rôle (Entreprise <-> Porteur de projet)

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;

-- Commentaire pour documentation
COMMENT ON COLUMN profiles.company IS 'Nom de l''entreprise ou de l''organisation';
