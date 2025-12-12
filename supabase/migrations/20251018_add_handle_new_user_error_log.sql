-- Migration: Add persistent error logging for handle_new_user
-- Date: 2025-10-18

-- Create admin schema and error table for function errors
CREATE SCHEMA IF NOT EXISTS admin;

CREATE TABLE IF NOT EXISTS admin.function_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name TEXT NOT NULL,
  error_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Replace handle_new_user to insert errors into admin.function_errors on exception
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Minimal upsert into public.users
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
  -- Persist the error for debugging
  BEGIN
    INSERT INTO admin.function_errors (function_name, error_text)
    VALUES ('public.handle_new_user', SQLERRM);
  EXCEPTION WHEN OTHERS THEN
    -- If even the logging insert fails, fallback to RAISE LOG
    RAISE LOG 'public.handle_new_user error (logging failed): %', SQLERRM;
  END;

  -- Also emit a regular log for quick inspection
  RAISE LOG 'public.handle_new_user suppressed error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
