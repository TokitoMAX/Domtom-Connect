-- Migration: Refine RLS on showcase_items to allow status updates for all profiles
-- Allows experts, companies, and spectators/spectateurs to write status updates (category = 'status')
-- while restricting service/product creation to experts only.

-- Drop legacy catch-all policy
DROP POLICY IF EXISTS "Owners can manage their items" ON showcase_items;

-- 1. Policy for status updates: any user can insert/update/delete their own status updates
CREATE POLICY "Users can manage their own status updates" ON showcase_items
    FOR ALL
    USING (auth.uid() = user_id AND category = 'status')
    WITH CHECK (auth.uid() = user_id AND category = 'status');

-- 2. Policy for services & products: only expert accounts can insert/update/delete services/products
CREATE POLICY "Experts can manage their showcase services" ON showcase_items
    FOR ALL
    USING (
        auth.uid() = user_id 
        AND (
            category = 'status' 
            OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'expert'
        )
    )
    WITH CHECK (
        auth.uid() = user_id 
        AND (
            category = 'status' 
            OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'expert'
        )
    );

-- 3. Ensure public can read active items of any category
DROP POLICY IF EXISTS "Public can read active items" ON showcase_items;
CREATE POLICY "Public can read active items" ON showcase_items
    FOR SELECT USING (status = 'active');
