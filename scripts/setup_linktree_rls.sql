-- Migration: Allow all users to manage their own 'linktree' items
DROP POLICY IF EXISTS "Users can manage their own linktree items" ON showcase_items;

CREATE POLICY "Users can manage their own linktree items" ON showcase_items
    FOR ALL
    USING (auth.uid() = user_id AND category = 'linktree')
    WITH CHECK (auth.uid() = user_id AND category = 'linktree');
