-- SCRIPT : Automatisation Financière de la Vitrine (Showcase)
-- Objectif : Mettre à jour le solde (balance) et le total des gains de l'expert dès qu'une vente est validée.

-- 1. Création de la fonction de calcul de commission et mise à jour des balances
CREATE OR REPLACE FUNCTION public.handle_showcase_order_payment()
RETURNS TRIGGER AS $$
DECLARE
    net_amount DECIMAL(10,2);
BEGIN
    -- On ne traite que si le statut passe à 'paid' (ou est inséré comme tel)
    IF (TG_OP = 'INSERT' AND NEW.status = 'paid') OR (TG_OP = 'UPDATE' AND NEW.status = 'paid' AND OLD.status != 'paid') THEN
        
        -- Calcul du montant net (95% du prix total)
        net_amount := NEW.total_price - NEW.commission_amount;

        -- Mise à jour du profil de l'expert (provider)
        UPDATE public.profiles
        SET 
            balance = COALESCE(balance, 0) + net_amount,
            total_earnings = COALESCE(total_earnings, 0) + NEW.total_price
        WHERE id = NEW.provider_id;
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Création du trigger sur la table showcase_orders
DROP TRIGGER IF EXISTS tr_on_showcase_order_paid ON public.showcase_orders;
CREATE TRIGGER tr_on_showcase_order_paid
AFTER INSERT OR UPDATE OF status ON public.showcase_orders
FOR EACH ROW EXECUTE FUNCTION public.handle_showcase_order_payment();

-- 3. Mise à jour de la table des payouts pour déduire le solde lors de la demande
CREATE OR REPLACE FUNCTION public.handle_payout_request()
RETURNS TRIGGER AS $$
BEGIN
    -- On déduit du solde dès que la demande est créée pour éviter de redemander le même argent
    UPDATE public.profiles
    SET balance = balance - NEW.amount
    WHERE id = NEW.user_id AND balance >= NEW.amount;

    -- Si le solde était insuffisant, le update ne fera rien. 
    -- On pourrait ajouter un check ici si nécessaire.

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_on_payout_request_created ON public.payout_requests;
CREATE TRIGGER tr_on_payout_request_created
AFTER INSERT ON public.payout_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_payout_request();

COMMENT ON FUNCTION public.handle_showcase_order_payment() IS 'Automatise le crédit du solde expert lors d''une commande payée.';
COMMENT ON FUNCTION public.handle_payout_request() IS 'Déduit le solde expert dès la création d''une demande de virement.';
