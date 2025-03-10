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
import { supabase } from "../../supabase/supabase";
import { Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface PlanFeature {
    name: string;
    included: boolean;
}

export default function PricingCard({ item, user }: {
    item: any,
    user: User | null
}) {
    const [isLoading, setIsLoading] = useState(false);
    
    // Debug the item data
    useEffect(() => {
        console.log("PricingCard item:", item);
    }, [item]);

    // Extract features from plan metadata or product metadata
    const features: PlanFeature[] = item?.product?.metadata?.features 
        ? JSON.parse(item.product.metadata.features) 
        : [
            { name: "Unlimited Pitches", included: true },
            { name: "AI-Powered Content", included: true },
            { name: "Custom Branding", included: true },
            { name: "Team Collaboration", included: true }
        ];

    // Format currency amount
    const formatAmount = (amount: number | null | undefined, currency: string = 'GBP') => {
        // Default to £45 if amount is null or undefined
        const safeAmount = amount ?? 4500;
        
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(safeAmount / 100);
    };

    // Handle checkout process
    const handleCheckout = async (priceId: string) => {
        setIsLoading(true);

        try {
            // Get trial period days from metadata if available
            const trialPeriodDays = item?.product?.metadata?.trial_period_days || 7;
            
            console.log("Creating checkout session with:", {
                price_id: priceId,
                user_id: user?.id || null,
                trial_period_days: trialPeriodDays
            });
            
            if (user) {
                // User is logged in, proceed with normal checkout
                const { data, error } = await supabase.functions.invoke('create-checkout', {
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

                if (error) {
                    console.error("Checkout error:", error);
                    throw error;
                }

                console.log("Checkout response:", data);

                // Redirect to Stripe checkout
                if (data?.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error('No checkout URL returned');
                }
            } else {
                // User is not logged in, redirect to signup with plan info
                // Store the selected plan in localStorage
                localStorage.setItem('selectedPlanId', priceId);
                localStorage.setItem('trialPeriodDays', trialPeriodDays.toString());
                
                // Redirect to signup page with plan info in URL and redirect_to parameter
                // This ensures the user is redirected back to the pricing page after authentication
                window.location.href = `/signup?plan=${priceId}&trial=${trialPeriodDays}&redirect_to=/pricing`;
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            // You could add error handling UI here
        } finally {
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
                    {item.product?.name || "PitchHub Plus"}
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
                    onClick={async () => {
                        await handleCheckout(item.id)
                    }}
                    disabled={isLoading}
                    className="w-full py-6 text-lg font-medium bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading ? "Processing..." : "Start Your Free Trial"}
                </Button>
                
                <p className="text-xs text-center w-full mt-3 text-gray-500">
                    Try risk-free for 7 days. Cancel anytime.
                </p>
            </CardFooter>
        </Card>
    )
}