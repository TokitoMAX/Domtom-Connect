-- ==========================================
-- 1. CREATION DE LA TABLE EVENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  event_date text NOT NULL,
  location text NOT NULL,
  ticket_url text,
  description text,
  image_url text NOT NULL
);

-- Si la table existe déjà sans ticket_url (mise à jour)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS ticket_url text;

-- Active RLS sur la table events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Ajout des politiques de sécurité
-- Tout le monde peut voir les événements
CREATE POLICY "Les événements sont visibles par tous" ON public.events
  FOR SELECT USING (true);

-- Les utilisateurs authentifiés peuvent créer des événements
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des événements" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres événements
CREATE POLICY "Les utilisateurs peuvent modifier leurs événements" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres événements
CREATE POLICY "Les utilisateurs peuvent supprimer leurs événements" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 2. CREATION DU BUCKET STORAGE "events_flyers"
-- ==========================================
-- Création du bucket 'events_flyers' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('events_flyers', 'events_flyers', true)
ON CONFLICT (id) DO NOTHING;

-- Autorisation de lecture publique pour tout le monde
CREATE POLICY "Public Access events_flyers" ON storage.objects
FOR SELECT USING ( bucket_id = 'events_flyers' );

-- Autorisation d'insertion (upload) pour les utilisateurs connectés
CREATE POLICY "Auth users can upload to events_flyers" ON storage.objects
FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'events_flyers' );
