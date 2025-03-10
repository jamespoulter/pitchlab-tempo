import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";
import { hasActiveSubscription } from "@/utils/subscription";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth error: ${error}`, error_description);
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    );
  }

  if (!code) {
    console.error("No code parameter in callback URL");
    return NextResponse.redirect(
      new URL('/sign-in?error=Authentication+failed', requestUrl.origin)
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }
    
    if (!data?.user) {
      console.error("No user data returned from session exchange");
      return NextResponse.redirect(
        new URL('/sign-in?error=Authentication+failed', requestUrl.origin)
      );
    }
    
    // Check if this is a new user (first sign in with Google)
    const isNewUser = data.user.app_metadata.provider === 'google' && 
                      data.user.created_at === data.user.updated_at;
    
    if (isNewUser) {
      try {
        // First check if the user already exists in the users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single();
        
        // Only create a new user record if one doesn't already exist
        if (!existingUser) {
          // Create a user record in the users table
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              user_id: data.user.id,
              name: data.user.user_metadata.full_name || data.user.user_metadata.name,
              email: data.user.email,
              token_identifier: data.user.id,
              created_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error('Error creating user record:', insertError);
            // Log more details about the error
            console.error('Error details:', JSON.stringify(insertError));
          }
        }
      } catch (userError) {
        console.error('Error handling new user:', userError);
        // Continue with the flow even if there's an error creating the user record
      }
    }
    
    // If the redirect is to the pricing page, check if the user already has an active subscription
    if (redirect_to === '/pricing' || redirect_to?.startsWith('/pricing?')) {
      try {
        // Check if the user has an active subscription
        const hasSubscription = await hasActiveSubscription(supabase, data.user.id);
        
        // If the user has an active subscription, redirect to dashboard instead
        if (hasSubscription) {
          return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
        }
      } catch (subscriptionError) {
        console.error('Error checking subscription:', subscriptionError);
        // Continue with the normal flow if there's an error checking the subscription
      }
    }

    // URL to redirect to after sign in process completes
    const redirectTo = redirect_to || "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
  } catch (error) {
    console.error("Unexpected error in auth callback:", error);
    return NextResponse.redirect(
      new URL('/sign-in?error=Authentication+failed', requestUrl.origin)
    );
  }
} 