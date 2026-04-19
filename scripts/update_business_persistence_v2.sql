-- ==========================================
-- DOMTOM CONNECT - BUSINESS PERSISTENCE UPDATE (v2)
-- Adding missing columns for total taxes, TTC, deposits and details
-- ==========================================

-- 1. ADD MISSING COLUMNS TO business_docs
ALTER TABLE public.business_docs 
ADD COLUMN IF NOT EXISTS total_tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ttc DECIMAL(12, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS deposit_perc DECIMAL(5, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS expert_details JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS client_details JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS tax_config JSONB NOT NULL DEFAULT '{}'::jsonb;

-- 2. ENSURE RLS IS CORRECT
-- (Already enabled in setup_business_persistence.sql, but confirming)
ALTER TABLE public.business_docs ENABLE ROW LEVEL SECURITY;

-- 3. HELPER FOR COLLABORATORS STATUS (INDEXING)
CREATE INDEX IF NOT EXISTS idx_collaborators_status ON public.collaborators(status);

COMMENT ON TABLE public.business_docs IS 'Table mise à jour avec support des taxes, acomptes et métadonnées détaillées.';
