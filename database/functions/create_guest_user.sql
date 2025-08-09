-- database/functions/create_guest_user.sql

-- Drop the function if it already exists to ensure a clean setup
DROP FUNCTION IF EXISTS public.create_guest_user(user_id UUID);

-- This function creates a profile for a newly created guest user.
-- It's designed to be called after an anonymous user is created on the frontend.
CREATE OR REPLACE FUNCTION public.create_guest_user(user_id UUID)
RETURNS TABLE(
  id UUID,
  role TEXT,
  email TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    INSERT INTO public.users (id, full_name, role, email)
    VALUES (user_id, 'Guest User', 'GUEST', 'guest-' || user_id::text || '@example.com')
    RETURNING id, role, email;
$$;