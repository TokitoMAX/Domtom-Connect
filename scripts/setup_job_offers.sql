-- ==========================================
-- DOMTOM CONNECT - TABLE JOB OFFERS (CORRIGÉ)
-- Annonces de missions publiées par les entreprises
-- ==========================================

-- 1. Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.job_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sector TEXT,
    budget DECIMAL(12, 2),
    duration TEXT,
    territory TEXT,
    status TEXT DEFAULT 'open'
);

-- 2. Ajouter les colonnes manquantes si la table existait déjà
ALTER TABLE public.job_offers
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS sector TEXT,
    ADD COLUMN IF NOT EXISTS budget DECIMAL(12, 2),
    ADD COLUMN IF NOT EXISTS duration TEXT,
    ADD COLUMN IF NOT EXISTS territory TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';

-- 3. Ajouter la contrainte CHECK séparément (idempotent)
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.job_offers 
            ADD CONSTRAINT job_offers_status_check 
            CHECK (status IN ('open', 'closed', 'draft'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- 4. RLS
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- 5. Policies
DROP POLICY IF EXISTS "Anyone can view open job offers" ON public.job_offers;
CREATE POLICY "Anyone can view open job offers"
ON public.job_offers FOR SELECT
USING (status = 'open' OR auth.uid() = company_id);

DROP POLICY IF EXISTS "Companies can create job offers" ON public.job_offers;
CREATE POLICY "Companies can create job offers"
ON public.job_offers FOR INSERT
WITH CHECK (auth.uid() = company_id);

DROP POLICY IF EXISTS "Companies can update their job offers" ON public.job_offers;
CREATE POLICY "Companies can update their job offers"
ON public.job_offers FOR UPDATE
USING (auth.uid() = company_id);

DROP POLICY IF EXISTS "Companies can delete their job offers" ON public.job_offers;
CREATE POLICY "Companies can delete their job offers"
ON public.job_offers FOR DELETE
USING (auth.uid() = company_id);

-- 6. Index
CREATE INDEX IF NOT EXISTS job_offers_company_id_idx ON public.job_offers(company_id);
CREATE INDEX IF NOT EXISTS job_offers_status_idx ON public.job_offers(status);
CREATE INDEX IF NOT EXISTS job_offers_created_at_idx ON public.job_offers(created_at DESC);
