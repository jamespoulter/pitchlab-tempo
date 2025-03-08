import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../../supabase/server";
import { Check, X } from "lucide-react";
import { ReactNode } from "react";

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

export default async function Pricing() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Use the new function name and get plans for the specific product
    const { data: allPlans, error } = await supabase.functions.invoke('get-plans', {
        body: {
            product_id: "prod_RuEdYVyOF1Vitg" // Pitchhub Premium product ID
        }
    });
    
    // Filter to only show the Pitchhub Premium product
    const plans = allPlans?.filter((plan: Plan) => 
        plan.product?.id === "prod_RuEdYVyOF1Vitg" || 
        plan.product?.name === "Pitchhub Premium"
    );
    
    // Extract common features for the comparison table
    const commonFeatures = plans ? extractCommonFeatures(plans as Plan[]) : [];

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
                    <p className="text-xl text-muted-foreground">
                        Choose the perfect plan for your needs
                    </p>
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
                                                {plan.product?.name || plan.name}
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
                                                        <Check className="mx-auto text-green-500" size={20} />
                                                    ) : (
                                                        <X className="mx-auto text-gray-300" size={20} />
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
                            <h3 className="text-lg font-medium mb-2">Can I change plans later?</h3>
                            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2">How do I cancel my subscription?</h3>
                            <p className="text-gray-600">You can cancel your subscription from your account dashboard. Your plan will remain active until the end of your current billing period.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2">Do you offer refunds?</h3>
                            <p className="text-gray-600">We offer a 14-day money-back guarantee. If you're not satisfied with our service, contact our support team within 14 days of your purchase.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}