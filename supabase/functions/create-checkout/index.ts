import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Stripe with the secret key
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
console.log("Stripe key available:", !!stripeKey);

if (!stripeKey) {
  console.error("STRIPE_SECRET_KEY environment variable is not set!");
}

// Test mode configuration
const TEST_PRICE_ID = 'price_1R07PCI7Diy7LoDfEfcS7u3L';
const TEST_PRODUCT_ID = 'prod_RtvFwU7NJ0AK7g';
const isTestMode = stripeKey.startsWith('sk_test_');

console.log("Running in", isTestMode ? "TEST MODE" : "LIVE MODE");

// Initialize Stripe with detailed error logging
let stripe: Stripe;
try {
  stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });
  console.log("Stripe initialized successfully");
} catch (error) {
  console.error("Failed to initialize Stripe:", error);
  throw new Error("Failed to initialize Stripe client");
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase environment variables are not set correctly!");
}

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  throw new Error("Failed to initialize Supabase client");
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-customer-email',
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to create checkout session');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Request headers:', JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
    
    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request body format",
          details: parseError.message,
          success: false
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const { price_id, user_id, return_url, trial_period_days, coupon_id } = requestBody;
    
    // Validate required parameters
    if (!price_id) {
      console.error('Missing price_id parameter');
      return new Response(
        JSON.stringify({ 
          error: "Missing price_id parameter",
          success: false
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!user_id) {
      console.error('Missing user_id parameter');
      return new Response(
        JSON.stringify({ 
          error: "Missing user_id parameter",
          success: false
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!return_url) {
      console.error('Missing return_url parameter');
      return new Response(
        JSON.stringify({ 
          error: "Missing return_url parameter",
          success: false
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Verify the user from the auth token if available
    const authHeader = req.headers.get('Authorization');
    let verifiedUserId = user_id;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        console.log('Verifying user with token');
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error) {
          console.error('Error verifying user:', error);
        } else if (user) {
          console.log('Verified user from token:', user.id);
          // Use the verified user ID from the token
          verifiedUserId = user.id;
          
          // Ensure the user ID in the request matches the verified user ID
          if (user_id !== verifiedUserId) {
            console.warn(`User ID mismatch: ${user_id} (request) vs ${verifiedUserId} (token)`);
          }
        }
      } catch (authError) {
        console.error('Error processing auth token:', authError);
      }
    } else {
      console.log('No Authorization header found, using provided user_id');
    }
    
    // Validate and handle the price ID
    let validatedPriceId = price_id;
    
    // If we're in test mode, ensure we're using a test price
    if (isTestMode) {
      // If the price is 'price_default' or doesn't start with 'price_', use the test price
      if (price_id === 'price_default' || !price_id.startsWith('price_')) {
        console.log('Using test price ID:', TEST_PRICE_ID);
        validatedPriceId = TEST_PRICE_ID;
      } else {
        // Verify the price exists and is a test price
        try {
          const price = await stripe.prices.retrieve(price_id);
          if (!price.livemode) {
            console.log('Valid test price ID:', price_id);
            validatedPriceId = price_id;
          } else {
            console.warn('Live price ID provided in test mode, using test price instead');
            validatedPriceId = TEST_PRICE_ID;
          }
        } catch (priceError) {
          console.warn('Invalid price ID, using test price instead:', TEST_PRICE_ID);
          validatedPriceId = TEST_PRICE_ID;
        }
      }
    } else {
      // Live mode - validate the price ID
      if (price_id === 'price_default') {
        console.error('Invalid price_default in live mode');
        return new Response(
          JSON.stringify({ 
            error: "Invalid price ID in live mode",
            success: false
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }
    
    console.log('Creating checkout session with parameters:', {
      price_id: validatedPriceId,
      user_id: verifiedUserId,
      return_url,
      trial_period_days,
      coupon_id,
      customer_email: req.headers.get('X-Customer-Email'),
      mode: isTestMode ? 'TEST' : 'LIVE'
    });

    // Extract metadata from request body if provided
    const metadata = {
      user_id: verifiedUserId,
      test_mode: isTestMode ? 'true' : 'false',
      ...(requestBody.metadata || {})
    };

    // Create Stripe checkout session with enhanced options
    const sessionOptions: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: validatedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${return_url}?canceled=true`,
      metadata,
      client_reference_id: verifiedUserId,
      // Enable automatic tax calculation now that it's configured in Stripe
      automatic_tax: { enabled: true },
      // Allow promotion codes to be applied at checkout
      allow_promotion_codes: true,
    };

    // Add customer email if available
    const customerEmail = req.headers.get('X-Customer-Email');
    if (customerEmail) {
      sessionOptions.customer_email = customerEmail;
      console.log('Using customer email:', customerEmail);
    } else {
      console.log('No customer email provided');
    }

    // Add subscription trial period if specified
    if (trial_period_days && !isNaN(Number(trial_period_days))) {
      console.log(`Adding trial period of ${trial_period_days} days`);
      sessionOptions.subscription_data = {
        trial_period_days: Number(trial_period_days),
        metadata: {
          user_id: verifiedUserId,
          test_mode: isTestMode ? 'true' : 'false'
        },
      };
    }

    // Apply coupon if provided
    if (coupon_id) {
      console.log(`Applying coupon: ${coupon_id}`);
      sessionOptions.discounts = [
        {
          coupon: coupon_id,
        },
      ];
    }

    console.log('Creating Stripe checkout session with options:', JSON.stringify(sessionOptions, null, 2));
    
    try {
      // Create the checkout session
      console.log('Creating checkout session with Stripe API...');
      const session = await stripe.checkout.sessions.create(sessionOptions);
      console.log('Checkout session created successfully:', session.id);
      console.log('Session URL:', session.url);
      console.log('Session metadata:', JSON.stringify(session.metadata, null, 2));
      
      return new Response(
        JSON.stringify({ 
          sessionId: session.id, 
          url: session.url,
          success: true,
          metadata: session.metadata,
          test_mode: isTestMode
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (stripeError: any) {
      console.error('Stripe error creating checkout session:', stripeError);
      console.error('Stripe error details:', JSON.stringify({
        type: stripeError.type,
        code: stripeError.code,
        param: stripeError.param,
        message: stripeError.message,
        statusCode: stripeError.statusCode,
        rawType: stripeError.rawType
      }, null, 2));
      
      // If the error is related to the price, try with the test price in test mode
      if (isTestMode && stripeError.param === 'line_items[0][price]' && validatedPriceId !== TEST_PRICE_ID) {
        console.log('Price error detected, trying with test price:', TEST_PRICE_ID);
        try {
          sessionOptions.line_items[0].price = TEST_PRICE_ID;
          console.log('Creating checkout session with test price...');
          const session = await stripe.checkout.sessions.create(sessionOptions);
          console.log('Checkout session created successfully with test price:', session.id);
          
          return new Response(
            JSON.stringify({ 
              sessionId: session.id, 
              url: session.url,
              success: true,
              metadata: session.metadata,
              usedTestPrice: true,
              test_mode: isTestMode
            }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        } catch (fallbackError: any) {
          console.error('Error with test price:', fallbackError);
          console.error('Test price error details:', JSON.stringify({
            type: fallbackError.type,
            code: fallbackError.code,
            param: fallbackError.param,
            message: fallbackError.message,
            statusCode: fallbackError.statusCode
          }, null, 2));
          
          return new Response(
            JSON.stringify({ 
              error: "Failed to create checkout session with test price",
              details: fallbackError.message,
              code: fallbackError.code,
              type: fallbackError.type,
              success: false,
              test_mode: isTestMode
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ 
          error: stripeError.message,
          type: stripeError.type,
          code: stripeError.code,
          param: stripeError.param,
          statusCode: stripeError.statusCode,
          success: false,
          test_mode: isTestMode
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        stack: error.stack,
        test_mode: isTestMode
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});