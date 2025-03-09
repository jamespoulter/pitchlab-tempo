import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Skip subscription check for non-dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return res
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    // Auth session error handling without console.error
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // If no session, redirect to sign-in
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
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
    return NextResponse.redirect(new URL('/pricing', req.url))
  } catch (err) {
    // Error handling without console.error
    return NextResponse.redirect(new URL('/pricing', req.url))
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
     * - api/polar/webhook (webhook endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/payments/webhook).*)',
  ],
}
