-- database/functions/create_guest_user.sql

-- Drop the function if it already exists to ensure a clean setup
DROP FUNCTION IF EXISTS public.create_guest_user();

-- This function creates a profile for a newly authenticated guest user.
-- It fetches the user ID directly from the session, enhancing security.
CREATE OR REPLACE FUNCTION public.create_guest_user()
RETURNS TABLE(
  id UUID,
  role TEXT,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    guest_id UUID := auth.uid();
    guest_email TEXT := 'guest-' || guest_id::text || '@example.com';
BEGIN
    INSERT INTO users (id, full_name, role, email)
    VALUES (guest_id, 'Guest User', 'GUEST', guest_email);

    RETURN QUERY
    SELECT u.id, u.role, u.email
    FROM users u
    WHERE u.id = guest_id;
END;
$$;