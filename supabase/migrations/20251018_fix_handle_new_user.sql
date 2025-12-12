-- Migration: Robust replacement for handle_new_user trigger
-- Date: 2025-10-18
-- Purpose: Ensure signup in auth.users does not fail when auxiliary writes to
-- public.users or public.user_credits encounter RLS/constraint issues. The
-- function runs as SECURITY DEFINER and traps exceptions, logging them but
-- returning NEW so the auth signup is not blocked by DB-side errors.

-- Drop the old trigger/function if present (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert a minimal public.users row (do not fail on error)
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email);

  -- Ensure a user_credits row exists
  INSERT INTO public.user_credits (user_id, credits, total_earned, total_spent)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error server-side but do not propagate it to the auth flow.
  -- This prevents 'Database error saving new user' errors returned by GoTrue
  -- when the auxiliary writes fail due to RLS, constraints, or other issues.
  RAISE LOG 'public.handle_new_user suppressed error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to ensure the new function is used
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
