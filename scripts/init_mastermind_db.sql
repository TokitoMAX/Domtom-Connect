-- 1. Créer la conversation globale Mastermind si elle n'existe pas
INSERT INTO public.conversations (id, title, updated_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'Salon Mastermind DTC', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Ajouter TOUS les utilisateurs validés comme participants (optionnel, mais garantit que tout le monde a accès)
INSERT INTO public.conversation_participants (conversation_id, user_id, lead_status)
SELECT '11111111-1111-1111-1111-111111111111', id, 'Actif'
FROM public.profiles
WHERE role IN ('premium', 'authority', 'club', 'admin')
ON CONFLICT (conversation_id, user_id) DO NOTHING;
