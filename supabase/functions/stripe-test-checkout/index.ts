import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

// Initialize Stripe with the secret key
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

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
      success_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${return_url}?canceled=true`,
      customer_email: req.headers.get('X-Customer-Email'),
      metadata: {
        user_id,
      },
      // Enable automatic tax calculation if configured in Stripe
      automatic_tax: { enabled: true },
      // Allow promotion codes to be applied at checkout
      allow_promotion_codes: true,
    };

    // Add subscription trial period if specified
    if (trial_period_days && !isNaN(Number(trial_period_days))) {
      console.log(`Adding trial period of ${trial_period_days} days`);
      sessionOptions.subscription_data = {
        trial_period_days: Number(trial_period_days),
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