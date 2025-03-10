'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase-browser';
import { toast } from 'react-hot-toast';

interface Plan {
    id: string;
    name: string;
    amount: number;
    interval: string;
    popular?: boolean;
    product?: {
        id?: string;
        name?: string;
        metadata?: {
            features?: string;
            description?: string;
            trial_period_days?: string;
            popular?: string;
        }
    }
}

export default function PricingButton({ item, user }: { item: Plan, user: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect_to') || '/dashboard';
    
    const handleClick = async () => {
        setIsLoading(true);
        
        if (!user) {
            // If user is not logged in, redirect to sign-up with plan info
            const params = new URLSearchParams();
            params.set('plan', item.id);
            params.set('trial', item.product?.metadata?.trial_period_days || '7');
            params.set('redirect_to', redirectTo);
            
            router.push(`/sign-up?${params.toString()}`);
            return;
        }
        
        try {
            // User is logged in, create checkout session
            const supabase = createClient();
            
            // Ensure the return URL is properly formatted
            // We want to make sure we're redirecting to the dashboard with the session_id parameter
            const origin = window.location.origin;
            const returnUrl = `${origin}/dashboard`;
            
            console.log('Creating checkout session with return URL:', returnUrl);
            
            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: {
                    price_id: item.id,
                    user_id: user.id,
                    return_url: returnUrl,
                    trial_period_days: item.product?.metadata?.trial_period_days || '7',
                },
                headers: {
                    'X-Customer-Email': user.email || '',
                }
            });
            
            if (error) {
                console.error('Error creating checkout session:', error);
                toast.error('Failed to create checkout session');
                setIsLoading(false);
                return;
            }
            
            if (data?.url) {
                // Redirect to Stripe checkout
                window.location.href = data.url;
            } else {
                toast.error('No checkout URL returned');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred');
            setIsLoading(false);
        }
    };
    
    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                isLoading 
                    ? 'bg-blue-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
            {isLoading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            ) : user ? (
                `Get Started with ${item.product?.name || 'Premium'}`
            ) : (
                `Sign Up & Start Free Trial`
            )}
        </button>
    );
}