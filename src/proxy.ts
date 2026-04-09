import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  
  // Skip static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check for auth token
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // ── Protected routes: /dashboard/* and /onboarding ──
  if (pathname.startsWith("/dashboard") || pathname === "/onboarding") {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Redirect authenticated users from login/signup to dashboard ──
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ── Attribution tracking (affiliate & UTM) ──
  const ref = url.searchParams.get('ref');
  const utmSource = url.searchParams.get('utm_source');
  
  const response = NextResponse.next();

  // If a referral code exists, stamp it for 30 days
  if (ref) {
    response.cookies.set({
      name: 'gp_affiliate_id',
      value: ref,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  }

  // Stamp UTM Source for Analytics
  if (utmSource) {
    response.cookies.set({
      name: 'gp_utm_source',
      value: utmSource,
      maxAge: 60 * 60 * 24 * 1, // 1 day
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
