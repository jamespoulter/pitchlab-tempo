// Script to manually sync subscription data from Stripe to the database
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not defined in .env.local');
  console.log('Please add your Stripe secret key to .env.local:');
  console.log('STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const stripe = new Stripe(stripeSecretKey);

const userId = '1a737665-e3bd-47f7-8cd2-c5d2937a9689'; // Your admin user ID

async function syncSubscription() {
  console.log('Syncing subscription for user:', userId);
  
  try {
    // First, ensure the user exists in the users table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (userError) {
      console.error('Error checking if user exists:', userError);
      return;
    }
    
    if (!existingUser) {
      console.log('User does not exist in the database, creating...');
      
      // Create the user record
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: userId,
          user_id: userId,
          email: 'your-email@example.com', // Replace with your actual email
          name: 'Admin User',
          token_identifier: userId,
          created_at: new Date().toISOString()
        });
      
      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }
      
      console.log('User created successfully');
    } else {
      console.log('User already exists:', existingUser);
    }
    
    // Get subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      limit: 10,
      customer: 'cus_RuERHoKuNmYK6I', // Replace with your customer ID if different
    });
    
    console.log(`Found ${subscriptions.data.length} subscriptions in Stripe`);
    
    // Process each subscription
    for (const subscription of subscriptions.data) {
      console.log(`Processing subscription: ${subscription.id}`);
      
      // Check if subscription already exists in the database
      const { data: existingSub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_id', subscription.id)
        .maybeSingle();
      
      if (subError) {
        console.error('Error checking if subscription exists:', subError);
        continue;
      }
      
      // Prepare subscription data
      const subscriptionData = {
        user_id: userId,
        stripe_id: subscription.id,
        price_id: subscription.items.data[0]?.price.id,
        stripe_price_id: subscription.items.data[0]?.price.id,
        currency: subscription.currency,
        interval: subscription.items.data[0]?.plan.interval,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        amount: subscription.items.data[0]?.plan.amount,
        started_at: subscription.start_date,
        customer_id: subscription.customer,
        metadata: subscription.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (existingSub) {
        console.log(`Updating existing subscription: ${subscription.id}`);
        
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update(subscriptionData)
          .eq('id', existingSub.id);
        
        if (updateError) {
          console.error('Error updating subscription:', updateError);
        } else {
          console.log(`Subscription ${subscription.id} updated successfully`);
        }
      } else {
        console.log(`Creating new subscription: ${subscription.id}`);
        
        // Create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert(subscriptionData);
        
        if (insertError) {
          console.error('Error creating subscription:', insertError);
        } else {
          console.log(`Subscription ${subscription.id} created successfully`);
        }
      }
    }
    
    console.log('Subscription sync completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

syncSubscription(); 