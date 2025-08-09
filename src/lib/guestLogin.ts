import { supabase } from './supabaseClient';
import { ROLES } from './types';

export const loginAsGuest = async () => {
  try {
    // Create anonymous guest session
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error('Anonymous sign-in error:', error);
      return { error };
    }

    if (!data?.user) {
      return { error: new Error('No user data returned from anonymous sign-in') };
    }

    // Create guest profile with GUEST role using upsert for idempotency
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        email: `guest-${data.user.id}@example.com`,
        full_name: 'Guest User',
        role: ROLES.GUEST,
      }, { onConflict: 'id' });

    if (profileError) {
      console.error('Error creating guest profile:', profileError);
      // Manually sign out the anonymous user if profile creation fails
      await supabase.auth.signOut();
      return { error: new Error('Failed to create guest user profile. Please try again.') };
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
  } catch (error) {
    console.error('Error during guest login:', error);
    await supabase.auth.signOut(); // Clean up on error
    return { error: error as Error };
  }
};