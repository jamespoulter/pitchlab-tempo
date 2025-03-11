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

    // Get the product details using the new function
    const { data: productData, error: productError } = await supabase.functions.invoke('get-product', {
        body: {
            product_id: "prod_RtvFwU7NJ0AK7g" // Pitchhub Premium product ID
        }
    });
    
    if (productError) {
        console.error("Error fetching product:", productError);
    }
    
    // Convert the product data to the format expected by PricingCard
    const plans = productData ? [
        {
            id: productData.price.id,
            name: productData.name,
            amount: productData.price.unit_amount,
            interval: productData.price.interval,
            popular: true,
            product: {
                id: productData.id,
                name: productData.name,
                metadata: {
                    description: productData.description,
                    trial_period_days: productData.price.trial_period_days?.toString(),
                    popular: "true",
                    features: JSON.stringify(
                        productData.features.map(feature => ({
                            name: feature,
                            included: true
                        }))
                    )
                }
            }
        }
    ] : [];
    
    // Extract common features for the comparison table
    const commonFeatures = plans ? extractCommonFeatures(plans as Plan[]) : [];

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

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
                    {plans?.map((item: any) => (
                        <PricingCard key={item.id} item={item} user={user} />
                    ))}
                </div>
                
                {/* Feature Comparison Table */}
                {commonFeatures.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-4 px-6 text-left">Feature</th>
                                        {plans?.map((plan: Plan) => (
                                            <th key={plan.id} className="py-4 px-6 text-center">
                                                {plan.product?.name || "Plan"}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {commonFeatures.map((feature, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                            <td className="py-4 px-6 font-medium">{feature}</td>
                                            {plans?.map((plan: Plan) => (
                                                <td key={plan.id} className="py-4 px-6 text-center">
                                                    {planIncludesFeature(plan, feature) ? (
                                                        <Check className="mx-auto h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <X className="mx-auto h-5 w-5 text-gray-300" />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Can I cancel my subscription?</h3>
                            <p className="text-gray-600">Yes, you can cancel your subscription at any time. If you cancel, you'll still have access until the end of your billing period.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2">Is there a free trial?</h3>
                            <p className="text-gray-600">Yes, we offer a {productData?.price?.trial_period_days || 7}-day free trial so you can fully explore all features before committing.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2">How does team billing work?</h3>
                            <p className="text-gray-600">You're billed per user on your team. You can add or remove team members at any time, and your billing will be adjusted accordingly.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2">Do you offer enterprise plans?</h3>
                            <p className="text-gray-600">Yes, for larger teams or specific requirements, please contact us for custom enterprise pricing and features.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}