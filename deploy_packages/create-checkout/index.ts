import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

// Initialize Stripe with the secret key
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
console.log("Stripe key available:", !!stripeKey);

if (!stripeKey) {
  console.error("STRIPE_SECRET_KEY environment variable is not set!");
}

// Fallback price ID to use if the provided price ID is invalid
const FALLBACK_PRICE_ID = 'price_1R0QA2I7Diy7LoDft8J57jK3';

const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

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
    
    // Parse the request body
    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { price_id, user_id, return_url, trial_period_days, coupon_id } = requestBody;
    
    // Validate required parameters
    if (!price_id) {
      console.error('Missing price_id parameter');
      throw new Error('Missing price_id parameter');
    }
    
    if (!user_id) {
      console.error('Missing user_id parameter');
      throw new Error('Missing user_id parameter');
    }
    
    if (!return_url) {
      console.error('Missing return_url parameter');
      throw new Error('Missing return_url parameter');
    }
    
    // Validate the price ID - don't use 'price_default'
    let validatedPriceId = price_id;
    if (price_id === 'price_default') {
      console.log('Received price_default, using fallback price ID:', FALLBACK_PRICE_ID);
      validatedPriceId = FALLBACK_PRICE_ID;
    }
    
    console.log('Creating checkout session with parameters:', {
      price_id: validatedPriceId,
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
          price: validatedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${return_url}?canceled=true`,
      metadata: {
        user_id: user_id,
      },
      // Enable automatic tax calculation if configured in Stripe
      automatic_tax: { enabled: true },
      // Allow promotion codes to be applied at checkout
      allow_promotion_codes: true,
    };

    // Add customer email if available
    const customerEmail = req.headers.get('X-Customer-Email');
    if (customerEmail) {
      sessionOptions.customer_email = customerEmail;
    }

    // Add subscription trial period if specified
    if (trial_period_days && !isNaN(Number(trial_period_days))) {
      console.log(`Adding trial period of ${trial_period_days} days`);
      sessionOptions.subscription_data = {
        trial_period_days: Number(trial_period_days),
        metadata: {
          user_id: user_id,
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
      // Verify the price exists before creating the session
      try {
        const price = await stripe.prices.retrieve(validatedPriceId);
        console.log('Price verified:', price.id);
      } catch (priceError) {
        console.error('Error verifying price:', priceError);
        console.log('Using fallback price ID:', FALLBACK_PRICE_ID);
        sessionOptions.line_items[0].price = FALLBACK_PRICE_ID;
      }
      
      const session = await stripe.checkout.sessions.create(sessionOptions);
      console.log('Checkout session created successfully:', session.id);
      console.log('Session URL:', session.url);
      console.log('Session metadata:', JSON.stringify(session.metadata, null, 2));
      
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
      
      // If the error is related to the price, try with the fallback price
      if (stripeError.param === 'line_items[0][price]') {
        console.log('Price error detected, trying with fallback price:', FALLBACK_PRICE_ID);
        try {
          sessionOptions.line_items[0].price = FALLBACK_PRICE_ID;
          const session = await stripe.checkout.sessions.create(sessionOptions);
          console.log('Checkout session created successfully with fallback price:', session.id);
          
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
        } catch (fallbackError: any) {
          console.error('Error with fallback price:', fallbackError);
          return new Response(
            JSON.stringify({ 
              error: "Failed to create checkout session with fallback price",
              details: fallbackError.message,
              success: false
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
        stack: error.stack
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});