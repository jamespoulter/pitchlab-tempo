-- Fix Google OAuth user creation
-- This migration updates the handle_new_user function to better handle Google OAuth users

-- Update the function to handle Google OAuth users better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  name_value TEXT;
  full_name_value TEXT;
  avatar_url_value TEXT;
BEGIN
  -- Extract name from user metadata
  IF NEW.raw_user_meta_data->>'name' IS NOT NULL THEN
    name_value := NEW.raw_user_meta_data->>'name';
  ELSIF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    name_value := NEW.raw_user_meta_data->>'full_name';
  ELSE
    name_value := split_part(NEW.email, '@', 1);
  END IF;

  -- Extract full_name from user metadata
  IF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    full_name_value := NEW.raw_user_meta_data->>'full_name';
  ELSIF NEW.raw_user_meta_data->>'name' IS NOT NULL THEN
    full_name_value := NEW.raw_user_meta_data->>'name';
  ELSE
    full_name_value := split_part(NEW.email, '@', 1);
  END IF;

  -- Extract avatar_url from user metadata
  IF NEW.raw_user_meta_data->>'avatar_url' IS NOT NULL THEN
    avatar_url_value := NEW.raw_user_meta_data->>'avatar_url';
  ELSIF NEW.raw_user_meta_data->>'picture' IS NOT NULL THEN
    avatar_url_value := NEW.raw_user_meta_data->>'picture';
  ELSE
    avatar_url_value := NULL;
  END IF;

  -- First check if the user already exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    -- Insert the new user
    INSERT INTO public.users (
      id,
      user_id,
      email,
      name,
      full_name,
      avatar_url,
      token_identifier,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.id::text,
      NEW.email,
      name_value,
      full_name_value,
      avatar_url_value,
      NEW.email,
      NEW.created_at,
      NEW.updated_at
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- No need to recreate the trigger as it already exists
-- Just add a comment to explain what this migration does
COMMENT ON FUNCTION public.handle_new_user() IS 'This function creates a new user record in the public.users table when a new user is created in auth.users. It handles different metadata formats from various OAuth providers.'; 