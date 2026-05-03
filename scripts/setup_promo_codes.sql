-- Table des codes promos
CREATE TABLE IF NOT EXISTS public.event_promo_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  discount_type text CHECK (discount_type IN ('percent', 'amount')) NOT NULL,
  discount_value numeric NOT NULL,
  max_uses integer DEFAULT 0, -- 0 = illimitÃ©
  used_count integer DEFAULT 0,
  expiry_date timestamp with time zone,
  UNIQUE(event_id, code)
);

-- SÃ©curitÃ© RLS
ALTER TABLE public.event_promo_codes ENABLE ROW LEVEL SECURITY;

-- Lecture publique (pour vÃ©rification lors de l'achat)
CREATE POLICY "Lecture publique des codes promos" ON public.event_promo_codes
  FOR SELECT USING (true);

-- L'organisateur gÃ¨re ses propres codes
CREATE POLICY "L'organisateur gÃ¨re ses codes promos" ON public.event_promo_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_promo_codes.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Fonction pour incrémenter l'usage d'un code promo
CREATE OR REPLACE FUNCTION public.increment_promo_usage(p_promo_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.event_promo_codes
  SET used_count = used_count + 1
  WHERE id = p_promo_id;
END;
$$;
