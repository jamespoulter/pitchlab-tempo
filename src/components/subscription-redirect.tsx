'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase-browser';
import { useAuth } from './providers/supabase-auth-provider';

export default function SubscriptionRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  useEffect(() => {
    // Only run on the pricing page
    if (pathname !== '/pricing') return;
    
    const checkSubscriptionAndRedirect = async () => {
      if (!user || authLoading) return;
      
      setIsCheckingSubscription(true);
      try {
        const supabase = createClient();
        
        // Check for active subscriptions
        const { data: activeSubscriptions, error: activeError } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active');

        // Check for trialing subscriptions
        const { data: trialingSubscriptions, error: trialingError } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'trialing');

        // If we have any active or trialing subscriptions, redirect to dashboard or specified redirect URL
        const hasSubscription = 
          (activeSubscriptions && activeSubscriptions.length > 0) || 
          (trialingSubscriptions && trialingSubscriptions.length > 0);
        
        if (hasSubscription) {
          // Get the redirect_to parameter or default to dashboard
          const redirectTo = searchParams.get('redirect_to') || '/dashboard';
          console.log('User has active subscription, redirecting to:', redirectTo);
          
          // Add a small delay to ensure the UI has time to update
          setTimeout(() => {
            router.push(redirectTo);
          }, 500);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    // Add a small delay to ensure auth state is fully loaded
    const timer = setTimeout(() => {
      checkSubscriptionAndRedirect();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, authLoading, pathname, router, searchParams]);

  // This component doesn't render anything
  return null;
} 