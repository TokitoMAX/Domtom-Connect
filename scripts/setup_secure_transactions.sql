-- SCRIPT : Sécurisation Totale des Transactions & Balances
-- Objectif : Garantir l'intégrité des paiements et empêcher les mises à jour frauduleuses du solde.

-- 1. Ajout de contraintes de sécurité sur le solde
ALTER TABLE public.profiles 
ADD CONSTRAINT check_positive_balance CHECK (balance >= 0);

-- 2. Création d'une table de logs pour les transactions (Audit Trail)
CREATE TABLE IF NOT EXISTS public.transaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES showcase_orders(id),
    provider_id UUID REFERENCES profiles(id),
    amount DECIMAL(10,2),
    type TEXT, -- 'credit' or 'debit'
    status TEXT, -- 'success', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Fonction renforcée pour le calcul de commission (5% plateforme / 95% expert)
CREATE OR REPLACE FUNCTION public.confirm_secure_payment()
RETURNS TRIGGER AS $$
DECLARE
    net_val DECIMAL(10,2);
    comm_val DECIMAL(10,2);
BEGIN
    -- Seul le statut 'paid' déclenche le virement interne
    IF (NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid')) THEN
        
        -- Calcul strict : Commission Domtom Connect (5%)
        comm_val := NEW.total_price * 0.05;
        net_val := NEW.total_price - comm_val;

        -- Mise à jour du solde de l'expert
        UPDATE public.profiles
        SET 
            balance = COALESCE(balance, 0) + net_val,
            total_earnings = COALESCE(total_earnings, 0) + NEW.total_price
        WHERE id = NEW.provider_id;

        -- Log de la transaction pour audit
        INSERT INTO public.transaction_logs (order_id, provider_id, amount, type, status)
        VALUES (NEW.id, NEW.provider_id, net_val, 'credit', 'success');

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Application du trigger de sécurité
DROP TRIGGER IF EXISTS tr_secure_payment_validation ON public.showcase_orders;
CREATE TRIGGER tr_secure_payment_validation
AFTER UPDATE OF status ON public.showcase_orders
FOR EACH ROW EXECUTE FUNCTION public.confirm_secure_payment();

COMMENT ON TABLE public.transaction_logs IS 'Journal d''audit pour toutes les transactions financières de la vitrine.';
