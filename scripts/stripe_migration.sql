-- Migration : Intégration Stripe pour showcase_orders
-- À exécuter dans Supabase Dashboard > SQL Editor

-- 1. Ajouter les colonnes Stripe à showcase_orders
ALTER TABLE public.showcase_orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- 2. Ajouter colonne stripe_session_id à transaction_logs
ALTER TABLE public.transaction_logs
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- 3. Fonction RPC pour créditer le solde de l'expert de façon atomique
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

-- 4. Supprimer les anciens triggers PayPal (remplacés par le webhook Stripe)
DROP TRIGGER IF EXISTS tr_secure_payment_validation ON public.showcase_orders;
DROP TRIGGER IF EXISTS tr_notify_order_success ON public.showcase_orders;

-- 5. Nouveau trigger simplifié (juste pour l'audit, la logique est dans le webhook Stripe)
CREATE OR REPLACE FUNCTION public.log_order_audit()
RETURNS TRIGGER AS $$
BEGIN
  -- Log simple pour l'audit trail
  RAISE LOG 'Nouvelle commande Stripe: order_id=%, provider_id=%, montant=%', 
    NEW.id, NEW.provider_id, NEW.total_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_order_audit
AFTER INSERT ON public.showcase_orders
FOR EACH ROW EXECUTE FUNCTION public.log_order_audit();

-- 6. Index pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.showcase_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_provider_status ON public.showcase_orders(provider_id, status);
