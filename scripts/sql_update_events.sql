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
  description text,
  image_url text NOT NULL
);

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
-- 2. INSTRUCTIONS BUCKET STORAGE (À FAIRE MANUELLEMENT)
-- ==========================================
/**
 1. Allez dans "Storage" sur la console Supabase.
 2. Cliquez sur "New bucket".
 3. Nommez-le "events_flyers".
 4. Activez "Public bucket".
 5. Dans "Policies" du bucket events_flyers, ajoutez une policy pour que:
    - SELECT (tous ou authentifiés)
    - INSERT (authentifiés)
    - UPDATE/DELETE (authentifiés - optionnel si besoin)
*/
