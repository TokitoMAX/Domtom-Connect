-- SCRIPT : Finalisation Intégration Stripe Connect
-- Ce script ajoute les colonnes manquantes, aligne les commissions et nettoie les anciens triggers PayPal/Manuels.

-- 1. Ajout de stripe_connect_id aux profils (CRITIQUE pour l'onboarding)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT;

-- 2. Ajout des colonnes de session Stripe aux tables de commandes si manquantes
-- (Déjà présent dans certains scripts mais on s'assure de l'uniformité)
ALTER TABLE public.showcase_orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

ALTER TABLE public.business_docs 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- 3. Désactivation des anciens triggers de balance manuelle pour éviter le double comptage
-- Le webhook Stripe s'occupe désormais de créditer la balance (display) et Stripe gère le transfert réel.
DROP TRIGGER IF EXISTS tr_on_showcase_order_paid ON public.showcase_orders;
DROP TRIGGER IF EXISTS tr_secure_payment_validation ON public.showcase_orders;
DROP TRIGGER IF EXISTS tr_notify_order_success ON public.showcase_orders;

-- 4. Alignement de la fonction RPC credit_expert_balance (utilisée par le webhook)
-- On s'assure qu'elle est à jour.
CREATE OR REPLACE FUNCTION public.credit_expert_balance(
  p_provider_id UUID,
  p_net_amount DECIMAL(10,2),
  p_total_price DECIMAL(10,2)
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    balance = COALESCE(balance, 0) + p_net_amount,
    total_earnings = COALESCE(total_earnings, 0) + p_total_price
  WHERE id = p_provider_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Politique RLS pour permettre aux clients de voir leurs commandes (nécessaire pour payment-success.html)
DROP POLICY IF EXISTS "Users can view their own orders (buyer or provider)" ON public.showcase_orders;
CREATE POLICY "Users can view their own orders (buyer or provider)" ON public.showcase_orders
FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = provider_id);

-- 6. Index pour la performance
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.showcase_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_business_docs_stripe_session ON public.business_docs(stripe_session_id);

COMMENT ON COLUMN public.profiles.stripe_connect_id IS 'ID du compte Stripe Connect (Standard/Express) de l expert.';
