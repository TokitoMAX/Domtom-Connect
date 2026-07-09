-- ==========================================
-- SCRIPT MIGRATION BILLETTERIE PAYPAL
-- ==========================================

-- 1. Ajout des colonnes de prix et quantité max à la table des événements
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price numeric DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS total_tickets integer;

-- 2. Création de la table des billets
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES auth.users NOT NULL,
  buyer_email text NOT NULL,
  payment_id text, -- ID de transaction PayPal
  amount_paid numeric, -- Montant payé
  qr_token uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  status text DEFAULT 'valide' NOT NULL -- 'valide', 'scanne', 'annule'
);

-- Activation de la sécurité RLS sur la table tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- ==========================================

-- 1. L'acheteur peut créer son billet (suite paiement)
CREATE POLICY "L'acheteur peut creer son billet" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- 2. L'acheteur ne peut voir que ses propres billets
CREATE POLICY "L'acheteur peut voir ses propres billets" ON public.tickets
  FOR SELECT USING (auth.uid() = buyer_id);

-- 3. L'organisateur peut voir tous les billets de ses propres événements
CREATE POLICY "L'organisateur voit les billets de ses evenements" ON public.tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = tickets.event_id
      AND events.user_id = auth.uid()
    )
  );

-- 4. L'organisateur peut scanner/invalider un billet
CREATE POLICY "L'organisateur peut update ses billets" ON public.tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = tickets.event_id
      AND events.user_id = auth.uid()
    )
  );
