-- Script de sécurisation Supabase RLS pour Domtom Connect
-- Ce script active RLS et définit les politiques d'accès pour les tables critiques.

-- ============================================================
-- 0. FONCTIONS UTILES (SECURITY DEFINER pour éviter les récursions)
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

-- Fonction pour vérifier si un utilisateur participe à une conversation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = conv_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 1. PROFILS (public.profiles)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profils publics" ON public.profiles;
CREATE POLICY "Profils publics" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Modif propre profil" ON public.profiles;
CREATE POLICY "Modif propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 2. PROJETS & SUIVI (projects, rewards, milestones)
-- ============================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projets publics si listés" ON public.projects;
CREATE POLICY "Projets publics si listés" ON public.projects FOR SELECT USING (is_listed = true OR auth.uid() = owner_id OR is_admin());

DROP POLICY IF EXISTS "Gestion projets (Propriétaire)" ON public.projects;
CREATE POLICY "Gestion projets (Propriétaire)" ON public.projects FOR ALL USING (auth.uid() = owner_id OR is_admin());

-- Rewards & Milestones
DROP POLICY IF EXISTS "Vision rewards/milestones" ON public.project_rewards;
CREATE POLICY "Vision rewards/milestones" ON public.project_rewards FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (is_listed = true OR owner_id = auth.uid() OR is_admin())));

DROP POLICY IF EXISTS "Gestion rewards/milestones (Propriétaire)" ON public.project_rewards;
CREATE POLICY "Gestion rewards/milestones (Propriétaire)" ON public.project_rewards FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (owner_id = auth.uid() OR is_admin())));

DROP POLICY IF EXISTS "Vision milestones" ON public.project_milestones;
CREATE POLICY "Vision milestones" ON public.project_milestones FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (is_listed = true OR owner_id = auth.uid() OR is_admin())));

DROP POLICY IF EXISTS "Gestion milestones (Propriétaire)" ON public.project_milestones;
CREATE POLICY "Gestion milestones (Propriétaire)" ON public.project_milestones FOR ALL USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (owner_id = auth.uid() OR is_admin())));

-- ============================================================
-- 3. ÉVÉNEMENTS & BILLETS (events, tickets)
-- ============================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Events publics" ON public.events;
CREATE POLICY "Events publics" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestion events (Organisateur)" ON public.events;
CREATE POLICY "Gestion events (Organisateur)" ON public.events FOR ALL USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Vision tickets (Acheteur ou Organisateur)" ON public.tickets;
CREATE POLICY "Vision tickets (Acheteur ou Organisateur)" ON public.tickets FOR SELECT USING (buyer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()) OR is_admin());

DROP POLICY IF EXISTS "Achat ticket (Auth)" ON public.tickets;
CREATE POLICY "Achat ticket (Auth)" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ============================================================
-- 4. MESSAGERIE (conversations, participants, messages)
-- ============================================================
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vision conversations si participant" ON public.conversations;
CREATE POLICY "Vision conversations si participant" ON public.conversations FOR SELECT USING (is_conversation_participant(id) OR is_admin());

DROP POLICY IF EXISTS "Vision participants de ses conversations" ON public.conversation_participants;
CREATE POLICY "Vision participants de ses conversations" ON public.conversation_participants FOR SELECT USING (user_id = auth.uid() OR is_conversation_participant(conversation_id) OR is_admin());

DROP POLICY IF EXISTS "Vision messages si participant" ON public.messages;
CREATE POLICY "Vision messages si participant" ON public.messages FOR SELECT USING (is_conversation_participant(conversation_id) OR is_admin());

DROP POLICY IF EXISTS "Envoi message si participant" ON public.messages;
CREATE POLICY "Envoi message si participant" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid() AND is_conversation_participant(conversation_id));

-- ============================================================
-- 5. RECRUTEMENT (job_offers, job_applications)
-- ============================================================
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Offres publiques" ON public.job_offers;
CREATE POLICY "Offres publiques" ON public.job_offers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestion offres (Entreprise)" ON public.job_offers;
CREATE POLICY "Gestion offres (Entreprise)" ON public.job_offers FOR ALL USING (auth.uid() = company_id OR is_admin());

DROP POLICY IF EXISTS "Vision candidatures (Candidat ou Entreprise)" ON public.job_applications;
CREATE POLICY "Vision candidatures (Candidat ou Entreprise)" ON public.job_applications FOR SELECT USING (candidate_id = auth.uid() OR EXISTS (SELECT 1 FROM public.job_offers jo WHERE jo.id = job_id AND jo.company_id = auth.uid()) OR is_admin());

DROP POLICY IF EXISTS "Postuler (Auth)" ON public.job_applications;
CREATE POLICY "Postuler (Auth)" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Gestion candidatures (Propriétaires)" ON public.job_applications;
CREATE POLICY "Gestion candidatures (Propriétaires)" ON public.job_applications FOR UPDATE USING (candidate_id = auth.uid() OR EXISTS (SELECT 1 FROM public.job_offers jo WHERE jo.id = job_id AND jo.company_id = auth.uid()) OR is_admin());
