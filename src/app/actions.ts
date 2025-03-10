"use server";

import { createClient } from "../../supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/utils/subscription";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  const planId = formData.get("plan_id")?.toString();
  const trialDays = formData.get("trial_days")?.toString();
  const redirectTo = formData.get("redirect_to")?.toString();
  const supabase = await createClient();
  
  // Get the origin - use the production URL if in production
  const isProd = process.env.NODE_ENV === 'production';
  const origin = isProd 
    ? 'https://www.pitchhub.agency' 
    : headers().get("origin") || 'http://localhost:3000';

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback${redirectTo ? `?redirect_to=${redirectTo}` : ''}`,
      data: {
        full_name: fullName,
        email: email,
      }
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          user_id: user.id,
          name: fullName,
          email: email,
          token_identifier: user.id,
          created_at: new Date().toISOString()
        });

      if (updateError) {
        // Error handling without console.error
      }
      
      // Check if the user already has an active subscription
      const hasSubscription = await hasActiveSubscription(supabase, user.id);
      
      // If the user has an active subscription, redirect to dashboard
      if (hasSubscription) {
        return redirect('/dashboard');
      }
      
      // If a plan was selected, proceed to checkout
      if (planId) {
        try {
          const trialPeriodDays = parseInt(trialDays || "7");
          
          const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
            body: {
              price_id: planId,
              user_id: user.id,
              return_url: `${origin}/dashboard`,
              trial_period_days: trialPeriodDays,
            },
            headers: {
              'X-Customer-Email': email || '',
            }
          });
          
          if (checkoutError) {
            // Handle checkout error but still continue with signup success
          } else if (checkoutData?.url) {
            // Redirect to Stripe checkout
            return redirect(checkoutData.url);
          }
        } catch (checkoutErr) {
          // Handle checkout error but still continue with signup success
        }
      } else {
        // If no plan was selected, redirect to pricing page
        // This ensures users go through the subscription flow
        return redirect('/pricing');
      }
    } catch (err) {
      // Error handling without console.error
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (user) {
    // Check for active subscription
    try {
      const hasSubscription = await hasActiveSubscription(supabase, user.id);
      
      // If the user has an active subscription, redirect to dashboard
      if (hasSubscription) {
        return redirect("/dashboard");
      }

      // No active or trialing subscriptions found, redirect to pricing
      return redirect('/pricing');
    } catch (err) {
      // Error handling without console.error
      return redirect('/pricing');
    }
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const signInWithGoogleAction = async (redirectTo?: string) => {
  const supabase = await createClient();
  
  // Get the origin - use the production URL if in production
  const isProd = process.env.NODE_ENV === 'production';
  const origin = isProd 
    ? 'https://www.pitchhub.agency' 
    : headers().get("origin") || 'http://localhost:3000';
  
  // Get the URL parameters from the current request
  const url = new URL(headers().get("referer") || origin || "");
  const urlRedirectTo = url.searchParams.get("redirect_to");
  
  // Use the provided redirectTo, or the one from URL parameters, or default to dashboard
  const finalRedirectTo = redirectTo || urlRedirectTo || "/dashboard";
  
  // If the redirect is to the pricing page, add a query parameter to indicate we should check for subscriptions
  const redirectToWithParams = finalRedirectTo === '/pricing' 
    ? `${finalRedirectTo}?check_subscription=true` 
    : finalRedirectTo;
  
  try {
    // Properly encode the redirect URL to prevent issues with special characters
    const encodedRedirectTo = encodeURIComponent(`${origin}/auth/callback?redirect_to=${encodeURIComponent(redirectToWithParams)}`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?redirect_to=${redirectToWithParams}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("OAuth sign-in error:", error.message);
      throw new Error(error.message);
    }

    if (!data?.url) {
      console.error("No OAuth URL returned");
      throw new Error("Failed to generate authentication URL");
    }

    return data.url;
  } catch (error: any) {
    console.error("Error in signInWithGoogleAction:", error);
    throw new Error(error?.message || "Authentication failed");
  }
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  try {
    console.log("Checking subscription for user:", userId);
    
    // Check for active subscriptions
    const { data: activeSubscriptions, error: activeError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    // Check for trialing subscriptions
    const { data: trialingSubscriptions, error: trialingError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'trialing');

    // If we have active subscriptions
    if (activeSubscriptions && activeSubscriptions.length > 0) {
      console.log("Found active subscription:", activeSubscriptions[0].id);
      
      const subscription = activeSubscriptions[0];
      
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
    }
    
    // If we have trialing subscriptions
    if (trialingSubscriptions && trialingSubscriptions.length > 0) {
      console.log("Found trialing subscription:", trialingSubscriptions[0].id);
      
      const trialingSubscription = trialingSubscriptions[0];
      
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
    
    // No active or trialing subscriptions found
    console.log("No active or trialing subscription found");
    return {
      isSubscribed: false,
      subscription: null,
      trialEnd: null,
      daysRemaining: 0,
      isTrialing: false
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
};

export const updateProfileAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  const fullName = formData.get("full_name")?.toString() || '';
  const bio = formData.get("bio")?.toString() || '';
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "User not authenticated"
    );
  }
  
  // Update user metadata in auth
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      bio: bio,
    },
  });
  
  if (authError) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      `Failed to update profile: ${authError.message}`
    );
  }
  
  // Also update the users table if it exists
  try {
    const { error: dbError } = await supabase
      .from('users')
      .update({
        name: fullName,
        bio: bio,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (dbError && dbError.code !== 'PGRST116') { // Ignore if no rows updated
      console.error("Error updating user in database:", dbError);
    }
  } catch (err) {
    console.error("Error updating user in database:", err);
  }
  
  return encodedRedirect(
    "success",
    "/dashboard/settings",
    "Profile updated successfully"
  );
};

export const updatePasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  const currentPassword = formData.get("current_password")?.toString();
  const newPassword = formData.get("new_password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "All password fields are required"
    );
  }
  
  if (newPassword !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "New passwords do not match"
    );
  }
  
  // First verify the current password by attempting to sign in
  const { data: { user }, error: signInError } = await supabase.auth.getUser();
  
  if (signInError || !user?.email) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "Authentication error"
    );
  }
  
  // Verify current password
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  
  if (verifyError) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "Current password is incorrect"
    );
  }
  
  // Update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (updateError) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      `Failed to update password: ${updateError.message}`
    );
  }
  
  return encodedRedirect(
    "success",
    "/dashboard/settings",
    "Password updated successfully"
  );
};

export const deleteAccountAction = async (formData: FormData) => {
  const supabase = await createClient();
  const confirmation = formData.get("confirmation")?.toString();
  
  if (confirmation !== "DELETE") {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "Please type DELETE to confirm account deletion"
    );
  }
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "User not authenticated"
    );
  }
  
  // First delete user data from database tables
  try {
    // Delete from subscriptions table if exists
    await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id);
      
    // Delete from users table if exists
    await supabase
      .from('users')
      .delete()
      .eq('id', user.id);
      
    // Add more tables as needed
  } catch (err) {
    console.error("Error deleting user data:", err);
  }
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Note: Supabase doesn't have a direct API to delete users
  // In a real app, you would either:
  // 1. Use admin API with service role to delete the user
  // 2. Mark the user as deleted in your database
  // 3. Send a request to your backend to handle the deletion
  
  return redirect("/sign-in?deleted=true");
};
