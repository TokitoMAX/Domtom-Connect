-- ==========================================
-- DOMTOM CONNECT - BUSINESS DOCS TABLE SETUP COMPLET
-- Script unique à exécuter pour que le Tracker Méthodo fonctionne.
-- Exécuter dans Supabase > SQL Editor > New Query
-- ==========================================

-- 1. Créer la table si elle n'existe pas encore
CREATE TABLE IF NOT EXISTS public.business_docs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expert_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    project_title TEXT,
    client_name TEXT,
    doc_type TEXT DEFAULT 'quote',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    deposit_perc DECIMAL(5,2) DEFAULT 30,
    deposit_status TEXT DEFAULT 'none' CHECK (deposit_status IN ('none', 'pending', 'paid')),
    deposit_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    signature_status TEXT DEFAULT 'pending' CHECK (signature_status IN ('pending', 'signed')),
    notes TEXT
);

-- 2. Ajouter les colonnes manquantes si la table existe déjà (idempotent)
ALTER TABLE public.business_docs
    ADD COLUMN IF NOT EXISTS project_title TEXT,
    ADD COLUMN IF NOT EXISTS client_name TEXT,
    ADD COLUMN IF NOT EXISTS doc_type TEXT DEFAULT 'quote',
    ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS deposit_perc DECIMAL(5,2) DEFAULT 30,
    ADD COLUMN IF NOT EXISTS deposit_status TEXT DEFAULT 'none',
    ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS signature_status TEXT DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Ajouter les contraintes CHECK si elles n'existent pas (ignorer les erreurs si elles existent déjà)
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.business_docs ADD CONSTRAINT business_docs_status_check CHECK (status IN ('draft', 'sent', 'paid', 'cancelled'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.business_docs ADD CONSTRAINT business_docs_deposit_status_check CHECK (deposit_status IN ('none', 'pending', 'paid'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.business_docs ADD CONSTRAINT business_docs_signature_status_check CHECK (signature_status IN ('pending', 'signed'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- 4. Activer RLS (Row Level Security)
ALTER TABLE public.business_docs ENABLE ROW LEVEL SECURITY;

-- 5. Policies RLS - L'expert et le client peuvent voir leurs propres docs
DROP POLICY IF EXISTS "Users can see their own business docs" ON public.business_docs;
CREATE POLICY "Users can see their own business docs"
ON public.business_docs
FOR SELECT
USING (auth.uid() = expert_id OR auth.uid() = client_id);

DROP POLICY IF EXISTS "Experts can create business docs" ON public.business_docs;
CREATE POLICY "Experts can create business docs"
ON public.business_docs
FOR INSERT
WITH CHECK (auth.uid() = expert_id);

DROP POLICY IF EXISTS "Experts can update their business docs" ON public.business_docs;
CREATE POLICY "Experts can update their business docs"
ON public.business_docs
FOR UPDATE
USING (auth.uid() = expert_id OR auth.uid() = client_id);

DROP POLICY IF EXISTS "Experts can delete their business docs" ON public.business_docs;
CREATE POLICY "Experts can delete their business docs"
ON public.business_docs
FOR DELETE
USING (auth.uid() = expert_id);

-- 6. Index pour les performances
CREATE INDEX IF NOT EXISTS business_docs_expert_id_idx ON public.business_docs(expert_id);
CREATE INDEX IF NOT EXISTS business_docs_client_id_idx ON public.business_docs(client_id);
CREATE INDEX IF NOT EXISTS business_docs_status_idx ON public.business_docs(status);
