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
import { Check } from "lucide-react";
import { useState } from "react";

interface PlanFeature {
    name: string;
    included: boolean;
}

export default function PricingCard({ item, user }: {
    item: any,
    user: User | null
}) {
    const [isLoading, setIsLoading] = useState(false);

    // Extract features from plan metadata or product metadata
    const features: PlanFeature[] = item.product?.metadata?.features 
        ? JSON.parse(item.product.metadata.features) 
        : [];

    // Format currency amount
    const formatAmount = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(amount / 100);
    };

    // Handle checkout process
    const handleCheckout = async (priceId: string) => {
        if (!user) {
            // Redirect to login if user is not authenticated
            window.location.href = "/login?redirect=pricing";
            return;
        }

        setIsLoading(true);

        try {
            // Get trial period days from metadata if available
            const trialPeriodDays = item.product?.metadata?.trial_period_days || null;
            
            const { data, error } = await supabase.functions.invoke('supabase-functions-create-checkout', {
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
                throw error;
            }

            // Redirect to Stripe checkout
            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            // You could add error handling UI here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className={`w-[350px] relative overflow-hidden ${item.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border border-gray-200'}`}>
            {item.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-30" />
            )}
            <CardHeader className="relative">
                {item.popular && (
                    <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-fit mb-4">
                        Most Popular
                    </div>
                )}
                <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">{item.product?.name || item.name}</CardTitle>
                <CardDescription className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold text-gray-900">{formatAmount(item.amount)}</span>
                    <span className="text-gray-600">/{item.interval}</span>
                </CardDescription>
                {item.product?.metadata?.description && (
                    <p className="mt-4 text-gray-600">{item.product.metadata.description}</p>
                )}
            </CardHeader>
            
            {features.length > 0 && (
                <CardContent>
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <div className={`flex-shrink-0 h-5 w-5 ${feature.included ? 'text-blue-500' : 'text-gray-300'}`}>
                                    <Check size={18} />
                                </div>
                                <span className={`ml-3 text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                    {feature.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            )}
            
            <CardFooter className="relative">
                <Button
                    onClick={async () => {
                        await handleCheckout(item.id)
                    }}
                    disabled={isLoading}
                    className={`w-full py-6 text-lg font-medium`}
                >
                    {isLoading ? "Processing..." : "Get Started"}
                </Button>
                
                {item.product?.metadata?.trial_period_days && (
                    <p className="text-xs text-center w-full mt-3 text-gray-500">
                        Includes {item.product.metadata.trial_period_days}-day free trial
                    </p>
                )}
            </CardFooter>
        </Card>
    )
}