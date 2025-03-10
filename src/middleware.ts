import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname
  const searchParams = req.nextUrl.searchParams

  // Skip subscription check for non-dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return res
  }

  // Allow Stripe redirect with session_id to pass through
  // This is important for handling post-payment redirects
  const sessionId = searchParams.get('session_id')
  const success = searchParams.get('success')
  
  // If this is a Stripe redirect with a session_id, allow it through
  // The StripeRedirectHandler component will verify the subscription
  if (sessionId && success === 'true') {
    return res
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    // Auth session error handling without console.error
    return NextResponse.redirect(new URL('/sign-in?redirect_to=' + encodeURIComponent(pathname), req.url))
  }

  // If no session, redirect to sign-in
  if (!session) {
    // Store the original URL to redirect back after sign-in
    const redirectUrl = new URL('/sign-in', req.url)
    redirectUrl.searchParams.set('redirect_to', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check for active subscription
  try {
    // Check for active subscriptions
    const { data: activeSubscriptions, error: activeError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active');

    // Check for trialing subscriptions
    const { data: trialingSubscriptions, error: trialingError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'trialing');

    // If we have any active or trialing subscriptions, allow access
    if ((activeSubscriptions && activeSubscriptions.length > 0) || 
        (trialingSubscriptions && trialingSubscriptions.length > 0)) {
      return res;
    }

    // No active or trialing subscriptions found, redirect to pricing
    // Include the original URL to redirect back after subscription
    const redirectUrl = new URL('/pricing', req.url)
    redirectUrl.searchParams.set('redirect_to', pathname)
    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    // Error handling without console.error
    return NextResponse.redirect(new URL('/pricing?redirect_to=' + encodeURIComponent(pathname), req.url))
  }
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/payments/webhook (webhook endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/payments/webhook).*)',
  ],
}
