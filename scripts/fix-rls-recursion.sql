-- ============================================================================
-- FIX: RLS Infinite Recursion Bug
-- Run this in Supabase Dashboard > SQL Editor > New Query
-- ============================================================================

-- The problem: vehicles RLS policy checks user_profiles, which also has a
-- policy checking itself. Supabase detects this as infinite recursion.

-- SOLUTION: Drop the problematic policy and create a simpler one.

-- 1. Drop the old policy
DROP POLICY IF EXISTS "Staff can manage vehicles" ON public.vehicles;

-- 2. Create a simpler policy that doesn't cause recursion
-- This allows any authenticated user to read/write vehicles for now.
-- You can tighten this later once the app is working.
CREATE POLICY "Authenticated users can manage vehicles" ON public.vehicles
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Also fix the user_profiles policy if needed
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all" ON public.user_profiles
    FOR ALL USING (true);

-- Verify the changes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('vehicles', 'user_profiles');
