import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Get all active plans with expanded product information
        const plans = await stripe.plans.list({
            active: true,
            expand: ['data.product']
        });

        // Sort plans by amount (price)
        const sortedPlans = plans.data.sort((a, b) => a.amount - b.amount);

        // Enhance plan data with additional information
        const enhancedPlans = sortedPlans.map(plan => {
            // Add a popular flag based on metadata or specific plan ID
            const isPopular = plan.metadata?.popular === 'true' || false;
            
            return {
                ...plan,
                popular: isPopular,
                // You can add more custom fields here as needed
            };
        });

        return new Response(
            JSON.stringify(enhancedPlans),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200 
            }
        );
    } catch (error) {
        console.error("Error getting products:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400 
            }
        );
    }
});