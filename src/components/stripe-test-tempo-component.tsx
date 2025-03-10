'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase-browser';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';

interface StripeTestTempoComponentProps {
  user: User;
  priceId: string;
  trialPeriodDays: number;
}

export default function StripeTestTempoComponent({ user, priceId, trialPeriodDays }: StripeTestTempoComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeInstance, setStripeInstance] = useState<any>(null);

  const supabase = createClient();

  // Get the site URL based on environment
  const getSiteUrl = () => {
    const isProd = process.env.NODE_ENV === 'production';
    return isProd 
      ? 'https://www.pitchhub.agency' 
      : window.location.origin;
  };

  // Load Stripe.js manually with advanced fraud signals disabled
  useEffect(() => {
    // Only load Stripe once
    if (typeof window !== 'undefined' && !stripeLoaded) {
      const loadStripeWithoutFraudSignals = async () => {
        try {
          // Use dynamic import to get the pure version of Stripe.js
          const { loadStripe } = await import('@stripe/stripe-js/pure');
          
          // Disable advanced fraud signals
          loadStripe.setLoadParameters({ advancedFraudSignals: false });
          
          // Load Stripe with your publishable key
          const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
          const stripe = await loadStripe(stripeKey);
          
          setStripeInstance(stripe);
          setStripeLoaded(true);
          console.log('Stripe loaded with advanced fraud signals disabled');
        } catch (error) {
          console.error('Error loading Stripe:', error);
          setError('Failed to load Stripe. Please try again later.');
        }
      };

      loadStripeWithoutFraudSignals();
    }
  }, [stripeLoaded]);

  // Handle checkout process
  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo({});

    try {
      // Get the site URL based on environment
      const siteUrl = getSiteUrl();
      
      console.log("Creating checkout session with:", {
        price_id: priceId,
        user_id: user?.id,
        trial_period_days: trialPeriodDays
      });

      // Add debug info
      setDebugInfo(prev => ({
        ...prev,
        checkoutParams: {
          price_id: priceId,
          user_id: user?.id,
          return_url: `${siteUrl}/dashboard`,
          trial_period_days: trialPeriodDays,
        }
      }));

      // Call the stripe-test-checkout function
      const { data, error } = await supabase.functions.invoke('stripe-test-checkout', {
        body: {
          price_id: priceId,
          user_id: user.id,
          return_url: `${siteUrl}/dashboard`,
          trial_period_days: trialPeriodDays,
        },
        headers: {
          'X-Customer-Email': user.email || '',
        }
      });

      // Add response to debug info
      setDebugInfo(prev => ({
        ...prev,
        response: { data, error }
      }));

      if (error) {
        console.error("Checkout error:", error);
        setError(`Error: ${error.message || 'Unknown error'}`);
        throw error;
      }

      console.log("Checkout response:", data);

      // Store the checkout URL
      if (data?.url) {
        setCheckoutUrl(data.url);
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      setError(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to Stripe checkout when URL is available
  const redirectToCheckout = () => {
    if (checkoutUrl) {
      // Use window.location.href for a full page redirect
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className={`h-4 w-4 rounded-full ${stripeLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm font-medium">
            {stripeLoaded ? 'Stripe loaded with fraud signals disabled' : 'Loading Stripe...'}
          </span>
        </div>
      </div>

      {checkoutUrl ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Checkout URL Generated</h3>
            <p className="text-green-700 break-all mb-4">{checkoutUrl}</p>
            <button
              onClick={redirectToCheckout}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={isLoading || !stripeLoaded}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Checkout...
            </>
          ) : !stripeLoaded ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for Stripe...
            </>
          ) : (
            'Start Test Checkout'
          )}
        </button>
      )}

      <div className="mt-6">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-sm text-gray-500 underline"
        >
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
        
        {showDebug && (
          <div className="mt-4 bg-gray-50 border rounded-lg p-4 overflow-auto">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Stripe Status:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify({
                  stripeLoaded,
                  stripeInstanceAvailable: !!stripeInstance
                }, null, 2)}
              </pre>
            </div>
            {Object.keys(debugInfo).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Request/Response:</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 