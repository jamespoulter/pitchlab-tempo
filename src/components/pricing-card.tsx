"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "./ui/card";
import { createClient } from "@/utils/supabase-browser";
import { Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "./providers/supabase-auth-provider";

interface PlanFeature {
    name: string;
    included: boolean;
}

export default function PricingCard({ 
    item, 
    user: propUser, 
    buttonOnly = false 
}: {
    item: any,
    user: User | null,
    buttonOnly?: boolean
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Use the auth context for consistent user information
    const { user: contextUser, session } = useAuth();
    
    // Use the user from props if provided, otherwise use the user from context
    const user = propUser || contextUser;
    
    // Debug the item data and user
    useEffect(() => {
        console.log("PricingCard item:", item);
        console.log("PricingCard user:", user);
        console.log("PricingCard session:", session);
    }, [item, user, session]);

    // Extract features from plan metadata or product metadata
    const features: PlanFeature[] = item?.product?.metadata?.features 
        ? JSON.parse(item.product.metadata.features) 
        : [
            { name: "Unlimited Pitches", included: true },
            { name: "AI-Powered Content", included: true },
            { name: "Custom Branding", included: true },
            { name: "Team Collaboration", included: true }
        ];

    // Format the amount with currency
    const formatAmount = (amount: number | null | undefined, currency: string = 'GBP') => {
        const safeAmount = amount ?? 4500;
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(safeAmount / 100);
    };

    // Get the site URL based on environment
    const getSiteUrl = () => {
        const isProd = process.env.NODE_ENV === 'production';
        return isProd 
            ? 'https://www.pitchhub.agency' 
            : window.location.origin;
    };

    const handleCheckout = async (priceId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Starting checkout process for price ID:", priceId);
            console.log("Current user:", user);
            console.log("Current URL:", window.location.href);
            
            // Validate the price ID - don't use 'price_default'
            if (priceId === 'price_default') {
                console.error("Invalid price ID: price_default");
                setError("Invalid price ID. Please contact support.");
                setIsLoading(false);
                return;
            }

            // Get trial period days from metadata if available
            const trialPeriodDays = item?.product?.metadata?.trial_period_days 
                ? parseInt(item.product.metadata.trial_period_days, 10) 
                : 7;
            
            console.log("Creating checkout session with:", {
                price_id: priceId,
                user_id: user?.id || null,
                trial_period_days: trialPeriodDays
            });
            
            // Check if user is logged in
            if (!user) {
                console.log("User not logged in, redirecting to sign-up");
                // User is not logged in, redirect to signup with plan info
                localStorage.setItem('selectedPlanId', priceId);
                localStorage.setItem('trialPeriodDays', trialPeriodDays.toString());
                
                // Use the correct domain based on environment
                const siteUrl = getSiteUrl();
                console.log("Site URL for redirect:", siteUrl);
                
                // Check if we're already on the sign-up page with a plan parameter
                const urlParams = new URLSearchParams(window.location.search);
                const urlPlanId = urlParams.get('plan');
                console.log("URL params:", Object.fromEntries(urlParams.entries()));
                console.log("URL plan ID:", urlPlanId);
                
                // If we're already on the sign-up page with this plan, don't redirect again
                if (window.location.pathname.includes('/sign-up') && urlPlanId === priceId) {
                    console.log("Already on sign-up page with this plan, showing error message");
                    setError("Please complete the sign-up form above to continue.");
                    setIsLoading(false);
                    return;
                }
                
                const redirectUrl = `${siteUrl}/sign-up?plan=${priceId}&trial=${trialPeriodDays}&redirect_to=/pricing`;
                console.log("Redirecting to:", redirectUrl);
                window.location.href = redirectUrl;
                return;
            }
            
            console.log("User is logged in, proceeding with checkout");
            // User is logged in, proceed with normal checkout
            const supabase = createClient();
            
            // Ensure we have a valid user ID
            if (!user.id) {
                console.error("User ID is missing");
                setError("User ID is missing. Please try logging in again.");
                setIsLoading(false);
                return;
            }
            
            // Get the site URL based on environment
            const siteUrl = getSiteUrl();
            console.log("Site URL for return URL:", siteUrl);
            
            // Create checkout payload with user ID in metadata
            const checkoutPayload = {
                price_id: priceId,
                user_id: user.id,
                return_url: `${siteUrl}/dashboard`,
                trial_period_days: trialPeriodDays,
                metadata: {
                    supabase_user_id: user.id,
                    user_email: user.email
                }
            };
            
            console.log("Sending checkout payload:", checkoutPayload);
            
            // Include the session token in the request if available
            const headers: Record<string, string> = {
                'X-Customer-Email': user.email || '',
            };
            
            if (session?.access_token) {
                console.log("Including access token in request");
                headers['Authorization'] = `Bearer ${session.access_token}`;
            } else {
                console.log("No access token available");
            }
            
            console.log("Invoking create-checkout function with headers:", headers);
            const { data, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
                body: checkoutPayload,
                headers
            });

            if (checkoutError) {
                console.error("Checkout error:", checkoutError);
                setError(`Error creating checkout: ${checkoutError.message}`);
                setIsLoading(false);
                return;
            }

            console.log("Checkout response:", data);

            // Redirect to Stripe checkout
            if (data?.url) {
                console.log("Redirecting to Stripe checkout URL:", data.url);
                window.location.href = data.url;
            } else {
                console.error("No checkout URL returned");
                setError('No checkout URL returned');
                setIsLoading(false);
            }
        } catch (error: any) {
            console.error('Error creating checkout session:', error);
            setError(error.message || 'An unknown error occurred');
            setIsLoading(false);
        }
    };

    // If item is null or undefined, return null
    if (!item) {
        return null;
    }

    // Get the top 3 features to highlight
    const topFeatures = features
        .filter(feature => feature.included)
        .slice(0, 3);

    // If buttonOnly is true, just render the button
    if (buttonOnly) {
        return (
            <button
                onClick={() => handleCheckout(item.id)}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base font-medium text-white shadow transition-colors disabled:opacity-50"
            >
                {isLoading ? "Processing..." : "Start Your Free Trial"}
            </button>
        );
    }

    return (
        <Card className="w-full relative overflow-hidden border-2 border-blue-500 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-30" />
            
            {/* Popular badge */}
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                Most Popular
            </div>
            
            <CardHeader className="relative pb-4">
                <div className="flex items-center mb-2">
                    <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                    <p className="text-blue-600 font-medium text-sm">7-DAY FREE TRIAL</p>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                    {item.product?.name || "PitchHub Premium"}
                </CardTitle>
                <CardDescription className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold text-gray-900">{formatAmount(item.amount, item.currency)}</span>
                    <span className="text-gray-600">/{item.interval || "month"}</span>
                </CardDescription>
                {item.product?.metadata?.description && (
                    <p className="mt-4 text-gray-600">{item.product.metadata.description}</p>
                )}
            </CardHeader>
            
            <CardContent className="relative pb-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-red-800 mb-2">Error</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">Top Features:</h4>
                    <ul className="space-y-2">
                        {topFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                                    <Check size={18} />
                                </div>
                                <span className="ml-3 font-medium text-blue-800">
                                    {feature.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-medium text-gray-700 mb-2">All Features:</h4>
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {features.filter(feature => feature.included).map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                                    <Check size={18} />
                                </div>
                                <span className="ml-3 text-sm text-gray-700">
                                    {feature.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            
            <CardFooter className="relative pt-2">
                <Button
                    onClick={() => handleCheckout(item.id)}
                    disabled={isLoading}
                    className="w-full py-6 text-lg font-medium bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading ? "Processing..." : "Start Your Free Trial"}
                </Button>
            </CardFooter>
        </Card>
    );
}