-- Gestion automatique du stock des contreparties
-- Décrémente le stock lorsqu'une contribution est validée

CREATE OR REPLACE FUNCTION public.handle_reward_stock_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Si une contribution liée à une récompense passe à 'completed'
    IF (NEW.status = 'completed' AND NEW.reward_id IS NOT NULL) THEN
        UPDATE public.project_rewards
        SET stock = stock - 1
        WHERE id = NEW.reward_id AND stock IS NOT NULL;
    END IF;
    
    -- Si une contribution est annulée/remboursée, on rend le stock
    IF (TG_OP = 'UPDATE' AND NEW.status IN ('failed', 'refunded') AND OLD.status = 'completed' AND OLD.reward_id IS NOT NULL) THEN
        UPDATE public.project_rewards
        SET stock = stock + 1
        WHERE id = OLD.reward_id AND stock IS NOT NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS tr_reward_stock_update ON public.contributions;
CREATE TRIGGER tr_reward_stock_update
AFTER INSERT OR UPDATE ON public.contributions
FOR EACH ROW EXECUTE FUNCTION public.handle_reward_stock_update();
