'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase-browser';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface StripeDebugComponentProps {
  user: User;
  priceId: string;
  trialPeriodDays: number | string;
}

export default function StripeDebugComponent({ user, priceId, trialPeriodDays }: StripeDebugComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  
  const supabase = createClient();

  // Test direct function invocation
  const testDirectInvocation = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setRawResponse(null);

    try {
      console.log("Testing direct function invocation with:", {
        price_id: priceId,
        user_id: user.id,
        trial_period_days: trialPeriodDays
      });

      const { data, error: functionError } = await supabase.functions.invoke('create-checkout', {
        body: {
          price_id: priceId,
          user_id: user.id,
          return_url: `${window.location.origin}/dashboard`,
          trial_period_days: Number(trialPeriodDays),
        },
        headers: {
          'X-Customer-Email': user.email || '',
        }
      });

      // Store the raw response for debugging
      setRawResponse(JSON.stringify({ data, error: functionError }, null, 2));

      if (functionError) {
        console.error("Function error:", functionError);
        setError(`Error: ${functionError.message || 'Unknown error'}`);
        return;
      }

      console.log("Function response:", data);
      setResponse(data);
    } catch (error: any) {
      console.error('Error invoking function:', error);
      setError(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Test fetch API directly
  const testFetchAPI = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setRawResponse(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL or anon key is missing');
      }

      const payload = {
        price_id: priceId,
        user_id: user.id,
        return_url: `${window.location.origin}/dashboard`,
        trial_period_days: Number(trialPeriodDays),
      };

      console.log("Testing fetch API with:", payload);

      const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'X-Customer-Email': user.email || '',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      setRawResponse(responseText);

      try {
        const responseData = JSON.parse(responseText);
        setResponse(responseData);
        
        if (!response.ok) {
          setError(`HTTP Error: ${response.status} ${response.statusText}`);
        }
      } catch (parseError) {
        setError(`Failed to parse response: ${responseText}`);
      }
    } catch (error: any) {
      console.error('Error with fetch API:', error);
      setError(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="font-medium mb-4">Debug Tools</h3>
        
        <div className="space-y-4">
          <div>
            <Button
              onClick={testDirectInvocation}
              disabled={isLoading}
              className="mr-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Supabase Client'
              )}
            </Button>
            
            <Button
              onClick={testFetchAPI}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Fetch API'
              )}
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Error</h4>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {response && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Success Response</h4>
              <pre className="text-xs overflow-auto p-2 bg-white rounded border">
                {JSON.stringify(response, null, 2)}
              </pre>
              
              {response.url && (
                <div className="mt-4">
                  <Button
                    onClick={() => window.open(response.url, '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Open Checkout URL
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {rawResponse && (
            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="font-medium mb-2">Raw Response</h4>
              <pre className="text-xs overflow-auto p-2 bg-white rounded border">
                {rawResponse}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips</h3>
        <ul className="list-disc pl-5 space-y-2 text-yellow-700">
          <li>Check that your Stripe API key is correctly set in the Edge Function environment</li>
          <li>Verify that the price ID exists in your Stripe account</li>
          <li>Make sure the Edge Function has the necessary permissions</li>
          <li>Check the Edge Function logs in the Supabase Dashboard for detailed error messages</li>
        </ul>
      </div>
    </div>
  );
} 