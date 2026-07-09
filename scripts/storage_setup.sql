-- ==========================================
-- CONFIGURATION DU STORAGE (DOCUMENTS)
-- Domtom Connect
-- ==========================================

-- 1. Création du bucket 'applications-docs'
-- NOTE : Si cette commande échoue, créez le bucket manuellement nommé 'applications-docs' 
-- dans l'onglet Storage de votre dashboard Supabase et réglez-le sur "Public".
INSERT INTO storage.buckets (id, name, public) 
VALUES ('applications-docs', 'applications-docs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Politiques de sécurité (RLS) pour les documents
-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Lecture publique des documents" ON storage.objects;
DROP POLICY IF EXISTS "Upload par les candidats" ON storage.objects;

-- Autoriser la lecture publique des documents de candidature
CREATE POLICY "Lecture publique des documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'applications-docs');

-- Autoriser les candidats à uploader dans leur propre dossier
-- Le code JS utilise le chemin : {userId}/{timestamp}-{filename}
CREATE POLICY "Upload par les candidats"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'applications-docs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
