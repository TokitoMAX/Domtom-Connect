-- ==========================================
-- DOMTOM CONNECT - GESTION COMMERCIALE (SQL)
-- Table pour la persistance des Devis et Factures
-- ==========================================

-- 1. TABLE : business_docs
CREATE TABLE IF NOT EXISTS public.business_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    expert_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Optionnel si client sur plateforme
    client_name TEXT NOT NULL, -- Obligatoire (même si hors plateforme)
    project_title TEXT NOT NULL,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('quote', 'invoice')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
    
    items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Liste des articles/services
    
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 12.00, -- 12% par défaut
    commission_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Montant HT total
    
    currency TEXT NOT NULL DEFAULT 'EUR',
    notes TEXT,
    payment_id TEXT -- Référence transaction (PayPal/Stripe)
);

-- 2. INDEX
CREATE INDEX IF NOT EXISTS idx_business_docs_expert_id ON public.business_docs(expert_id);
CREATE INDEX IF NOT EXISTS idx_business_docs_status ON public.business_docs(status);

-- 3. SÉCURITÉ (RLS)
ALTER TABLE public.business_docs ENABLE ROW LEVEL SECURITY;

-- POLITIQUE : L'expert peut tout faire sur ses propres documents
DROP POLICY IF EXISTS "Experts manage their docs" ON public.business_docs;
CREATE POLICY "Experts manage their docs" 
ON public.business_docs FOR ALL 
USING (auth.uid() = expert_id)
WITH CHECK (auth.uid() = expert_id);

-- POLITIQUE : Le client peut voir les documents qui lui sont adressés (si client_id renseigné)
DROP POLICY IF EXISTS "Clients view shared docs" ON public.business_docs;
CREATE POLICY "Clients view shared docs" 
ON public.business_docs FOR SELECT 
USING (auth.uid() = client_id);

-- 4. FONCTION : Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_business_docs_updated_at ON public.business_docs;
CREATE TRIGGER tr_business_docs_updated_at
BEFORE UPDATE ON public.business_docs
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.business_docs IS 'Table stockant les devis et factures générés par les experts de Domtom Connect.';
