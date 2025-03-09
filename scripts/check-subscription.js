// Script to check subscription status in the database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const userId = '1a737665-e3bd-47f7-8cd2-c5d2937a9689'; // Your admin user ID

async function checkSubscription() {
  console.log('Checking subscription for user:', userId);
  
  try {
    // Check all users
    console.log('\n--- All Users ---');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (allUsersError) {
      console.error('Error fetching all users:', allUsersError);
    } else {
      console.log('Found', allUsers.length, 'users');
      if (allUsers.length > 0) {
        console.log('First user:', allUsers[0]);
      }
    }
    
    // Check the users table with different ID formats
    console.log('\n--- User Lookup ---');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user by id:', userError);
      
      // Try with user_id field
      const { data: userByUserId, error: userByUserIdError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (userByUserIdError) {
        console.error('Error fetching user by user_id:', userByUserIdError);
      } else {
        console.log('User found by user_id:', userByUserId);
      }
    } else {
      console.log('User found by id:', userData);
    }
    
    // Check all subscriptions
    console.log('\n--- All Subscriptions ---');
    const { data: allSubscriptions, error: allSubsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(5);
    
    if (allSubsError) {
      console.error('Error fetching all subscriptions:', allSubsError);
    } else {
      console.log('Found', allSubscriptions.length, 'total subscriptions');
      if (allSubscriptions.length > 0) {
        console.log('First subscription:', allSubscriptions[0]);
      }
    }
    
    // Check the subscriptions table with different ID formats
    console.log('\n--- User Subscriptions ---');
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);
    
    if (subError) {
      console.error('Error fetching subscriptions by user_id:', subError);
      
      // Try with string format
      const { data: subsByString, error: subsByStringError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId.toString());
      
      if (subsByStringError) {
        console.error('Error fetching subscriptions by user_id string:', subsByStringError);
      } else {
        console.log('Found', subsByString.length, 'subscriptions by user_id string');
      }
    } else {
      console.log('Found', subscriptions.length, 'subscriptions by user_id');
      subscriptions.forEach((sub, index) => {
        console.log(`\nSubscription ${index + 1}:`);
        console.log('ID:', sub.id);
        console.log('Stripe ID:', sub.stripe_id);
        console.log('Status:', sub.status);
        console.log('Created at:', sub.created_at);
        console.log('Current period end:', sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : 'N/A');
      });
    }
    
    // Check subscriptions by metadata
    console.log('\n--- Subscriptions by Metadata ---');
    const { data: metadataSubscriptions, error: metadataError } = await supabase
      .from('subscriptions')
      .select('*')
      .contains('metadata', { user_id: userId });
    
    if (metadataError) {
      console.error('Error fetching subscriptions by metadata:', metadataError);
    } else {
      console.log('Found', metadataSubscriptions.length, 'subscriptions by metadata');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkSubscription(); 