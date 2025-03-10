'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase-browser';

export default function StripeRedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'loading' | null>(null);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    // Check for Stripe redirect parameters
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    const verifySubscription = async () => {
      if (sessionId && success === 'true') {
        try {
          // Show loading state
          setAlertType('loading');
          setMessage('Verifying your subscription...');
          setShowAlert(true);
          
          // Get the current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            setAlertType('error');
            setMessage('User authentication error. Please sign in again.');
            setTimeout(() => {
              router.push('/sign-in?redirect_to=/dashboard');
            }, 3000);
            return;
          }
          
          // Wait a moment to allow webhook processing to complete
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check for active subscription
          const { data: subscriptions, error } = await supabase
            .from('subscriptions')
            .select('*')
            .or(`status.eq.active,status.eq.trialing`)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (error) {
            console.error('Error checking subscription:', error);
            setAlertType('error');
            setMessage('Error verifying your subscription. Please contact support.');
            return;
          }
          
          if (subscriptions && subscriptions.length > 0) {
            // Subscription is active
            setAlertType('success');
            setMessage('Your payment was successful! Your subscription is now active.');
            
            // Clean up the URL by removing query parameters
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            // Add a short delay before redirecting to ensure the user sees the success message
            setTimeout(() => {
              // Navigate to the dashboard
              router.push('/dashboard');
            }, 2000);
          } else {
            // No active subscription found yet, might be processing
            setAlertType('loading');
            setMessage('Your payment is being processed. This may take a moment...');
            
            // Try again in 5 seconds
            setTimeout(verifySubscription, 5000);
          }
        } catch (error) {
          console.error('Error in subscription verification:', error);
          setAlertType('error');
          setMessage('Error verifying your subscription. Please contact support.');
        }
      } else if (canceled === 'true') {
        // Handle canceled payment
        setAlertType('error');
        setMessage('Your payment was canceled. If you need help, please contact support.');
        setShowAlert(true);
        
        // Clean up the URL by removing query parameters after a short delay
        setTimeout(() => {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          // Redirect to pricing page after a short delay
          setTimeout(() => {
            router.push('/pricing?redirect_to=/dashboard');
          }, 3000);
        }, 1000);
      }
    };

    if (sessionId || canceled === 'true') {
      verifySubscription();
    }
  }, [searchParams, supabase, router]);

  // Hide the alert after 15 seconds for success/error messages
  useEffect(() => {
    if (showAlert && alertType !== 'loading') {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [showAlert, alertType]);

  if (!showAlert) return null;

  return (
    <Alert 
      className={`mb-6 ${
        alertType === 'success' ? 'border-green-500 bg-green-50' : 
        alertType === 'error' ? 'border-red-500 bg-red-50' : 
        'border-blue-500 bg-blue-50'
      }`}
    >
      <div className="flex items-start">
        {alertType === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
        ) : alertType === 'error' ? (
          <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
        ) : (
          <Loader2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5 animate-spin" />
        )}
        <div>
          <AlertTitle className={
            alertType === 'success' ? 'text-green-800' : 
            alertType === 'error' ? 'text-red-800' : 
            'text-blue-800'
          }>
            {alertType === 'success' ? 'Payment Successful' : 
             alertType === 'error' ? 'Payment Issue' : 
             'Processing Payment'}
          </AlertTitle>
          <AlertDescription className={
            alertType === 'success' ? 'text-green-700' : 
            alertType === 'error' ? 'text-red-700' : 
            'text-blue-700'
          }>
            {message}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
} 