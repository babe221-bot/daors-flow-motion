import { supabase } from './supabaseClient';
import { ROLES } from './types';

export const loginAsGuest = async () => {
  try {
    console.log('Starting guest login process...');
    
    // Create anonymous guest session
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error('Anonymous sign-in error:', error);
      return { error };
    }

    if (!data?.user) {
      console.error('No user data returned from anonymous sign-in');
      return { error: new Error('No user data returned from anonymous sign-in') };
    }

    console.log('Anonymous sign-in successful, creating guest profile...');
    
    // Create a user object regardless of database success
    const guestUser = {
      id: data.user.id,
      username: 'Guest',
      role: ROLES.GUEST,
      avatarUrl: undefined,
      associatedItemIds: []
    };
    
    try {
      // Attempt to create guest profile with GUEST role, but continue even if it fails
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: `guest-${data.user.id}@example.com`,
          full_name: 'Guest User',
          role: ROLES.GUEST,
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Error creating guest profile in database:', profileError);
        // Continue with guest login even if profile creation fails
        console.log('Continuing with guest login despite profile error');
      } else {
        console.log('Guest profile created successfully');
      }
    } catch (profileError) {
      // Log the error but don't fail the guest login
      console.error('Exception during profile creation:', profileError);
      console.log('Continuing with guest login despite profile error');
    }

    // Return user even if profile creation failed
    return {
      user: guestUser,
      error: null
    };
  } catch (error) {
    console.error('Error during guest login:', error);
    try {
      await supabase.auth.signOut(); // Clean up on error
    } catch (signOutError) {
      console.error('Error during sign out cleanup:', signOutError);
    }
    return { error: error as Error };
  }
};