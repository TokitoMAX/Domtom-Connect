-- Mises à jour pour la facturation professionnelle DTC Business

-- 1. Ajout de champs professionnels à la table des profils
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_address TEXT,
ADD COLUMN IF NOT EXISTS company_siret TEXT,
ADD COLUMN IF NOT EXISTS company_vat TEXT;

-- 2. Ajout de colonnes de métadonnées à la table business_docs
ALTER TABLE business_docs
ADD COLUMN IF NOT EXISTS expert_details JSONB,
ADD COLUMN IF NOT EXISTS client_details JSONB,
ADD COLUMN IF NOT EXISTS tax_config JSONB,
ADD COLUMN IF NOT EXISTS total_tax NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ttc NUMERIC DEFAULT 0;

COMMENT ON COLUMN business_docs.expert_details IS 'Détails légaux de l expert au moment de l édition (SIRET, Adresse)';
COMMENT ON COLUMN business_docs.client_details IS 'Détails légaux du client au moment de l édition (Adresse, TVA)';
COMMENT ON COLUMN business_docs.tax_config IS 'Configuration de la TVA (nom, taux, mention légale)';
