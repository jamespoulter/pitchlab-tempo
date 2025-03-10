'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase-browser';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface StripeTestComponentProps {
  user: User;
  priceId: string;
  trialPeriodDays: number;
}

export default function StripeTestComponent({ user, priceId, trialPeriodDays }: StripeTestComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState(false);
  const [useTestFunction, setUseTestFunction] = useState(true);

  const supabase = createClient();

  // Handle checkout process
  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo({});

    try {
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
          return_url: `${window.location.origin}/dashboard`,
          trial_period_days: trialPeriodDays,
        }
      }));

      // Call the appropriate checkout function
      const functionName = useTestFunction ? 'stripe-test-checkout' : 'create-checkout';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          price_id: priceId,
          user_id: user.id,
          return_url: `${window.location.origin}/dashboard`,
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
          <input
            type="checkbox"
            id="useTestFunction"
            checked={useTestFunction}
            onChange={(e) => setUseTestFunction(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="useTestFunction" className="text-sm font-medium">
            Use test function (stripe-test-checkout)
          </label>
        </div>
        <p className="text-sm text-gray-500">
          {useTestFunction 
            ? "Using the enhanced test function with improved error handling and debugging." 
            : "Using the original create-checkout function."}
        </p>
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
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Checkout...
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
        
        {showDebug && Object.keys(debugInfo).length > 0 && (
          <div className="mt-4 bg-gray-50 border rounded-lg p-4 overflow-auto">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 