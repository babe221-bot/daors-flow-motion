-- Create a test user for development
-- Run this after setting up the database schema

-- First, let's create the trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT'),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a test user manually (optional - you can also sign up through the UI)
-- Note: This creates a user in the public.users table only
-- You'll still need to sign up through the UI for auth.users
INSERT INTO public.users (id, email, full_name, role, created_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test User',
  'CLIENT',
  NOW()
) ON CONFLICT (email) DO NOTHING;