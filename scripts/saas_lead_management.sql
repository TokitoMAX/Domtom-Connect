-- ============================================================
-- saas_lead_management.sql – Domtom Connect
-- Pivot SaaS: Lead Tracking and Metadata
-- ============================================================

-- 1. Ajout de la colonne lead_status aux participants pour le CRM
-- Status: 'Nouveau', 'En Discussion', 'Devis Envoyé', 'Gagné', 'Perdu'
ALTER TABLE IF EXISTS public.conversation_participants 
ADD COLUMN IF NOT EXISTS lead_status TEXT DEFAULT 'Nouveau';

-- 2. Ajout de la colonne metadata aux messages pour les Business Cards et structures CRM
ALTER TABLE IF EXISTS public.messages 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 3. Index pour recherche par statut si besoin (Admin Dashboard)
CREATE INDEX IF NOT EXISTS idx_conv_lead_status 
ON public.conversation_participants (lead_status);

-- 4. Politique RLS pour permettre aux participants de modifier leur lead_status
-- (Si ce n'est pas déjà géré par une politique plus large)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Les participants peuvent modifier leur propre lien') THEN
        -- Déjà couvert
    ELSE
        CREATE POLICY "Les participants peuvent modifier leur lead_status"
        ON public.conversation_participants FOR UPDATE
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
END $$;
