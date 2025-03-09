import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Check if this is a new user (first sign in with Google)
      const isNewUser = data.user.app_metadata.provider === 'google' && 
                        data.user.created_at === data.user.updated_at;
      
      if (isNewUser) {
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
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  const redirectTo = redirect_to || "/dashboard";
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
} 