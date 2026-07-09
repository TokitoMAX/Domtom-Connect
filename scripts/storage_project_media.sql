-- Create a public bucket for project media (covers, rewards, etc.)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow anyone to view
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'project-media' );

-- Policy: Allow authenticated users to upload to their own project folders
-- Note: We use a simple authenticated check for now, 
-- or more granularly by checking if it's their folder.
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
    bucket_id = 'project-media' 
    AND auth.role() = 'authenticated'
);

-- Policy: Allow owners to delete their own media
CREATE POLICY "Owner Delete" 
ON storage.objects FOR DELETE 
USING ( 
    bucket_id = 'project-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
