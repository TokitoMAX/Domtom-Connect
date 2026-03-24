-- Permettre la suppression d'une contrepartie même si elle a déjà des contributeurs
-- On passe la contrainte en 'SET NULL' pour que la contribution reste dans la base (historique) 
-- mais que le lien vers l'ID de la récompense disparaisse sans bloquer la suppression.

ALTER TABLE public.contributions 
DROP CONSTRAINT IF EXISTS contributions_reward_id_fkey;

ALTER TABLE public.contributions
ADD CONSTRAINT contributions_reward_id_fkey 
FOREIGN KEY (reward_id) 
REFERENCES public.project_rewards(id) 
ON DELETE SET NULL;
