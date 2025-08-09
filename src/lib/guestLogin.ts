import { supabase } from './supabaseClient';
import { ROLES } from './types';

export const loginAsGuest = async () => {
  try {
    console.log('Starting guest login process...');
    
    // 1. Create anonymous guest session
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

    if (authError) {
      console.error('Anonymous sign-in error:', authError);
      return { error: authError };
    }

    if (!authData?.user) {
      const noUserError = new Error('No user data returned from anonymous sign-in');
      console.error(noUserError.message);
      return { error: noUserError };
    }

    console.log('Anonymous sign-in successful, creating guest profile via RPC...');
    
    // 2. Create the guest profile by calling the PostgreSQL function
    const { data: profileData, error: rpcError } = await supabase.rpc('create_guest_user', {
      user_id: authData.user.id,
    });

    if (rpcError) {
      console.error('Error creating guest profile via RPC:', rpcError);
      // Clean up the created anonymous user if profile creation fails
      await supabase.auth.signOut();
      return { error: rpcError };
    }

    // The RPC function returns an array, so we take the first element.
    const userProfile = profileData?.[0];

    if (!userProfile) {
        const noProfileError = new Error('Guest profile creation failed: No data returned from RPC.');
        console.error(noProfileError.message);
        await supabase.auth.signOut();
        return { error: noProfileError };
    }

    console.log('Guest profile created successfully via RPC.');
    
    // 3. Return a consolidated user object
    return {
      user: {
        id: userProfile.id,
        role: userProfile.role,
        email: userProfile.email,
        username: 'Guest',
        avatarUrl: undefined,
        associatedItemIds: []
      },
      error: null
    };
  } catch (error) {
    console.error('Error during guest login:', error);
    // Attempt to sign out to clean up any partial state
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Error during sign out cleanup:', signOutError);
    }
    return { error: error instanceof Error ? error : new Error('An unexpected error occurred') };
  }
};