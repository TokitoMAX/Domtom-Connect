-- ==========================================
-- ARCHITECTURE FINANCIÈRE UNIFIÉE (STRIPE)
-- ==========================================

-- Table centrale pour le suivi de TOUS les flux financiers
CREATE TABLE IF NOT EXISTS public.platform_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  type text NOT NULL, -- 'showcase', 'event', 'quote', 'crowdfunding', 'subscription'
  gross_amount numeric NOT NULL,
  fee_amount numeric NOT NULL,
  net_amount numeric NOT NULL,
  provider_id uuid REFERENCES auth.users, -- Celui qui reçoit l'argent
  buyer_id uuid REFERENCES auth.users,    -- Celui qui paie
  stripe_session_id text UNIQUE,
  status text DEFAULT 'completed'
);

-- Activation RLS
ALTER TABLE public.platform_transactions ENABLE ROW LEVEL SECURITY;

-- L'admin voit tout, l'utilisateur voit ses propres transactions (paupa ou reçu)
CREATE POLICY "Les utilisateurs voient leurs propres transactions" ON public.platform_transactions
  FOR SELECT USING (auth.uid() = provider_id OR auth.uid() = buyer_id);

-- Migration du webhook pour supporter le type 'event'
-- Note : Ce script prépare la structure, le code JS des fonctions suit.
