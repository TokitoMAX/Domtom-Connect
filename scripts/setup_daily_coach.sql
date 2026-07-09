-- Création de la table pour mémoriser les e-mails envoyés par le Daily Coach
-- Cela évite d'envoyer le même e-mail plusieurs fois au même utilisateur.

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    day_offset INTEGER NOT NULL,
    subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour accélérer les recherches de l'Edge Function
CREATE INDEX IF NOT EXISTS idx_email_logs_user_day ON public.email_logs(user_id, day_offset);

-- Sécurité RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Autoriser uniquement le backend (Service Role) à lire/écrire
CREATE POLICY "Service Role can manage email logs" ON public.email_logs
    USING (true) WITH CHECK (true);
