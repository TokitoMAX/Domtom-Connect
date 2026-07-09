-- Fonction pour décrémenter le stock d'une récompense sans passer sous 0
CREATE OR REPLACE FUNCTION decrement_reward_stock(reward_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE project_rewards
    SET stock = stock - 1
    WHERE id = reward_id AND (stock > 0 OR stock IS NULL);
END;
$$ LANGUAGE plpgsql;

-- Rendre la fonction accessible via RPC
GRANT EXECUTE ON FUNCTION decrement_reward_stock(UUID) TO anon, authenticated;
