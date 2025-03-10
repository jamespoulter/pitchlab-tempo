import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";
import { hasActiveSubscription } from "@/utils/subscription";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");

  console.log("Auth callback received:", {
    url: request.url,
    code: code ? "present" : "missing",
    redirect_to,
    error,
    error_description
  });

  // Get the origin - use the production URL if in production
  const isProd = process.env.NODE_ENV === 'production';
  const origin = isProd 
    ? 'https://www.pitchhub.agency' 
    : requestUrl.origin;

  console.log("Using origin:", origin);

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth error: ${error}`, error_description);
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error_description || error)}`, origin)
    );
  }

  if (!code) {
    console.error("No code parameter in callback URL");
    return NextResponse.redirect(
      new URL('/sign-in?error=Authentication+failed', origin)
    );
  }

  try {
    console.log("Creating Supabase client and exchanging code for session");
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, origin)
        );
      }
      
      if (!data?.user) {
        console.error("No user data returned from session exchange");
        return NextResponse.redirect(
          new URL('/sign-in?error=Authentication+failed', origin)
        );
      }
      
      console.log("Successfully authenticated user:", data.user.id);
      
      // Check if this is a new user (first sign in with Google)
      const isNewUser = data.user.app_metadata.provider === 'google' && 
                        data.user.created_at === data.user.updated_at;
      
      console.log("Is new user:", isNewUser);
      
      // For Google OAuth users, ensure we have a user record in our database
      // This is a fallback in case the database trigger didn't work
      if (data.user.app_metadata.provider === 'google') {
        try {
          // First check if the user already exists in the users table
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', data.user.id)
            .single();
          
          console.log("Existing user check:", existingUser ? "found" : "not found");
          
          // Only create a new user record if one doesn't already exist
          if (!existingUser) {
            console.log("Creating new user record in users table");
            
            // Extract name from user metadata
            const name = data.user.user_metadata.full_name || 
                      data.user.user_metadata.name || 
                      data.user.email?.split('@')[0] || 
                      'User';
                      
            // Extract avatar URL from user metadata
            const avatarUrl = data.user.user_metadata.avatar_url || 
                           data.user.user_metadata.picture || 
                           null;
            
            // Create a user record in the users table
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                user_id: data.user.id,
                name: name,
                full_name: data.user.user_metadata.full_name || name,
                email: data.user.email,
                avatar_url: avatarUrl,
                token_identifier: data.user.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            
            if (insertError) {
              console.error('Error creating user record:', insertError);
              // Log more details about the error
              console.error('Error details:', JSON.stringify(insertError));
            } else {
              console.log("Successfully created user record");
            }
          }
        } catch (userError) {
          console.error('Error handling Google user:', userError);
          // Continue with the flow even if there's an error creating the user record
        }
      }
      
      // If the redirect is to the pricing page, check if the user already has an active subscription
      if (redirect_to === '/pricing' || redirect_to?.startsWith('/pricing?')) {
        try {
          console.log("Checking for active subscription");
          // Check if the user has an active subscription
          const hasSubscription = await hasActiveSubscription(supabase, data.user.id);
          
          console.log("Has active subscription:", hasSubscription);
          
          // If the user has an active subscription, redirect to dashboard instead
          if (hasSubscription) {
            console.log("Redirecting to dashboard due to active subscription");
            return NextResponse.redirect(new URL('/dashboard', origin));
          }
        } catch (subscriptionError) {
          console.error('Error checking subscription:', subscriptionError);
          // Continue with the normal flow if there's an error checking the subscription
        }
      }

      // URL to redirect to after sign in process completes
      const redirectTo = redirect_to || "/pricing";
      console.log("Final redirect to:", redirectTo);
      return NextResponse.redirect(new URL(redirectTo, origin));
    } catch (sessionError) {
      console.error("Error in session exchange:", sessionError);
      return NextResponse.redirect(
        new URL('/sign-in?error=Session+exchange+failed', origin)
      );
    }
  } catch (error) {
    console.error("Unexpected error in auth callback:", error);
    return NextResponse.redirect(
      new URL('/sign-in?error=Authentication+failed', origin)
    );
  }
} 