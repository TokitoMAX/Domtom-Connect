-- ==========================================
-- MIGRATION MULTI-TARIFS (BIZOUK STYLE)
-- ==========================================

-- 1. Ajout de la colonne JSONB pour stocker les différents tarifs par événement
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS ticket_tiers jsonb DEFAULT '[]'::jsonb;

-- 2. Mise à jour de la table des billets pour supporter les quantités et les types de tarifs
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS tier_id text; -- ID du tarif choisi
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS tier_name text; -- Nom du tarif au moment de l'achat
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1; -- Nombre de places achetées

-- Commentaire de documentation
COMMENT ON COLUMN public.events.ticket_tiers IS 'Liste des tarifs au format [{id, name, price, capacity, description}]';
