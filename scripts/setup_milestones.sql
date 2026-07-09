-- Create table for Project Milestones (Stretch Goals)
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    amount_threshold NUMERIC NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_reached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- Policy: Project owners can do anything with their milestones
CREATE POLICY "Project owners can manage their milestones"
ON public.project_milestones
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_milestones.project_id
        AND projects.owner_id = auth.uid()
    )
);

-- Policy: Everyone can view milestones
CREATE POLICY "Everyone can view milestones"
ON public.project_milestones
FOR SELECT
USING (true);

-- Trigger to auto-check milestones on contribution
-- (Optional: We can also do this real-time in the JS or via a cron/view)
-- A view is often easier for real-time progress.
