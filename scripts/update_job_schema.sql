-- Ajouter la colonne commission à la table job_offers
ALTER TABLE job_offers ADD COLUMN IF NOT EXISTS commission TEXT DEFAULT NULL;

-- Mettre à jour les politiques RLS pour inclure la nouvelle colonne (déjà couvert par FOR ALL si existant)
-- Mais pour être sûr, on rafraîchit la politique de modification
DROP POLICY IF EXISTS "Seul le créateur peut modifier sa mission" ON job_offers;
CREATE POLICY "Seul le créateur peut modifier sa mission" 
ON job_offers FOR ALL 
USING (auth.uid() = company_id)
WITH CHECK (auth.uid() = company_id);
