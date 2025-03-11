import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno imports
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
// @ts-ignore - Deno imports
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Types
type WebhookEvent = {
  event_type: string;
  type: string;
  stripe_event_id: string;
  created_at: string;
  modified_at: string;
  data: any;
};

type SubscriptionData = {
  stripe_id: string;
  user_id: string;
  price_id: string;
  stripe_price_id: string;
  currency: string;
  interval: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  amount: number;
  started_at: number;
  customer_id: string;
  metadata: Record<string, any>;
  canceled_at?: number;
  ended_at?: number;
};

// Get environment variables
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Log environment variable availability
console.log("Environment variables available:", {
  stripeKey: !!stripeKey,
  stripeWebhookSecret: !!stripeWebhookSecret,
  supabaseUrl: !!supabaseUrl,
  supabaseServiceKey: !!supabaseServiceKey
});

// Initialize Stripe
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Utility functions
async function logAndStoreWebhookEvent(
  supabaseClient: SupabaseClient,
  event: any,
  data: any
): Promise<void> {
  const { error } = await supabaseClient
    .from("webhook_events")
    .insert({
      event_type: event.type,
      type: event.type.split('.')[0],
      stripe_event_id: event.id,
      created_at: new Date(event.created * 1000).toISOString(),
      modified_at: new Date(event.created * 1000).toISOString(),
      data
    } as WebhookEvent);

  if (error) {
    console.error('Error logging webhook event:', error);
    throw error;
  }
}

async function updateSubscriptionStatus(
  supabaseClient: SupabaseClient,
  stripeId: string,
  status: string
): Promise<void> {
  const { error } = await supabaseClient
    .from("subscriptions")
    .update({ status })
    .eq("stripe_id", stripeId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}

// Event handlers
async function handleSubscriptionCreated(supabaseClient: SupabaseClient, event: any) {
  const subscription = event.data.object;
  console.log('Handling subscription created:', subscription.id);
  console.log('Subscription metadata:', JSON.stringify(subscription.metadata, null, 2));
  console.log('Metadata keys:', Object.keys(subscription.metadata || {}));

  // Try to get user information
  let userId = subscription.metadata?.user_id;
  console.log('Extracted userId from metadata:', userId);
  
  if (!userId) {
    try {
      console.log('No user_id in metadata, attempting to find user by email');
      const customer = await stripe.customers.retrieve(subscription.customer);
      console.log('Customer email:', customer.email);
      
      const { data: userData } = await supabaseClient
        .from('users')
        .select('id')
        .eq('email', customer.email)
        .single();

      userId = userData?.id;
      console.log('Found user by email:', userId);
      
      if (!userId) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Unable to find associated user:', error);
      return new Response(
        JSON.stringify({ error: "Unable to find associated user" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  }

  const subscriptionData: SubscriptionData = {
    stripe_id: subscription.id,
    user_id: userId,
    price_id: subscription.items.data[0]?.price.id,
    stripe_price_id: subscription.items.data[0]?.price.id,
    currency: subscription.currency,
    interval: subscription.items.data[0]?.plan.interval,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    amount: subscription.items.data[0]?.plan.amount ?? 0,
    started_at: subscription.start_date ?? Math.floor(Date.now() / 1000),
    customer_id: subscription.customer,
    metadata: subscription.metadata || {},
    canceled_at: subscription.canceled_at,
    ended_at: subscription.ended_at
  };

  // First, check if a subscription with this stripe_id already exists
  const { data: existingSubscription } = await supabaseClient
    .from('subscriptions')
    .select('id')
    .eq('stripe_id', subscription.id)
    .maybeSingle();

  // Update subscription in database
  const { error } = await supabaseClient
    .from('subscriptions')
    .upsert({
      // If we found an existing subscription, use its UUID, otherwise let Supabase generate one
      ...(existingSubscription?.id ? { id: existingSubscription.id } : {}),
      ...subscriptionData
    }, {
      // Use stripe_id as the match key for upsert
      onConflict: 'stripe_id'
    });

  if (error) {
    console.error('Error creating subscription:', error);
    return new Response(
      JSON.stringify({ error: "Failed to create subscription" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ message: "Subscription created successfully" }),
    { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleSubscriptionUpdated(supabaseClient: SupabaseClient, event: any) {
  const subscription = event.data.object;
  console.log('Handling subscription updated:', subscription.id);

  const { error } = await supabaseClient
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      metadata: subscription.metadata,
      canceled_at: subscription.canceled_at,
      ended_at: subscription.ended_at
    })
    .eq("stripe_id", subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
    return new Response(
      JSON.stringify({ error: "Failed to update subscription" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ message: "Subscription updated successfully" }),
    { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleSubscriptionDeleted(supabaseClient: SupabaseClient, event: any) {
  const subscription = event.data.object;
  console.log('Handling subscription deleted:', subscription.id);

  try {
    await updateSubscriptionStatus(supabaseClient, subscription.id, "canceled");
    
    // If we have email in metadata, update user's subscription status
    if (subscription?.metadata?.email) {
      await supabaseClient
        .from("users")
        .update({ subscription: null })
        .eq("email", subscription.metadata.email);
    }

    return new Response(
      JSON.stringify({ message: "Subscription deleted successfully" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return new Response(
      JSON.stringify({ error: "Failed to process subscription deletion" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleCheckoutSessionCompleted(supabaseClient: SupabaseClient, event: any) {
  const session = event.data.object;
  console.log('Handling checkout session completed:', session.id);
  console.log('Session metadata keys:', Object.keys(session.metadata || {}));
  console.log('Session metadata values:', Object.values(session.metadata || {}));
  console.log('Session metadata user_id:', session.metadata?.user_id);

  try {
    // Get the subscription from the session
    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);
    console.log('Stripe subscription metadata:', JSON.stringify(stripeSubscription.metadata, null, 2));
    
    // Try to get user information
    let userId = session.metadata?.user_id;
    
    if (!userId) {
      console.log('No user_id in session metadata, checking subscription metadata');
      userId = stripeSubscription.metadata?.user_id;
    }
    
    if (!userId) {
      try {
        console.log('No user_id in metadata, attempting to find user by email');
        const customer = await stripe.customers.retrieve(session.customer);
        console.log('Customer email:', customer.email);
        
        const { data: userData } = await supabaseClient
          .from('users')
          .select('id')
          .eq('email', customer.email)
          .single();

        userId = userData?.id;
        console.log('Found user by email:', userId);
        
        if (!userId) {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Unable to find associated user:', error);
        return new Response(
          JSON.stringify({ error: "Unable to find associated user" }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Create subscription data
    const subscriptionData: SubscriptionData = {
      stripe_id: stripeSubscription.id,
      user_id: userId,
      price_id: stripeSubscription.items.data[0]?.price.id,
      stripe_price_id: stripeSubscription.items.data[0]?.price.id,
      currency: stripeSubscription.currency,
      interval: stripeSubscription.items.data[0]?.plan.interval,
      status: stripeSubscription.status,
      current_period_start: stripeSubscription.current_period_start,
      current_period_end: stripeSubscription.current_period_end,
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      amount: stripeSubscription.items.data[0]?.plan.amount ?? 0,
      started_at: stripeSubscription.start_date ?? Math.floor(Date.now() / 1000),
      customer_id: stripeSubscription.customer,
      metadata: {
        ...stripeSubscription.metadata,
        user_id: userId
      },
      canceled_at: stripeSubscription.canceled_at,
      ended_at: stripeSubscription.ended_at
    };

    // First, check if a subscription with this stripe_id already exists
    const { data: existingSubscription } = await supabaseClient
      .from('subscriptions')
      .select('id')
      .eq('stripe_id', stripeSubscription.id)
      .maybeSingle();

    // Update subscription in database
    const { error } = await supabaseClient
      .from('subscriptions')
      .upsert({
        // If we found an existing subscription, use its UUID, otherwise let Supabase generate one
        ...(existingSubscription?.id ? { id: existingSubscription.id } : {}),
        ...subscriptionData
      }, {
        // Use stripe_id as the match key for upsert
        onConflict: 'stripe_id'
      });

    if (error) {
      console.error('Error creating subscription:', error);
      return new Response(
        JSON.stringify({ error: "Failed to create subscription" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Subscription created successfully" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    return new Response(
      JSON.stringify({ error: "Failed to process checkout session" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleInvoicePaymentSucceeded(supabaseClient: SupabaseClient, event: any) {
  const invoice = event.data.object;
  console.log('Handling invoice payment succeeded:', invoice.id);
  
  const subscriptionId = typeof invoice.subscription === 'string' 
    ? invoice.subscription 
    : invoice.subscription?.id;

  try {
    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("stripe_id", subscriptionId)
      .single();

    const webhookData = {
      event_type: event.type,
      type: "invoice",
      stripe_event_id: event.id,
      data: {
        invoiceId: invoice.id,
        subscriptionId,
        amountPaid: String(invoice.amount_paid / 100),
        currency: invoice.currency,
        status: "succeeded",
        email: subscription?.email || invoice.customer_email
      }
    };

    await supabaseClient
      .from("webhook_events")
      .insert(webhookData);

    return new Response(
      JSON.stringify({ message: "Invoice payment succeeded" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing successful payment:', error);
    return new Response(
      JSON.stringify({ error: "Failed to process successful payment" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleInvoicePaymentFailed(supabaseClient: SupabaseClient, event: any) {
  const invoice = event.data.object;
  console.log('Handling invoice payment failed:', invoice.id);
  
  const subscriptionId = typeof invoice.subscription === 'string' 
    ? invoice.subscription 
    : invoice.subscription?.id;

  try {
    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("stripe_id", subscriptionId)
      .single();

    const webhookData = {
      event_type: event.type,
      type: "invoice",
      stripe_event_id: event.id,
      data: {
        invoiceId: invoice.id,
        subscriptionId,
        amountDue: String(invoice.amount_due / 100),
        currency: invoice.currency,
        status: "failed",
        email: subscription?.email || invoice.customer_email
      }
    };

    await supabaseClient
      .from("webhook_events")
      .insert(webhookData);

    if (subscriptionId) {
      await updateSubscriptionStatus(supabaseClient, subscriptionId, "past_due");
    }

    return new Response(
      JSON.stringify({ message: "Invoice payment failed" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing failed payment:', error);
    return new Response(
      JSON.stringify({ error: "Failed to process failed payment" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

// Main webhook handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received webhook request:', req.url);
    
    // Verify the webhook signature
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('No Stripe signature found in request headers');
      return new Response(
        JSON.stringify({ error: "No Stripe signature found" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Get the raw request body
    const body = await req.text();
    console.log('Request body:', body);
    
    let event;
    
    try {
      // Verify the signature
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret
      );
      console.log('Stripe signature verified successfully');
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log('Webhook event type:', event.type);
    console.log('Webhook event data:', JSON.stringify(event.data.object, null, 2));

    // Create Supabase client with service role key to bypass RLS
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Log the webhook event
    try {
      await logAndStoreWebhookEvent(supabaseClient, event, event.data.object);
      console.log('Webhook event logged successfully');
    } catch (error) {
      console.error('Error logging webhook event:', error);
      // Continue processing even if logging fails
    }

    // Handle different event types
    let response;
    
    switch (event.type) {
      case 'checkout.session.completed':
        response = await handleCheckoutSessionCompleted(supabaseClient, event);
        break;
      case 'customer.subscription.created':
        response = await handleSubscriptionCreated(supabaseClient, event);
        break;
      case 'customer.subscription.updated':
        response = await handleSubscriptionUpdated(supabaseClient, event);
        break;
      case 'customer.subscription.deleted':
        response = await handleSubscriptionDeleted(supabaseClient, event);
        break;
      case 'invoice.payment_succeeded':
        response = await handleInvoicePaymentSucceeded(supabaseClient, event);
        break;
      case 'invoice.payment_failed':
        response = await handleInvoicePaymentFailed(supabaseClient, event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        response = new Response(
          JSON.stringify({ received: true, type: event.type }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }
    
    return response;
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: `Webhook error: ${error.message}` }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});


