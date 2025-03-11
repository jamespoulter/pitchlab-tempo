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

// Default product to return if no product is found
const defaultProduct = {
    id: "prod_RtvFwU7NJ0AK7g",
    name: "Pitchhub Premium",
    description: "Full access to all Pitchhub Premium features",
    active: true,
    price: {
        id: "price_1R07PCI7Diy7LoDfEfcS7u3L",
        currency: "gbp",
        unit_amount: 25000,
        interval: "month",
        interval_count: 1,
        trial_period_days: 7
    },
    features: [
        "Unlimited case studies & content storage",
        "AI-powered proposal builder",
        "Team collaboration tools",
        "Custom branding & templates",
        "Proposal tracking & analytics",
        "Priority support"
    ]
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
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
                productId = requestBody.product_id || 'prod_RtvFwU7NJ0AK7g';
                console.log("Product ID from body:", productId);
            } catch (e) {
                console.log("Error parsing request body:", e);
                productId = 'prod_RtvFwU7NJ0AK7g'; // Default to Pitchhub Premium
                console.log("Using default product ID:", productId);
            }
        }
        
        console.log(`Attempting to fetch product: ${productId}`);
        
        try {
            // Get the product details
            const product = await stripe.products.retrieve(productId);
            console.log(`Found product: ${product.id}, Name: ${product.name}, Active: ${product.active}`);
            
            // Get the default price for the product
            let price;
            if (product.default_price) {
                price = await stripe.prices.retrieve(product.default_price.toString());
                console.log(`Found default price: ${price.id}, Amount: ${price.unit_amount}`);
            } else {
                // If no default price, try to find prices for this product
                const prices = await stripe.prices.list({
                    product: productId,
                    active: true,
                    limit: 1
                });
                
                if (prices.data.length > 0) {
                    price = prices.data[0];
                    console.log(`Found price: ${price.id}, Amount: ${price.unit_amount}`);
                } else {
                    console.log("No prices found for this product");
                    // Use default price info
                    price = {
                        id: "price_1R07PCI7Diy7LoDfEfcS7u3L",
                        currency: "gbp",
                        unit_amount: 25000,
                        recurring: {
                            interval: "month",
                            interval_count: 1
                        }
                    };
                }
            }
            
            // Extract features from product metadata or use defaults
            let features = [];
            if (product.metadata && product.metadata.features) {
                try {
                    features = JSON.parse(product.metadata.features);
                } catch (e) {
                    console.log("Error parsing features:", e);
                    // If features is a comma-separated string, split it
                    if (typeof product.metadata.features === 'string') {
                        features = product.metadata.features.split(',').map(f => f.trim());
                    }
                }
            }
            
            // If no features found, use default features
            if (!features || features.length === 0) {
                features = defaultProduct.features;
            }
            
            // Get trial period days from product metadata or use default
            const trialPeriodDays = product.metadata?.trial_period_days 
                ? parseInt(product.metadata.trial_period_days) 
                : 7;
            
            // Format the response
            const formattedProduct = {
                id: product.id,
                name: product.name,
                description: product.description || defaultProduct.description,
                active: product.active,
                price: {
                    id: price.id,
                    currency: price.currency,
                    unit_amount: price.unit_amount,
                    interval: price.recurring?.interval || "month",
                    interval_count: price.recurring?.interval_count || 1,
                    trial_period_days: trialPeriodDays
                },
                features: features
            };
            
            return new Response(
                JSON.stringify(formattedProduct),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200 
                }
            );
        } catch (stripeError) {
            console.error("Stripe API error:", stripeError);
            // Return default product on Stripe API error
            console.log("Returning default product due to Stripe API error");
            return new Response(
                JSON.stringify(defaultProduct),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200 
                }
            );
        }
    } catch (error) {
        console.error("General error:", error);
        // Return default product on general error
        console.log("Returning default product due to general error");
        return new Response(
            JSON.stringify(defaultProduct),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200 
            }
        );
    }
}); 