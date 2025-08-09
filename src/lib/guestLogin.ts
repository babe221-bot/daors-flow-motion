import { supabase } from './supabaseClient';
import { ROLES } from './types';

export const loginAsGuest = async () => {
  try {
    // Create anonymous guest session
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      return { error };
    }

    if (data?.user) {
      // Create guest profile with GUEST role
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: `guest-${data.user.id}@example.com`,
          full_name: 'Guest User',
          role: ROLES.GUEST,
        });

      if (profileError) {
        console.error('Error creating guest profile:', profileError);
        // Manually sign out the anonymous user if profile creation fails
        await supabase.auth.signOut();
        return { error: new Error('Failed to create guest user profile. Please contact support.') };
      }

      return {
        user: {
          id: data.user.id,
          username: 'Guest',
          role: ROLES.GUEST,
          avatarUrl: undefined,
          associatedItemIds: []
        },
        error: null
      };
    }

    return { error: new Error('Failed to create guest session') };
  } catch (error) {
    console.error('Error during guest login:', error);
    return { error: error as Error };
  }
};