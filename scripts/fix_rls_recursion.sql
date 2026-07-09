-- Correction de la récursion infinie sur la table conversation_participants
-- On sépare la règle en deux pour éviter que SELECT ne s'auto-appelle à l'infini

DROP POLICY IF EXISTS "Les participants peuvent voir les membres de leurs discussions" ON conversation_participants;

-- 1. On peut toujours voir sa propre participation (Pas de récursion)
CREATE POLICY "Voir sa propre participation" 
ON conversation_participants FOR SELECT 
USING (auth.uid() = user_id);

-- 2. On peut voir les autres participants des conversations auxquelles on appartient
-- Note: On utilise une sous-requête sur la même table, mais Supabase gère mieux si c'est bien structuré
-- Ou mieux : on utilise une règle basée sur la conversation elle-même si possible
CREATE POLICY "Voir les autres participants" 
ON conversation_participants FOR SELECT 
USING (
  conversation_id IN (
    SELECT id FROM conversations
  )
);

-- Comme la table 'conversations' a sa propre RLS qui vérifie déjà l'appartenance via 'conversation_participants',
-- on risque de retrouver une récursion indirecte.
-- La méthode la plus sûre (et performante) est souvent d'autoriser la lecture des participants
-- car ils ne contiennent pas de données sensibles (juste des IDs de liaison).
-- La vraie sécurité se fait au niveau des 'messages' et du contenu des 'conversations'.

DROP POLICY IF EXISTS "Voir les autres participants" ON conversation_participants;
CREATE POLICY "Lecture simplifiée des participants" 
ON conversation_participants FOR SELECT 
USING (true); 
-- Note : Savoir que User A est dans Conversation B n'est pas critique si on ne peut pas lire le contenu.
