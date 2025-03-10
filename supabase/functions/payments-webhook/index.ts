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

// Get Stripe API key
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
// Determine if we're in test mode
const isTestMode = stripeKey.startsWith('sk_test_');

console.log("Webhook running in", isTestMode ? "TEST MODE" : "LIVE MODE");

// Test mode configuration
const TEST_PRICE_ID = 'price_1R07PCI7Diy7LoDfEfcS7u3L';
const TEST_PRODUCT_ID = 'prod_RtvFwU7NJ0AK7g';

// @ts-ignore - Deno is available in the Supabase Edge Functions environment
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
  console.log('Is test mode event:', !event.livemode);

  // Try to get user information
  let userId = subscription.metadata?.user_id || subscription.metadata?.supabase_user_id;
  console.log('Extracted userId from metadata:', userId);
  
  if (!userId) {
    try {
      console.log('No user_id in metadata, attempting to find user by email');
      
      // Get the customer to find their email
      const customer = await stripe.customers.retrieve(subscription.customer);
      console.log('Found customer:', customer.id);
      
      if ('email' in customer && customer.email) {
        console.log('Customer email:', customer.email);
        
        // Look up the user by email
        const { data: users, error } = await supabaseClient
          .from('users')
          .select('id')
          .eq('email', customer.email)
          .limit(1);
          
        if (error) {
          console.error('Error finding user by email:', error);
        } else if (users && users.length > 0) {
          userId = users[0].id;
          console.log('Found user by email:', userId);
        } else {
          console.log('No user found with email:', customer.email);
        }
      } else {
        console.log('Customer has no email');
      }
    } catch (error) {
      console.error('Error retrieving customer or finding user:', error);
    }
  }
  
  if (!userId) {
    console.error('Could not determine user_id for subscription:', subscription.id);
    return;
  }
  
  // Get price information
  let priceId = subscription.items.data[0]?.price.id;
  let productId = subscription.items.data[0]?.price.product;
  
  console.log('Price ID:', priceId);
  console.log('Product ID:', productId);
  
  // In test mode, validate against our test price and product
  if (isTestMode && !event.livemode) {
    if (priceId !== TEST_PRICE_ID) {
      console.warn(`Test mode: Price ID ${priceId} doesn't match test price ${TEST_PRICE_ID}, but proceeding anyway`);
    }
    if (productId !== TEST_PRODUCT_ID) {
      console.warn(`Test mode: Product ID ${productId} doesn't match test product ${TEST_PRODUCT_ID}, but proceeding anyway`);
    }
  }
  
  // Get price details
  let price;
  try {
    price = await stripe.prices.retrieve(priceId);
    console.log('Price details:', JSON.stringify({
      id: price.id,
      currency: price.currency,
      unit_amount: price.unit_amount,
      recurring: price.recurring
    }, null, 2));
  } catch (error) {
    console.error('Error retrieving price:', error);
    // In test mode, fall back to test price if there's an error
    if (isTestMode && !event.livemode) {
      console.log('Falling back to test price in test mode');
      try {
        price = await stripe.prices.retrieve(TEST_PRICE_ID);
        priceId = TEST_PRICE_ID;
      } catch (fallbackError) {
        console.error('Error retrieving fallback test price:', fallbackError);
        return;
      }
    } else {
      return;
    }
  }
  
  // Prepare subscription data
  const subscriptionData: SubscriptionData = {
    stripe_id: subscription.id,
    user_id: userId,
    price_id: priceId,
    stripe_price_id: priceId,
    currency: price.currency,
    interval: price.recurring?.interval || 'month',
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    amount: price.unit_amount || 0,
    started_at: subscription.start_date,
    customer_id: subscription.customer,
    metadata: {
      ...subscription.metadata,
      test_mode: !event.livemode ? 'true' : 'false'
    }
  };
  
  console.log('Inserting subscription data:', JSON.stringify(subscriptionData, null, 2));
  
  // Check if subscription already exists
  const { data: existingSubscriptions, error: lookupError } = await supabaseClient
    .from('subscriptions')
    .select('id, stripe_id')
    .eq('stripe_id', subscription.id)
    .limit(1);
    
  if (lookupError) {
    console.error('Error looking up existing subscription:', lookupError);
    return;
  }
  
  if (existingSubscriptions && existingSubscriptions.length > 0) {
    console.log('Subscription already exists, updating:', existingSubscriptions[0].id);
    
    // Update existing subscription
    const { error: updateError } = await supabaseClient
      .from('subscriptions')
      .update(subscriptionData)
      .eq('stripe_id', subscription.id);
      
    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return;
    }
    
    console.log('Subscription updated successfully');
  } else {
    console.log('Creating new subscription record');
    
    // Insert new subscription
    const { error: insertError } = await supabaseClient
      .from('subscriptions')
      .insert(subscriptionData);
      
    if (insertError) {
      console.error('Error inserting subscription:', insertError);
      return;
    }
    
    console.log('Subscription created successfully');
  }
  
  // Update user's subscription status
  try {
    const { error: userUpdateError } = await supabaseClient
      .from('users')
      .update({
        has_active_subscription: true,
        subscription_status: subscription.status,
        subscription_id: subscription.id,
        subscription_price_id: priceId,
        subscription_created_at: new Date(subscription.start_date * 1000).toISOString()
      })
      .eq('id', userId);
      
    if (userUpdateError) {
      console.error('Error updating user subscription status:', userUpdateError);
    } else {
      console.log('User subscription status updated successfully');
    }
  } catch (error) {
    console.error('Error updating user subscription status:', error);
  }
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
  console.log('Session metadata:', JSON.stringify(session.metadata, null, 2));
  
  // Try to get user information from multiple sources in order of reliability
  let userId = session.metadata?.user_id || 
               session.metadata?.supabase_user_id || 
               session.client_reference_id; // Added client_reference_id as a source
               
  console.log('Extracted userId from metadata/client_reference_id:', userId);
  
  if (!userId && session.customer_details?.email) {
    try {
      console.log('No user_id found, attempting to find user by email:', session.customer_details.email);
      
      // Look up the user by email
      const { data: users, error } = await supabaseClient
        .from('users')
        .select('id')
        .eq('email', session.customer_details.email)
        .limit(1);
        
      if (error) {
        console.error('Error finding user by email:', error);
      } else if (users && users.length > 0) {
        userId = users[0].id;
        console.log('Found user by email:', userId);
      } else {
        console.log('No user found with email:', session.customer_details.email);
      }
    } catch (error) {
      console.error('Error finding user by email:', error);
    }
  }
  
  if (!userId) {
    console.error('Could not determine user_id for checkout session:', session.id);
    return;
  }
  
  const subscriptionId = typeof session.subscription === 'string' 
    ? session.subscription 
    : session.subscription?.id;
  
  console.log('Extracted subscriptionId:', subscriptionId);
  
  if (!subscriptionId) {
    console.log('No subscription ID found in checkout session');
    return new Response(
      JSON.stringify({ message: "No subscription in checkout session" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    console.log('Attempting to update subscription in Stripe with ID:', subscriptionId);
    
    // Fetch the current subscription from Stripe to get the latest status
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log('Retrieved Stripe subscription status:', stripeSubscription.status);
    
    // Update the Stripe subscription with enhanced metadata
    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscriptionId,
      { 
        metadata: {
          ...session.metadata,
          checkoutSessionId: session.id,
          user_id: userId, // Ensure user_id is in the Stripe metadata
          completed_at: new Date().toISOString() // Add completion timestamp
        }
      }
    );
    
    console.log('Successfully updated Stripe subscription:', updatedStripeSubscription.id);

    // Update or create the subscription record in Supabase
    const { data: existingSubscription } = await supabaseClient
      .from("subscriptions")
      .select("id")
      .eq("stripe_id", subscriptionId)
      .single();
      
    const subscriptionData = {
      stripe_id: subscriptionId,
      user_id: userId,
      status: stripeSubscription.status,
      price_id: stripeSubscription.items.data[0]?.price.id,
      customer_id: stripeSubscription.customer,
      current_period_start: stripeSubscription.current_period_start,
      current_period_end: stripeSubscription.current_period_end,
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      metadata: {
        ...session.metadata,
        checkoutSessionId: session.id,
        completed_at: new Date().toISOString()
      }
    };
    
    let supabaseUpdateResult;
    
    if (existingSubscription) {
      // Update existing subscription
      console.log('Updating existing subscription in Supabase:', existingSubscription.id);
      supabaseUpdateResult = await supabaseClient
        .from("subscriptions")
        .update(subscriptionData)
        .eq("stripe_id", subscriptionId);
    } else {
      // Create new subscription record
      console.log('Creating new subscription record in Supabase');
      supabaseUpdateResult = await supabaseClient
        .from("subscriptions")
        .insert(subscriptionData);
    }
    
    console.log('Supabase update result:', JSON.stringify(supabaseUpdateResult, null, 2));
    
    if (supabaseUpdateResult.error) {
      console.error('Error updating Supabase subscription:', supabaseUpdateResult.error);
      throw new Error(`Supabase update failed: ${supabaseUpdateResult.error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        message: "Checkout session completed successfully",
        subscriptionId,
        userId
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error processing checkout completion:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ error: "Failed to process checkout completion", details: error.message }),
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
serve(async (req: Request) => {
  console.log('Received webhook request');
  console.log('Method:', req.method);
  
  // Log headers in a way that works with the current TypeScript configuration
  const headersObj: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  console.log('Headers:', JSON.stringify(headersObj, null, 2));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    console.log('Stripe signature:', signature);
    
    if (!signature) {
      console.error('No Stripe signature found in headers');
      return new Response(
        JSON.stringify({ error: "No signature found" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.text();
    console.log('Request body:', body);
    
    // @ts-ignore - Deno is available in the Supabase Edge Functions environment
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('Webhook secret not configured in environment variables');
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let event;
    
    try {
      console.log('Attempting to verify Stripe signature');
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
      console.log('Stripe signature verified successfully');
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Processing webhook event:', event.type);

    // Create Supabase client with service role key to bypass RLS
    // @ts-ignore - Deno is available in the Supabase Edge Functions environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    // @ts-ignore - Deno is available in the Supabase Edge Functions environment
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase credentials:', { 
        hasUrl: !!supabaseUrl, 
        hasServiceKey: !!supabaseServiceRoleKey 
      });
      return new Response(
        JSON.stringify({ error: "Supabase credentials not configured properly" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log('Creating Supabase client with service role key to bypass RLS');
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Log the webhook event
    await logAndStoreWebhookEvent(supabaseClient, event, event.data.object);

    // Handle the event based on type
    switch (event.type) {
      case 'customer.subscription.created':
        return await handleSubscriptionCreated(supabaseClient, event);
      case 'customer.subscription.updated':
        return await handleSubscriptionUpdated(supabaseClient, event);
      case 'customer.subscription.deleted':
        return await handleSubscriptionDeleted(supabaseClient, event);
      case 'checkout.session.completed':
        return await handleCheckoutSessionCompleted(supabaseClient, event);
      case 'invoice.payment_succeeded':
        return await handleInvoicePaymentSucceeded(supabaseClient, event);
      case 'invoice.payment_failed':
        return await handleInvoicePaymentFailed(supabaseClient, event);
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return new Response(
          JSON.stringify({ message: `Unhandled event type: ${event.type}` }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    console.error('Error stack:', err.stack);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});