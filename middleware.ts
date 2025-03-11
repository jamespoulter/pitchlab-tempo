import React from "react";
import { updateSession } from "./supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Handle domain redirects if needed
  const host = request.headers.get('host');
  const isProd = process.env.NODE_ENV === 'production';
  
  // Redirect from non-www to www in production
  if (isProd && host && host === 'pitchhub.agency') {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname, 'https://www.pitchhub.agency')
    );
  }
  
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
