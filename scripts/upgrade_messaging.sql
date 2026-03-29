-- ============================================================
-- upgrade_messaging.sql – Domtom Connect
-- Ajout des fonctionnalités type "WhatsApp" : Accusés de réception et Médias
-- ============================================================

-- 1. Ajout des colonnes pour les accusés de réception et les médias
ALTER TABLE IF EXISTS public.messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT; -- 'image', 'video', 'document'

-- 2. Création d'un bucket de stockage pour les médias de messagerie (si non existant)
-- Note: À exécuter dans l'interface Supabase Storage ou via API
-- Nom du bucket recommandé : 'chat-media'
-- Politique RLS recommandée : Authenticated users can upload, participants can read.

-- 3. Index pour performance sur les messages non lus
CREATE INDEX IF NOT EXISTS idx_messages_unread 
ON public.messages (conversation_id, sender_id) 
WHERE read_at IS NULL;

-- 4. Fonction pour marquer une conversation comme lue (facultatif mais utile pour RPC)
CREATE OR REPLACE FUNCTION mark_messages_as_read(target_conversation_id UUID, target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.messages
    SET read_at = NOW()
    WHERE conversation_id = target_conversation_id
      AND sender_id != target_user_id
      AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
