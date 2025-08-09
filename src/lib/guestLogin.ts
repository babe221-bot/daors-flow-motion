import { supabase } from './supabaseClient';

/**
 * Handles the complete guest login flow securely and transactionally.
 * 1. Signs in the user anonymously using the standard Supabase method.
 * 2. Calls a secure RPC function (`create_guest_user`) to create the user's profile.
 * 3. Handles errors and session management correctly.
 *
 * This implementation is robust and uses the recommended Supabase flow for guest users.
 */
export const loginAsGuest = async () => {
  try {
    console.log('Starting guest login flow...');

    // 1. Sign in anonymously. This is the correct and standard method.
    const { data, error: authError } = await supabase.auth.signInAnonymously();

    if (authError || !data.user) {
      console.error('Error during anonymous sign-in:', authError?.message || 'No user object returned.');
      return { user: null, session: null, error: authError || new Error('Failed to sign in anonymously.') };
    }

    const { user, session } = data;
    console.log(`Anonymous user created successfully. User ID: ${user.id}`);

    // 2. Call the secure RPC function to create the guest profile.
    const { data: profile, error: rpcError } = await supabase.rpc('create_guest_user');

    if (rpcError || !profile) {
      console.error('Error creating guest profile via RPC:', rpcError?.message || 'No profile data returned.');
      // Clean up the user if profile creation fails.
      await supabase.auth.signOut();
      return { user: null, session: null, error: rpcError || new Error('Guest profile creation failed.') };
    }

    console.log('Guest profile created and verified successfully.');

    // 3. Return the user, session, and a simplified profile object.
    const userProfile = Array.isArray(profile) ? profile[0] : profile;

    return {
      user: {
        id: userProfile.id,
        role: userProfile.role,
        email: userProfile.email,
      },
      session,
      error: null,
    };
  } catch (error) {
    console.error('An unexpected error occurred during the guest login process:', error);
    // Ensure we are signed out in case of any unexpected errors.
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Error during sign-out cleanup:', signOutError);
    }
    
    return { 
      user: null, 
      session: null, 
      error: error instanceof Error ? error : new Error('An unexpected error occurred.') 
    };
  }
};