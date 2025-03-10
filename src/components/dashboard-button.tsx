'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase-browser';
import { useAuth } from './providers/supabase-auth-provider';

export default function DashboardButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  // Check if the user has an active subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;
      
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

        // If we have any active or trialing subscriptions, set hasSubscription to true
        setHasSubscription(
          (activeSubscriptions && activeSubscriptions.length > 0) || 
          (trialingSubscriptions && trialingSubscriptions.length > 0)
        );
      } catch (error) {
        console.error('Error checking subscription status:', error);
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    if (user) {
      checkSubscription();
    }
  }, [user]);

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        // If the user is logged in, navigate to the dashboard
        router.push('/dashboard');
      } else {
        // If the user is not logged in, redirect to sign-in with a redirect_to parameter
        router.push('/sign-in?redirect_to=/dashboard');
      }
    } catch (error) {
      console.error('Error navigating to dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || authLoading}
      className={className}
    >
      {isLoading ? "Loading..." : "Dashboard"}
    </Button>
  );
} 