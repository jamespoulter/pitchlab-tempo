import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";


const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-customer-email',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { price_id, user_id, return_url, trial_period_days, coupon_id } = await req.json();
    
    if (!price_id || !user_id || !return_url) {
      throw new Error('Missing required parameters');
    }

    // Create Stripe checkout session with enhanced options
    const sessionOptions = {
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
      sessionOptions.subscription_data = {
        trial_period_days: Number(trial_period_days),
      };
    }

    // Apply coupon if provided
    if (coupon_id) {
      sessionOptions.discounts = [
        {
          coupon: coupon_id,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});