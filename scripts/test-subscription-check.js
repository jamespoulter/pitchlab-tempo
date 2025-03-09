// Script to test the subscription check function directly
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const userId = '1a737665-e3bd-47f7-8cd2-c5d2937a9689'; // Your admin user ID

async function checkSubscription() {
  console.log('Checking subscription for user:', userId);
  
  try {
    // First try to find an active subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.log("No active subscription found, error:", error.message);
      
      // If no active subscription, check for trialing subscriptions
      const { data: trialingSubscription, error: trialingError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'trialing')
        .single();
        
      if (trialingError || !trialingSubscription) {
        console.log("No trialing subscription found either");
        return {
          isSubscribed: false,
          subscription: null,
          trialEnd: null,
          daysRemaining: 0,
          isTrialing: false
        };
      }
      
      // Use the trialing subscription
      console.log("Found trialing subscription:", trialingSubscription.id);
      
      // Calculate days remaining in trial
      let daysRemaining = 0;
      if (trialingSubscription.trial_end) {
        const trialEnd = new Date(trialingSubscription.trial_end * 1000); // Convert from Unix timestamp
        const today = new Date();
        const diffTime = trialEnd.getTime() - today.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      
      return {
        isSubscribed: true,
        subscription: trialingSubscription,
        trialEnd: trialingSubscription.trial_end,
        daysRemaining,
        isTrialing: true
      };
    }

    // If we found an active subscription
    console.log("Found active subscription:", subscription.id);
    
    // Check if subscription is in trial period
    const isTrialing = subscription.trial_end ? new Date(subscription.trial_end * 1000) > new Date() : false;
    
    // Calculate days remaining in trial
    let daysRemaining = 0;
    if (isTrialing && subscription.trial_end) {
      const trialEnd = new Date(subscription.trial_end * 1000); // Convert from Unix timestamp
      const today = new Date();
      const diffTime = trialEnd.getTime() - today.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      isSubscribed: true,
      subscription,
      trialEnd: subscription.trial_end,
      daysRemaining,
      isTrialing
    };
  } catch (err) {
    console.error("Error checking subscription:", err);
    return {
      isSubscribed: false,
      subscription: null,
      trialEnd: null,
      daysRemaining: 0,
      isTrialing: false
    };
  }
}

async function run() {
  // First, let's check all subscriptions without filtering
  const { data: allSubscriptions, error: allSubsError } = await supabase
    .from('subscriptions')
    .select('*');
    
  if (allSubsError) {
    console.error('Error fetching all subscriptions:', allSubsError);
  } else {
    console.log(`Found ${allSubscriptions.length} total subscriptions:`);
    allSubscriptions.forEach((sub, index) => {
      console.log(`\nSubscription ${index + 1}:`);
      console.log('ID:', sub.id);
      console.log('Stripe ID:', sub.stripe_id);
      console.log('User ID:', sub.user_id);
      console.log('Status:', sub.status);
    });
  }
  
  // Now check subscriptions for the specific user
  const { data: userSubscriptions, error: userSubsError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId);
    
  if (userSubsError) {
    console.error('Error fetching user subscriptions:', userSubsError);
  } else {
    console.log(`\nFound ${userSubscriptions.length} subscriptions for user ${userId}:`);
    userSubscriptions.forEach((sub, index) => {
      console.log(`\nUser Subscription ${index + 1}:`);
      console.log('ID:', sub.id);
      console.log('Stripe ID:', sub.stripe_id);
      console.log('User ID:', sub.user_id);
      console.log('Status:', sub.status);
    });
  }
  
  // Now run the subscription check function
  const result = await checkSubscription();
  console.log('\nSubscription check result:');
  console.log('isSubscribed:', result.isSubscribed);
  console.log('isTrialing:', result.isTrialing);
  console.log('daysRemaining:', result.daysRemaining);
  
  if (result.subscription) {
    console.log('\nSubscription details:');
    console.log('ID:', result.subscription.id);
    console.log('Stripe ID:', result.subscription.stripe_id);
    console.log('Status:', result.subscription.status);
    console.log('User ID:', result.subscription.user_id);
  }
}

run(); 