import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

// Initialize Stripe with API key
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
console.log("Stripe key available:", !!stripeKey);

const stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Default plan to return if no plans are found
const defaultPlan = {
    id: "price_default",
    object: "plan",
    active: true,
    amount: 4500,
    amount_decimal: "4500",
    currency: "gbp",
    interval: "month",
    interval_count: 1,
    product: {
        id: "prod_RuEdYVyOF1Vitg",
        name: "Pitchhub Premium",
        metadata: {
            trial_period_days: "7",
            description: "Full access to all Pitchhub Premium features",
            features: JSON.stringify([
                { name: "Unlimited Pitches", included: true },
                { name: "AI-Powered Content", included: true },
                { name: "Custom Branding", included: true },
                { name: "Team Collaboration", included: true }
            ])
        }
    },
    metadata: {},
    popular: true,
    trial_period_days: 7
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Log the request details
        console.log("Received request URL:", req.url);
        console.log("Request method:", req.method);
        console.log("Request headers:", Object.fromEntries(req.headers.entries()));
        
        // Get the product ID from query params or request body
        const url = new URL(req.url);
        let productId = '';
        let requestBody = {};
        
        // Try to get product_id from query params first
        const queryProductId = url.searchParams.get('product_id');
        if (queryProductId) {
            productId = queryProductId;
            console.log("Product ID from query params:", productId);
        } else {
            // If not in query params, try to get from request body
            try {
                requestBody = await req.json();
                console.log("Request body:", JSON.stringify(requestBody));
                productId = requestBody.product_id || 'prod_RuEdYVyOF1Vitg';
                console.log("Product ID from body:", productId);
            } catch (e) {
                console.log("Error parsing request body:", e);
                productId = 'prod_RuEdYVyOF1Vitg'; // Default to Pitchhub Premium
                console.log("Using default product ID:", productId);
            }
        }
        
        console.log(`Attempting to fetch prices for product: ${productId}`);
        
        try {
            // First try to list all products to see what's available
            console.log("Listing all products to verify what's available:");
            const products = await stripe.products.list({ limit: 10 });
            console.log(`Found ${products.data.length} products:`);
            products.data.forEach(product => {
                console.log(`- Product: ${product.id}, Name: ${product.name}, Active: ${product.active}`);
            });
            
            // Now try to get prices for the specific product
            console.log(`Fetching prices for product: ${productId}`);
            const prices = await stripe.prices.list({
                product: productId,
                active: true,
                expand: ['data.product']
            });
            
            console.log(`Found ${prices.data.length} prices for product ${productId}`);
            
            if (prices.data.length === 0) {
                // No prices found for the specific product, try listing all prices
                console.log("No prices found for specified product, fetching all prices");
                const allPrices = await stripe.prices.list({
                    active: true,
                    expand: ['data.product'],
                    limit: 100
                });
                
                console.log(`Found ${allPrices.data.length} total prices`);
                
                if (allPrices.data.length === 0) {
                    // No prices found at all, return default plan
                    console.log("No prices found at all, returning default plan");
                    return new Response(
                        JSON.stringify([defaultPlan]),
                        { 
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                            status: 200 
                        }
                    );
                }
                
                // Filter prices to find any related to our product
                const relevantPrices = allPrices.data.filter(price => 
                    price.product.id === productId || 
                    price.product.name === "Pitchhub Premium"
                );
                
                console.log(`Found ${relevantPrices.length} relevant prices after filtering`);
                
                if (relevantPrices.length > 0) {
                    // Found relevant prices, convert to plan format
                    const enhancedPrices = relevantPrices.map(price => ({
                        id: price.id,
                        object: 'plan',
                        active: price.active,
                        amount: price.unit_amount,
                        amount_decimal: price.unit_amount?.toString() || "4500",
                        currency: price.currency,
                        interval: price.recurring?.interval || 'month',
                        interval_count: price.recurring?.interval_count || 1,
                        product: price.product,
                        metadata: price.metadata,
                        popular: true,
                        trial_period_days: price.product.metadata?.trial_period_days 
                            ? parseInt(price.product.metadata.trial_period_days) 
                            : 7
                    }));
                    
                    return new Response(
                        JSON.stringify(enhancedPrices),
                        { 
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                            status: 200 
                        }
                    );
                } else {
                    // No relevant prices found, return default plan
                    console.log("No relevant prices found, returning default plan");
                    return new Response(
                        JSON.stringify([defaultPlan]),
                        { 
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                            status: 200 
                        }
                    );
                }
            }
            
            // Sort prices by amount
            const sortedPrices = prices.data.sort((a, b) => 
                (a.unit_amount || 0) - (b.unit_amount || 0)
            );
            
            // Enhance price data with additional information
            const enhancedPrices = sortedPrices.map(price => {
                // Add a popular flag based on metadata
                const isPopular = price.product.metadata?.popular === 'true' || true;
                
                // Convert price to plan format for compatibility
                return {
                    id: price.id,
                    object: 'plan',
                    active: price.active,
                    amount: price.unit_amount,
                    amount_decimal: price.unit_amount?.toString() || "4500",
                    currency: price.currency,
                    interval: price.recurring?.interval || 'month',
                    interval_count: price.recurring?.interval_count || 1,
                    product: price.product,
                    metadata: price.metadata,
                    popular: isPopular,
                    // Add trial period days from product metadata
                    trial_period_days: price.product.metadata?.trial_period_days 
                        ? parseInt(price.product.metadata.trial_period_days) 
                        : 7
                };
            });
            
            return new Response(
                JSON.stringify(enhancedPrices),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200 
                }
            );
        } catch (stripeError) {
            console.error("Stripe API error:", stripeError);
            // Return default plan on Stripe API error
            console.log("Returning default plan due to Stripe API error");
            return new Response(
                JSON.stringify([defaultPlan]),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200 
                }
            );
        }
    } catch (error) {
        console.error("General error:", error);
        // Return default plan on general error
        console.log("Returning default plan due to general error");
        return new Response(
            JSON.stringify([defaultPlan]),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200 
            }
        );
    }
});