-- Add universal_reward column to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS universal_reward TEXT;

-- Update RLS if necessary (usually public.projects already has policies)
