import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../../supabase/server";
import { Check, X, Building2, FolderKanban, BrainCircuit, Search, Clock, FileCheck } from "lucide-react";
import { ReactNode } from "react";
import DashboardMockup from "@/components/dashboard-mockup";

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

export default async function Pricing() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Use the new function name and get plans for the specific product
    const { data: allPlans, error } = await supabase.functions.invoke('get-plans', {
        body: {
            product_id: "prod_RuEdYVyOF1Vitg" // PitchHub Plus product ID
        }
    });
    
    // Filter to only show the PitchHub Plus product
    const plans = allPlans?.filter((plan: Plan) => 
        plan.product?.id === "prod_RuEdYVyOF1Vitg" || 
        plan.product?.name === "PitchHub Plus"
    );
    
    // Extract common features for the comparison table
    const commonFeatures = plans ? extractCommonFeatures(plans as Plan[]) : [];

    return (
        <>
            <Navbar />
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
                    {plans && plans.length > 0 && (
                        <PricingCard item={plans[0]} user={user} />
                    )}
                </div>
                
                {/* Feature List */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">Everything You Need to Win More Clients</h2>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {commonFeatures.map((feature, index) => {
                                // Determine if this is a key feature
                                const isKeyFeature = keyFeatures.some(kf => 
                                    feature.toLowerCase().includes(kf.title.toLowerCase()) ||
                                    (feature.toLowerCase().includes("ai") && kf.title.includes("AI"))
                                );
                                
                                return (
                                    <div key={index} className={`flex items-start ${isKeyFeature ? 'col-span-full bg-blue-50 p-3 rounded-lg' : ''}`}>
                                        <Check className={`mt-1 flex-shrink-0 ${isKeyFeature ? 'text-blue-600' : 'text-green-500'}`} size={20} />
                                        <span className={`ml-3 ${isKeyFeature ? 'font-medium text-blue-800' : ''}`}>
                                            {feature}
                                            {isKeyFeature && <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Core Feature</span>}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                {/* Testimonials Section */}
                <div className="mt-24 max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <p className="italic text-gray-700 mb-4">"I used to spend hours searching for the right case studies and creating proposals. With PitchHub, everything is organized and accessible. The AI proposal generator has saved us countless hours."</p>
                            <p className="font-semibold">— Sarah Johnson, Creative Director</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <p className="italic text-gray-700 mb-4">"Being able to manage multiple agency brands in one place has streamlined our workflow. We never have to go hunting for case studies or testimonials again. It's all right there when we need it."</p>
                            <p className="font-semibold">— Michael Chen, Agency Owner</p>
                        </div>
                    </div>
                </div>
                
                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium mb-2">How does the 7-day free trial work?</h3>
                            <p className="text-gray-600">When you sign up, you'll get immediate access to all features for 7 days. After your trial ends, you'll be automatically enrolled in the monthly plan.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium mb-2">Can I cancel my subscription?</h3>
                            <p className="text-gray-600">Yes, you can cancel your subscription at any time from your account dashboard. Your plan will remain active until the end of your current billing period.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium mb-2">Do you offer refunds?</h3>
                            <p className="text-gray-600">We offer a 14-day money-back guarantee. If you're not satisfied with our service, contact our support team within 14 days of your purchase.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium mb-2">Is there a limit to how many proposals I can create?</h3>
                            <p className="text-gray-600">No, our monthly plan includes unlimited proposals, case studies, and agency brands.</p>
                        </div>
                    </div>
                </div>
                
                {/* CTA Section */}
                <div className="mt-24 text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to stop searching and start winning?</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Start your 7-day free trial today and get all your agency assets in one place.
                    </p>
                    <a href="#pricing" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                        Get Started Now
                    </a>
                </div>
            </div>
        </>
    );
}