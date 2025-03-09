// Script to check webhook events in the database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWebhookEvents() {
  console.log('Checking webhook events...');
  
  try {
    // Check webhook_events table
    const { data: webhookEvents, error: webhookError } = await supabase
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (webhookError) {
      console.error('Error fetching webhook events:', webhookError);
      return;
    }
    
    console.log(`Found ${webhookEvents.length} webhook events:`);
    webhookEvents.forEach((event, index) => {
      console.log(`\nEvent ${index + 1}:`);
      console.log('Type:', event.event_type);
      console.log('Stripe Event ID:', event.stripe_event_id);
      console.log('Created at:', event.created_at);
      
      // Check if the event is subscription-related
      if (event.event_type.includes('subscription')) {
        console.log('Subscription event details:');
        if (event.data && event.data.id) {
          console.log('Subscription ID:', event.data.id);
          console.log('Status:', event.data.status);
          console.log('Customer:', event.data.customer);
          
          if (event.data.metadata) {
            console.log('Metadata:', event.data.metadata);
          }
        }
      }
    });
    
    // Check subscriptions table
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      return;
    }
    
    console.log(`\nFound ${subscriptions.length} subscriptions:`);
    subscriptions.forEach((sub, index) => {
      console.log(`\nSubscription ${index + 1}:`);
      console.log('ID:', sub.id);
      console.log('Stripe ID:', sub.stripe_id);
      console.log('User ID:', sub.user_id);
      console.log('Status:', sub.status);
      console.log('Created at:', sub.created_at);
    });
    
    // Check if there are any subscription events that don't have corresponding subscriptions
    if (webhookEvents.length > 0 && subscriptions.length > 0) {
      console.log('\nChecking for missing subscriptions...');
      
      const subscriptionEvents = webhookEvents.filter(event => 
        event.event_type.includes('subscription') && 
        event.data && 
        event.data.id
      );
      
      const subscriptionIds = subscriptions.map(sub => sub.stripe_id);
      
      const missingSubscriptions = subscriptionEvents.filter(event => 
        !subscriptionIds.includes(event.data.id)
      );
      
      if (missingSubscriptions.length > 0) {
        console.log(`Found ${missingSubscriptions.length} subscription events without corresponding subscriptions:`);
        missingSubscriptions.forEach((event, index) => {
          console.log(`\nMissing subscription ${index + 1}:`);
          console.log('Event type:', event.event_type);
          console.log('Subscription ID:', event.data.id);
          console.log('Created at:', event.created_at);
        });
      } else {
        console.log('All subscription events have corresponding subscriptions.');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkWebhookEvents(); 