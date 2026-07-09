-- Script a executer dans le SQL Editor de Supabase pour le SaaS DomtomConnect

-- Creation de la table pour les candidatures au programme
CREATE TABLE IF NOT EXISTS program_applications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name text NOT NULL,
  project_stage text NOT NULL,
  pitch text NOT NULL,
  needs text NOT NULL,
  status text DEFAULT 'pending', -- pending, accepted, rejected
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activation du Row Level Security (RLS) optionnelle mais recommandee
ALTER TABLE program_applications ENABLE ROW LEVEL SECURITY;

-- Politique pour que l'utilisateur puisse inserer sa propre candidature
CREATE POLICY "Users can insert their own application" 
ON program_applications FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Politique pour que l'utilisateur puisse voir sa propre candidature
CREATE POLICY "Users can view their own application" 
ON program_applications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
