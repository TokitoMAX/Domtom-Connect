-- Script de sécurisation Supabase RLS pour Domtom Connect
-- Ce script active RLS et définit les politiques d'accès pour les tables critiques.

-- ============================================================
-- 0. FONCTIONS UTILES
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 1. PROFILS (public.profiles)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profils publics" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Modif propre profil" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 2. PROJETS & SUIVI (projects, rewards, milestones)
-- ============================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projets publics si listés" 
ON public.projects FOR SELECT USING (is_listed = true OR auth.uid() = owner_id OR is_admin());

CREATE POLICY "Gestion projets (Propriétaire)" 
ON public.projects FOR ALL USING (auth.uid() = owner_id OR is_admin());

-- Rewards & Milestones suivent la visibilité du projet
CREATE POLICY "Vision rewards/milestones" 
ON public.project_rewards FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (is_listed = true OR owner_id = auth.uid() OR is_admin())));

CREATE POLICY "Gestion rewards/milestones (Propriétaire)" 
ON public.project_rewards FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (owner_id = auth.uid() OR is_admin())));

CREATE POLICY "Vision milestones" 
ON public.project_milestones FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (is_listed = true OR owner_id = auth.uid() OR is_admin())));

CREATE POLICY "Gestion milestones (Propriétaire)" 
ON public.project_milestones FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (owner_id = auth.uid() OR is_admin())));

-- ============================================================
-- 3. ÉVÉNEMENTS & BILLETS (events, tickets)
-- ============================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events publics" ON public.events FOR SELECT USING (true);
CREATE POLICY "Gestion events (Organisateur)" ON public.events FOR ALL USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Vision tickets (Acheteur ou Organisateur)" 
ON public.tickets FOR SELECT 
USING (
    buyer_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid())
    OR is_admin()
);

CREATE POLICY "Achat ticket (Auth)" 
ON public.tickets FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ============================================================
-- 4. MESSAGERIE (conversations, participants, messages)
-- ============================================================
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vision conversations si participant" 
ON public.conversations FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid()) OR is_admin());

CREATE POLICY "Vision participants de ses conversations" 
ON public.conversation_participants FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()) OR is_admin());

CREATE POLICY "Vision messages si participant" 
ON public.messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()) OR is_admin());

CREATE POLICY "Envoi message si participant" 
ON public.messages FOR INSERT 
WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));

-- ============================================================
-- 5. RECRUTEMENT (job_offers, job_applications)
-- ============================================================
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Offres publiques" ON public.job_offers FOR SELECT USING (true);
CREATE POLICY "Gestion offres (Entreprise)" ON public.job_offers FOR ALL USING (auth.uid() = company_id OR is_admin());

CREATE POLICY "Vision candidatures (Candidat ou Entreprise)" 
ON public.job_applications FOR SELECT 
USING (
    candidate_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.job_offers jo WHERE jo.id = job_id AND jo.company_id = auth.uid())
    OR is_admin()
);

CREATE POLICY "Postuler (Auth)" 
ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Gestion candidatures (Propriétaires)" 
ON public.job_applications FOR UPDATE USING (
    candidate_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.job_offers jo WHERE jo.id = job_id AND jo.company_id = auth.uid())
    OR is_admin()
);

-- ============================================================
-- 6. STORAGE (Bucket applications-docs)
-- ============================================================
-- Note: À appliquer dans la console Storage policies
-- CREATE POLICY "Auteur peut upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'applications-docs' AND (auth.uid())::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Public peut lire docs" ON storage.objects FOR SELECT TO public USING (bucket_id = 'applications-docs');
