import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

// Initialize Stripe with the secret key
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
console.log("Stripe key available:", !!stripeKey);

if (!stripeKey) {
  console.error("STRIPE_SECRET_KEY environment variable is not set!");
}

// Fallback price ID to use if the provided price ID is invalid
const FALLBACK_PRICE_ID = 'price_1R07PCI7Diy7LoDfEfcS7u3L';

// Initialize Stripe with error handling
let stripe;
try {
  stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });
  console.log("Stripe client initialized successfully");
} catch (error) {
  console.error("Error initializing Stripe client:", error);
  stripe = null;
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-customer-email',
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Log request details for debugging
  console.log(`Request received: ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));

  try {
    // Check if Stripe is initialized
    if (!stripe) {
      throw new Error('Stripe client not initialized. Check environment variables.');
    }

    console.log('Received request to create checkout session');
    
    // Parse the request body
    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { price_id, user_id, return_url, trial_period_days, coupon_id } = requestBody;
    
    // Validate required parameters
    if (!price_id) {
      console.error('Missing price_id parameter');
      return new Response(
        JSON.stringify({ 
          error: 'Missing price_id parameter',
          success: false,
          errorType: 'validation_error'
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
          error: 'Missing user_id parameter',
          success: false,
          errorType: 'validation_error'
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
          error: 'Missing return_url parameter',
          success: false,
          errorType: 'validation_error'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log('Creating checkout session with parameters:', {
      price_id,
      user_id,
      return_url,
      trial_period_days,
      coupon_id,
      customer_email: req.headers.get('X-Customer-Email'),
    });

    // Create Stripe checkout session with enhanced options
    const sessionOptions: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${return_url}?canceled=true`,
      metadata: {
        user_id,
      },
      // Enable automatic tax calculation now that it's configured in Stripe
      automatic_tax: { enabled: true },
      // Allow promotion codes to be applied at checkout
      allow_promotion_codes: true,
    };

    // Add customer email if available
    const customerEmail = req.headers.get('X-Customer-Email');
    if (customerEmail) {
      sessionOptions.customer_email = customerEmail;
      console.log(`Using customer email: ${customerEmail}`);
    }

    // Add subscription trial period if specified
    if (trial_period_days && !isNaN(Number(trial_period_days))) {
      console.log(`Adding trial period of ${trial_period_days} days`);
      sessionOptions.subscription_data = {
        trial_period_days: Number(trial_period_days),
        metadata: {
          user_id,
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
      const session = await stripe.checkout.sessions.create(sessionOptions);
      console.log('Checkout session created successfully:', session.id);
      console.log('Session URL:', session.url);
      
      return new Response(
        JSON.stringify({ 
          sessionId: session.id, 
          url: session.url,
          success: true,
          metadata: session.metadata
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
        message: stripeError.message
      }, null, 2));
      
      // Try with fallback price ID if the error is related to the price
      if (stripeError.code === 'resource_missing' && stripeError.param === 'price' && price_id !== FALLBACK_PRICE_ID) {
        console.log(`Attempting with fallback price ID: ${FALLBACK_PRICE_ID}`);
        
        try {
          // Update the line items with the fallback price
          sessionOptions.line_items[0].price = FALLBACK_PRICE_ID;
          
          const fallbackSession = await stripe.checkout.sessions.create(sessionOptions);
          console.log('Fallback checkout session created successfully:', fallbackSession.id);
          
          return new Response(
            JSON.stringify({ 
              sessionId: fallbackSession.id, 
              url: fallbackSession.url,
              success: true,
              metadata: fallbackSession.metadata,
              note: 'Used fallback price ID due to original price not found'
            }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        } catch (fallbackError: any) {
          console.error('Error with fallback price ID:', fallbackError);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          error: stripeError.message,
          type: stripeError.type,
          code: stripeError.code,
          param: stripeError.param,
          success: false
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
        errorType: 'server_error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 