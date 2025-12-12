-- Migration: Add RLS policies for favorites and verify user_credits policies
-- Date: 2025-10-16

-- Ensure the favorites table exists (created in a previous migration)

-- Enable Row Level Security on favorites
ALTER TABLE IF EXISTS public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow idempotent re-apply
DROP POLICY IF EXISTS "Users can view their favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can create favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their favorites" ON public.favorites;

-- Create policies for favorites
CREATE POLICY "Users can view their favorites"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create favorites"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their favorites"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Safety: ensure public cannot read all favorites
-- (no policy for anon/select beyond what is defined above)

-- Verify or create user_credits policies (idempotent)
ALTER TABLE IF EXISTS public.user_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can insert their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;

CREATE POLICY "Users can view their own credits"
  ON public.user_credits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own credits"
  ON public.user_credits
  FOR INSERT
  TO public
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own credits"
  ON public.user_credits
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Indexes already exist in earlier migrations; nothing else to add here.

-- End of migration
