import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Checks if a user has an active or trialing subscription
 * @param supabase Supabase client
 * @param userId User ID to check
 * @returns Boolean indicating if the user has an active subscription
 */
export async function hasActiveSubscription(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    // Check for active subscriptions
    const { data: activeSubscriptions, error: activeError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active');

    // Check for trialing subscriptions
    const { data: trialingSubscriptions, error: trialingError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'trialing');

    // If we have any active or trialing subscriptions, return true
    return (
      (activeSubscriptions && activeSubscriptions.length > 0) || 
      (trialingSubscriptions && trialingSubscriptions.length > 0)
    );
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
} 