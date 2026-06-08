-- Migration pour la table premium_leads
-- Permet de sauvegarder toutes les candidatures pour l'accompagnement 1-to-1

CREATE TABLE IF NOT EXISTS public.premium_leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Le profil de l'utilisateur (peut être null s'il n'est pas connecté)
    profile_type TEXT NOT NULL, -- 'porteur', 'entreprise', ou 'expert'
    challenge TEXT NOT NULL,
    budget TEXT NOT NULL,
    urgency TEXT NOT NULL,
    is_qualified BOOLEAN NOT NULL DEFAULT false, -- True si budget 'medium' ou 'high'
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'converted', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sécurité RLS
ALTER TABLE public.premium_leads ENABLE ROW LEVEL SECURITY;

-- Autoriser l'insertion pour les utilisateurs authentifiés
CREATE POLICY "Les utilisateurs peuvent soumettre des candidatures" 
ON public.premium_leads FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Seul l'admin peut voir toutes les candidatures (ajustez l'email avec le vôtre)
CREATE POLICY "Les admins peuvent tout voir" 
ON public.premium_leads FOR SELECT 
TO authenticated 
USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'domtomconnect@gmail.com'
);
