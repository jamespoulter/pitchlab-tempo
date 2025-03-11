import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Get the domain for cookies
    const isProd = process.env.NODE_ENV === 'production';
    const cookieDomain = isProd ? '.pitchhub.agency' : undefined;

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map(({ name, value }) => ({
              name,
              value,
            }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set domain for cookies in production
              const cookieOptions = isProd 
                ? { ...options, domain: cookieDomain } 
                : options;
                
              request.cookies.set(name, value);
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set(name, value, cookieOptions);
            });
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user }, error } = await supabase.auth.getUser();

    // Handle protected routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      // If not authenticated, redirect to sign-in
      if (error || !user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
      
      // Check if user has an active subscription
      try {
        // Query for active subscriptions
        const { data: activeSubscriptions, error: activeError } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active');

        // Query for trialing subscriptions
        const { data: trialingSubscriptions, error: trialingError } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'trialing');

        // If no active or trialing subscriptions, redirect to pricing page
        if (
          (!activeSubscriptions || activeSubscriptions.length === 0) && 
          (!trialingSubscriptions || trialingSubscriptions.length === 0)
        ) {
          return NextResponse.redirect(new URL("/pricing", request.url));
        }
      } catch (subscriptionError) {
        console.error('Error checking subscription status:', subscriptionError);
        // If there's an error checking subscription, still allow access
        // This prevents locking users out due to database errors
      }
    }

    // Handle auth routes for authenticated users
    if ((request.nextUrl.pathname === "/sign-in" || request.nextUrl.pathname === "/sign-up") && user) {
      // Check if user has an active subscription
      try {
        // Query for active or trialing subscriptions
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing']);

        // If user has an active subscription, redirect to dashboard
        if (subscriptions && subscriptions.length > 0) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        
        // Otherwise, redirect to pricing page
        return NextResponse.redirect(new URL("/pricing", request.url));
      } catch (subscriptionError) {
        console.error('Error checking subscription status:', subscriptionError);
        // If there's an error checking subscription, redirect to pricing
        return NextResponse.redirect(new URL("/pricing", request.url));
      }
    }

    // Handle root path for authenticated users
    if (request.nextUrl.pathname === "/" && user) {
      // Check if user has an active subscription
      try {
        // Query for active or trialing subscriptions
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing']);

        // If user has an active subscription, redirect to dashboard
        if (subscriptions && subscriptions.length > 0) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        
        // Otherwise, redirect to pricing page
        return NextResponse.redirect(new URL("/pricing", request.url));
      } catch (subscriptionError) {
        console.error('Error checking subscription status:', subscriptionError);
        // If there's an error checking subscription, redirect to pricing
        return NextResponse.redirect(new URL("/pricing", request.url));
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
