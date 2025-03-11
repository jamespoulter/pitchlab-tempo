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

// Fallback price ID to use if no prices are found for the specified product
const FALLBACK_PRICE_ID = 'price_1R0QA2I7Diy7LoDft8J57jK3';

// IMPORTANT: This function now tries to fetch a real price from Stripe first
// before falling back to a default plan structure (without an actual price ID)
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
                productId = 'prod_RuEdYVyOF1Vitg'; // Default to PitchHub Plus
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
                    // No prices found at all, try to get the fallback price
                    console.log(`No prices found at all, trying fallback price: ${FALLBACK_PRICE_ID}`);
                    try {
                        const fallbackPrice = await stripe.prices.retrieve(FALLBACK_PRICE_ID, {
                            expand: ['product']
                        });
                        
                        console.log(`Successfully retrieved fallback price: ${fallbackPrice.id}`);
                        
                        // Convert to plan format
                        const fallbackPlan = {
                            id: fallbackPrice.id,
                            object: 'plan',
                            active: fallbackPrice.active,
                            amount: fallbackPrice.unit_amount,
                            amount_decimal: fallbackPrice.unit_amount?.toString() || "4500",
                            currency: fallbackPrice.currency,
                            interval: fallbackPrice.recurring?.interval || 'month',
                            interval_count: fallbackPrice.recurring?.interval_count || 1,
                            product: fallbackPrice.product,
                            metadata: fallbackPrice.metadata,
                            popular: true,
                            trial_period_days: fallbackPrice.product.metadata?.trial_period_days 
                                ? parseInt(fallbackPrice.product.metadata.trial_period_days) 
                                : 7
                        };
                        
                        return new Response(
                            JSON.stringify([fallbackPlan]),
                            { 
                                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                                status: 200 
                            }
                        );
                    } catch (fallbackError) {
                        console.error("Error retrieving fallback price:", fallbackError);
                        return new Response(
                            JSON.stringify({ 
                                error: "No prices found in your Stripe account. Please create at least one price in Stripe before continuing." 
                            }),
                            { 
                                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                                status: 400 
                            }
                        );
                    }
                }
                
                // Filter prices to find any related to our product
                const relevantPrices = allPrices.data.filter(price => 
                    price.product.id === productId || 
                    price.product.name === "PitchHub Plus"
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
                    // No relevant prices found, try to get the fallback price
                    console.log(`No relevant prices found, trying fallback price: ${FALLBACK_PRICE_ID}`);
                    try {
                        const fallbackPrice = await stripe.prices.retrieve(FALLBACK_PRICE_ID, {
                            expand: ['product']
                        });
                        
                        console.log(`Successfully retrieved fallback price: ${fallbackPrice.id}`);
                        
                        // Convert to plan format
                        const fallbackPlan = {
                            id: fallbackPrice.id,
                            object: 'plan',
                            active: fallbackPrice.active,
                            amount: fallbackPrice.unit_amount,
                            amount_decimal: fallbackPrice.unit_amount?.toString() || "4500",
                            currency: fallbackPrice.currency,
                            interval: fallbackPrice.recurring?.interval || 'month',
                            interval_count: fallbackPrice.recurring?.interval_count || 1,
                            product: fallbackPrice.product,
                            metadata: fallbackPrice.metadata,
                            popular: true,
                            trial_period_days: fallbackPrice.product.metadata?.trial_period_days 
                                ? parseInt(fallbackPrice.product.metadata.trial_period_days) 
                                : 7
                        };
                        
                        return new Response(
                            JSON.stringify([fallbackPlan]),
                            { 
                                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                                status: 200 
                            }
                        );
                    } catch (fallbackError) {
                        console.error("Error retrieving fallback price:", fallbackError);
                        return new Response(
                            JSON.stringify({ 
                                error: "No prices found for the specified product. Please create a price for this product in Stripe." 
                            }),
                            { 
                                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                                status: 400 
                            }
                        );
                    }
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
            
            // Try to get the fallback price as a last resort
            console.log(`Stripe API error, trying fallback price: ${FALLBACK_PRICE_ID}`);
            try {
                const fallbackPrice = await stripe.prices.retrieve(FALLBACK_PRICE_ID, {
                    expand: ['product']
                });
                
                console.log(`Successfully retrieved fallback price: ${fallbackPrice.id}`);
                
                // Convert to plan format
                const fallbackPlan = {
                    id: fallbackPrice.id,
                    object: 'plan',
                    active: fallbackPrice.active,
                    amount: fallbackPrice.unit_amount,
                    amount_decimal: fallbackPrice.unit_amount?.toString() || "4500",
                    currency: fallbackPrice.currency,
                    interval: fallbackPrice.recurring?.interval || 'month',
                    interval_count: fallbackPrice.recurring?.interval_count || 1,
                    product: fallbackPrice.product,
                    metadata: fallbackPrice.metadata,
                    popular: true,
                    trial_period_days: fallbackPrice.product.metadata?.trial_period_days 
                        ? parseInt(fallbackPrice.product.metadata.trial_period_days) 
                        : 7
                };
                
                return new Response(
                    JSON.stringify([fallbackPlan]),
                    { 
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200 
                    }
                );
            } catch (fallbackError) {
                console.error("Error retrieving fallback price:", fallbackError);
                return new Response(
                    JSON.stringify({ 
                        error: "Error connecting to Stripe API. Please check your Stripe API key and try again.",
                        details: stripeError.message
                    }),
                    { 
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 400 
                    }
                );
            }
        }
    } catch (error) {
        console.error("General error:", error);
        
        // Try to get the fallback price as a last resort
        console.log(`General error, trying fallback price: ${FALLBACK_PRICE_ID}`);
        try {
            const fallbackPrice = await stripe.prices.retrieve(FALLBACK_PRICE_ID, {
                expand: ['product']
            });
            
            console.log(`Successfully retrieved fallback price: ${fallbackPrice.id}`);
            
            // Convert to plan format
            const fallbackPlan = {
                id: fallbackPrice.id,
                object: 'plan',
                active: fallbackPrice.active,
                amount: fallbackPrice.unit_amount,
                amount_decimal: fallbackPrice.unit_amount?.toString() || "4500",
                currency: fallbackPrice.currency,
                interval: fallbackPrice.recurring?.interval || 'month',
                interval_count: fallbackPrice.recurring?.interval_count || 1,
                product: fallbackPrice.product,
                metadata: fallbackPrice.metadata,
                popular: true,
                trial_period_days: fallbackPrice.product.metadata?.trial_period_days 
                    ? parseInt(fallbackPrice.product.metadata.trial_period_days) 
                    : 7
            };
            
            return new Response(
                JSON.stringify([fallbackPlan]),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200 
                }
            );
        } catch (fallbackError) {
            console.error("Error retrieving fallback price:", fallbackError);
            return new Response(
                JSON.stringify({ 
                    error: "An unexpected error occurred. Please try again later.",
                    details: error.message
                }),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500 
                }
            );
        }
    }
});