-- Add URL column to showcase_items if it doesn't exist
ALTER TABLE public.showcase_items ADD COLUMN IF NOT EXISTS url TEXT;

-- Drop price related columns to simplify (optional but good for cleanup)
-- We will keep description if they want to add a short text, but for Linktree, Title and URL is enough.
