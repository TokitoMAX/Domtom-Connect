-- ============================================================
-- migration: Add title column to conversations for DTC Sas Project Chats
-- Run this in the Supabase SQL Editor
-- ============================================================

ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS title TEXT;

COMMENT ON COLUMN public.conversations.title IS 'Le titre de la conversation (ex: Sas - Mon Projet) pour les canaux de projet.';
