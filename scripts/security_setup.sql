-- ==========================================
-- SÉCURISATION DE LA BASE DE DONNÉES (RLS)
-- Domtom Connect - Messagerie & Missions
-- ==========================================

-- 1. TABLE : conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les participants peuvent voir leurs conversations" ON conversations;
CREATE POLICY "Les participants peuvent voir leurs conversations" 
ON conversations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = conversations.id 
    AND conversation_participants.user_id = auth.uid()
  )
);

-- 2. TABLE : conversation_participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les participants peuvent voir les membres de leurs discussions" ON conversation_participants;
CREATE POLICY "Les participants peuvent voir les membres de leurs discussions" 
ON conversation_participants FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants AS cp
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Les utilisateurs peuvent s'ajouter à une discussion" ON conversation_participants;
CREATE POLICY "Les utilisateurs peuvent s'ajouter à une discussion" 
ON conversation_participants FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. TABLE : messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les participants peuvent lire les messages" ON messages;
CREATE POLICY "Les participants peuvent lire les messages" 
ON messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Les participants peuvent envoyer des messages" ON messages;
CREATE POLICY "Les participants peuvent envoyer des messages" 
ON messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id = auth.uid()
  )
);

-- 4. TABLE : job_offers (Missions)
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tout le monde peut voir les missions" ON job_offers;
CREATE POLICY "Tout le monde peut voir les missions" 
ON job_offers FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Seul le créateur peut modifier sa mission" ON job_offers;
CREATE POLICY "Seul le créateur peut modifier sa mission" 
ON job_offers FOR ALL 
USING (auth.uid() = advertiser_id)
WITH CHECK (auth.uid() = advertiser_id);

-- 5. TABLE : profiles (Sécurité de base)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tout le monde peut voir les profils" ON profiles;
CREATE POLICY "Tout le monde peut voir les profils" 
ON profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Chacun modifie son propre profil" ON profiles;
CREATE POLICY "Chacun modifie son propre profil" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
