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
        // Get the specific product ID from the URL query parameters or use default
        const url = new URL(req.url);
        const productId = url.searchParams.get('product_id') || 'prod_RuEdYVyOF1Vitg'; // Default to Pitchhub Premium
        
        console.log(`Fetching prices for product: ${productId}`);
        
        // Get prices for the specific product
        const prices = await stripe.prices.list({
            product: productId,
            active: true,
            expand: ['data.product']
        });
        
        console.log(`Found ${prices.data.length} prices for product ${productId}`);
        
        if (prices.data.length === 0) {
            // Fallback to listing all plans if no prices found for the specific product
            console.log("No prices found for specified product, fetching all plans");
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
                };
            });
            
            return new Response(
                JSON.stringify(enhancedPlans),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200 
                }
            );
        }
        
        // Sort prices by amount
        const sortedPrices = prices.data.sort((a, b) => a.unit_amount - b.unit_amount);
        
        // Enhance price data with additional information
        const enhancedPrices = sortedPrices.map(price => {
            // Add a popular flag based on metadata
            const isPopular = price.product.metadata?.popular === 'true' || false;
            
            // Convert price to plan format for compatibility
            return {
                id: price.id,
                object: 'plan',
                active: price.active,
                amount: price.unit_amount,
                amount_decimal: price.unit_amount.toString(),
                currency: price.currency,
                interval: price.recurring?.interval || 'month',
                interval_count: price.recurring?.interval_count || 1,
                product: price.product,
                metadata: price.metadata,
                popular: isPopular,
                // Add trial period days from product metadata
                trial_period_days: price.product.metadata?.trial_period_days 
                    ? parseInt(price.product.metadata.trial_period_days) 
                    : null
            };
        });
        
        return new Response(
            JSON.stringify(enhancedPrices),
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