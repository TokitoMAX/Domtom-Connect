-- Ajouter les champs pour le tracking (Google Analytics et Facebook Pixel)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ga_id VARCHAR(255);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fb_pixel_id VARCHAR(255);
