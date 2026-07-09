-- ==========================================
-- DOMTOM CONNECT - ADD DEPOSIT TRACKING
-- Ajout du statut et du montant de l'acompte
-- ==========================================

ALTER TABLE public.business_docs
ADD COLUMN IF NOT EXISTS deposit_status TEXT DEFAULT 'none' CHECK (deposit_status IN ('none', 'pending', 'paid')),
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(12, 2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.business_docs.deposit_status IS 'Statut de paiement de l''acompte: none, pending, paid';
COMMENT ON COLUMN public.business_docs.deposit_amount IS 'Montant payé ou à payer pour l''acompte (valeur absolue)';
