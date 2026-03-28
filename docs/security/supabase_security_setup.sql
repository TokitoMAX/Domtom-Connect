-- Script de sécurisation Supabase RLS pour Domtom Connect
-- Ce script active RLS et définit les politiques d'accès pour les tables critiques.

-- 1. Table : profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Les profils sont lisibles par tout le monde (pour l'annuaire)
CREATE POLICY "Les profils sont publics" 
ON public.profiles FOR SELECT 
USING (true);

-- Seul le propriétaire peut modifier son profil
CREATE POLICY "Les utilisateurs modifient leur propre profil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 2. Table : projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Les projets sont lisibles par tout le monde s'ils sont listés
CREATE POLICY "Les projets listés sont publics" 
ON public.projects FOR SELECT 
USING (is_listed = true);

-- Le propriétaire peut tout faire sur ses propres projets
CREATE POLICY "Les propriétaires gèrent leurs projets" 
ON public.projects FOR ALL 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- 3. Table : events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les événements sont publics" 
ON public.events FOR SELECT 
USING (true);

CREATE POLICY "Les organisateurs gèrent leurs événements" 
ON public.events FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Fonction de suppression de compte (optionnelle mais recommandée)
-- À exécuter dans la console SQL pour permettre DELETE FROM profiles/projects
-- puis trigger sur auth.users si nécessaire.
