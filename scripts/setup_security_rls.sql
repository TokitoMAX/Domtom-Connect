-- 1. ACTIVER LA SÉCURITÉ RLS SUR LA TABLE TICKETS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER LES ANCIENNES POLITIQUES SI ELLES EXISTENT (Pour éviter les doublons)
DROP POLICY IF EXISTS "Users can view their own tickets" ON tickets;
DROP POLICY IF EXISTS "Organizers can view tickets for their events" ON tickets;
DROP POLICY IF EXISTS "Organizers can validate tickets" ON tickets;
DROP POLICY IF EXISTS "Users can insert their own tickets" ON tickets;

-- 3. POLITIQUE : Un acheteur peut voir ses propres billets
CREATE POLICY "Users can view their own tickets" 
ON tickets FOR SELECT 
USING (auth.uid() = buyer_id);

-- 4. POLITIQUE : Un organisateur peut voir tous les billets de ses événements
CREATE POLICY "Organizers can view tickets for their events" 
ON tickets FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
    AND events.user_id = auth.uid()
  )
);

-- 5. POLITIQUE : Seul l'organisateur peut valider (UPDATE) l'entrée d'un billet
CREATE POLICY "Organizers can validate tickets" 
ON tickets FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
    AND events.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
    AND events.user_id = auth.uid()
  )
);

-- 6. POLITIQUE : Un utilisateur peut acheter (INSERT) ses propres billets
CREATE POLICY "Users can insert their own tickets" 
ON tickets FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

-- 7. VÉRIFICATION DE LA TABLE EVENTS (Optionnelle si déjà fait)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Users can manage their own events" ON events;

CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Users can manage their own events" ON events FOR ALL USING (auth.uid() = user_id);
