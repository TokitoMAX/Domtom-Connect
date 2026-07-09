-- ============================================================
-- disable_contributions.sql
-- Désactivation de la fonctionnalité de soutien participatif
-- ============================================================

-- 1. Supprimer le trigger de mise à jour automatique des financements
DROP TRIGGER IF EXISTS tr_contribution_update ON public.contributions;
DROP FUNCTION IF EXISTS public.handle_contribution_update();

-- 2. Renommer la table pour archiver les données (sans les supprimer pour l'historique)
ALTER TABLE IF EXISTS public.contributions RENAME TO contributions_archived;

-- 3. (Optionnel) Supprimer les politiques de sécurité (RLS) sur l'ancienne table
DROP POLICY IF EXISTS "Anyone can contribute" ON public.contributions_archived;
DROP POLICY IF EXISTS "Public view contributions" ON public.contributions_archived;

-- Note : Les montants déjà levés (total_raised dans projects) restent intacts pour l'historique.
