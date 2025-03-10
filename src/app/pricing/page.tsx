import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../../supabase/server";
import { Check, X, Building2, FolderKanban, BrainCircuit, Search, Clock, FileCheck } from "lucide-react";
import { ReactNode } from "react";
import DashboardMockup from "@/components/dashboard-mockup";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/utils/subscription";
import SubscriptionRedirect from "@/components/subscription-redirect";
import PricingButton from "@/components/pricing-button";

interface PlanFeature {
    name: string;
    included: boolean;
}

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

// Helper function to extract common features for comparison
const extractCommonFeatures = (plans: Plan[]): string[] => {
    const allFeatures = new Set<string>();
    
    // Collect all unique features
    plans.forEach(plan => {
        const features: PlanFeature[] = plan.product?.metadata?.features 
            ? JSON.parse(plan.product.metadata.features) 
            : [];
            
        features.forEach(feature => {
            allFeatures.add(feature.name);
        });
    });
    
    return Array.from(allFeatures);
};

// Helper to check if a plan includes a feature
const planIncludesFeature = (plan: Plan, featureName: string): boolean => {
    const features: PlanFeature[] = plan.product?.metadata?.features 
        ? JSON.parse(plan.product.metadata.features) 
        : [];
        
    const feature = features.find(f => f.name === featureName);
    return feature?.included || false;
};

// Key features with descriptions
const keyFeatures = [
    {
        title: "Agency Brand Management",
        description: "Create and manage multiple agency brands with custom logos, colors, and templates to maintain consistent branding across all your proposals.",
        icon: <Building2 className="h-10 w-10 text-blue-500" />
    },
    {
        title: "Case Study Management",
        description: "Build, organize, and showcase your best work with beautiful case studies that demonstrate your agency's expertise and results.",
        icon: <FolderKanban className="h-10 w-10 text-blue-500" />
    },
    {
        title: "AI Proposal Generator",
        description: "Generate professional proposals in seconds with our advanced AI. Save hours of work while creating compelling, customized content for your clients.",
        icon: <BrainCircuit className="h-10 w-10 text-blue-500" />
    }
];

// Pain points that PitchHub solves
const painPoints = [
    {
        title: "Stop Searching for Case Studies",
        description: "Never waste time digging through folders and drives looking for that perfect case study again.",
        icon: <Search className="h-10 w-10 text-red-500" />
    },
    {
        title: "Save Hours of Work",
        description: "Cut proposal creation time from hours to minutes with our AI-powered tools and templates.",
        icon: <Clock className="h-10 w-10 text-orange-500" />
    },
    {
        title: "Win More Business",
        description: "Present your agency professionally with consistent branding and compelling case studies.",
        icon: <FileCheck className="h-10 w-10 text-green-500" />
    }
];

// Test mode configuration
const TEST_PRICE_ID = 'price_1R07PCI7Diy7LoDfEfcS7u3L';
const TEST_PRODUCT_ID = 'prod_RtvFwU7NJ0AK7g';

export default async function Pricing() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If user is logged in, check for active subscriptions
    if (user) {
        // Check if the user has an active subscription
        const hasSubscription = await hasActiveSubscription(supabase, user.id);
        
        // If the user has an active subscription, redirect to dashboard
        if (hasSubscription) {
            return redirect('/dashboard');
        }
    }

    // Use the new function name and get plans for the specific product
    const { data: allPlans, error } = await supabase.functions.invoke('get-plans', {
        body: {
            product_id: TEST_PRODUCT_ID // Use the test product ID constant
        }
    });
    
    // Debug the response
    console.log("get-plans response:", { allPlans, error });
    
    // If there's an error, show it on the page
    if (error) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Never Go Looking for a Case Study Again</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Get all your agency information, case studies, testimonials, and everything you need to win more business in one place
                    </p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-3xl mx-auto">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Plans</h2>
                    <p className="text-red-700 mb-4">{error.message || "An error occurred while loading pricing plans."}</p>
                    <pre className="bg-white p-4 rounded text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                </div>
            </div>
        );
    }
    
    // Initialize plans and commonFeatures
    let plans: Plan[] = [];
    let commonFeatures: string[] = [];
    
    // If there are no plans, use a fallback plan
    if (!allPlans || !Array.isArray(allPlans) || allPlans.length === 0) {
        console.log("No plans found, using fallback plan");
        
        // Create a fallback plan
        const fallbackPlan: Plan = {
            id: TEST_PRICE_ID,
            name: "PitchHub Premium",
            amount: 25000,
            interval: "month",
            popular: true,
            product: {
                id: TEST_PRODUCT_ID,
                name: "PitchHub Premium",
                metadata: {
                    features: JSON.stringify([
                        { name: "Unlimited Pitches", included: true },
                        { name: "AI-Powered Content", included: true },
                        { name: "Custom Branding", included: true },
                        { name: "Team Collaboration", included: true }
                    ]),
                    description: "Full access to all PitchHub Premium features",
                    trial_period_days: "7",
                    popular: "true"
                }
            }
        };
        
        plans = [fallbackPlan];
    } else {
        // Filter to only show the PitchHub Premium product
        plans = allPlans.filter((plan: Plan) => 
            plan.product?.id === TEST_PRODUCT_ID || 
            plan.product?.name === "PitchHub Premium"
        );
        
        console.log("Filtered plans:", plans);
        
        // If no plans match the filter, use the first plan
        if (plans.length === 0 && allPlans.length > 0) {
            console.log("No matching plans found, using first available plan");
            plans = [allPlans[0]];
        }
    }
    
    // Extract common features for the comparison table
    commonFeatures = extractCommonFeatures(plans);
    
    console.log("Final plans to display:", plans);
    console.log("Common features:", commonFeatures);

    return (
        <>
            <Navbar />
            <SubscriptionRedirect />
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Never Go Looking for a Case Study Again</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Get all your agency information, case studies, testimonials, and everything you need to win more business in one place
                    </p>
                    <p className="mt-4 text-blue-600 font-medium">
                        Start with a 7-day free trial
                    </p>
                </div>

                {/* Pain Points Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {painPoints.map((point, index) => (
                        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="mb-4">{point.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                            <p className="text-gray-600">{point.description}</p>
                        </div>
                    ))}
                </div>

                {/* Dashboard Mockup */}
                <div className="relative w-full max-w-5xl mx-auto mb-20">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm z-10">
                        Everything you need in one place
                    </div>
                    <DashboardMockup />
                </div>

                {/* Key Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {keyFeatures.map((feature, index) => (
                        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing Card - Single Plan Focus */}
                <div className="max-w-md mx-auto mb-24">
                    {plans.map((plan) => (
                        <div key={plan.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2">{plan.product?.name || "PitchHub Premium"}</h3>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-extrabold">
                                        {new Intl.NumberFormat('en-GB', {
                                            style: 'currency',
                                            currency: 'GBP',
                                            minimumFractionDigits: 0,
                                        }).format(plan.amount / 100)}
                                    </span>
                                    <span className="text-gray-500 ml-1">/{plan.interval}</span>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {plan.product?.metadata?.description || "Full access to all PitchHub Premium features"}
                                </p>
                                
                                <div className="mb-6">
                                    <PricingButton item={plan} user={user} />
                                </div>
                                
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm text-gray-500 mb-4">Includes:</p>
                                    <ul className="space-y-3">
                                        {plan.product?.metadata?.features ? 
                                            JSON.parse(plan.product.metadata.features)
                                                .filter((feature: PlanFeature) => feature.included)
                                                .map((feature: PlanFeature, index: number) => (
                                                    <li key={index} className="flex items-start">
                                                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span>{feature.name}</span>
                                                    </li>
                                                ))
                                            : 
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>All Premium Features</span>
                                            </li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}