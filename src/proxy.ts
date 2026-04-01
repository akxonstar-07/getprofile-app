import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  // Only process standard profile/page visits (ignore static assets or API routes)
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Look for Common Attribution query parameters
  const ref = url.searchParams.get('ref');
  const utmSource = url.searchParams.get('utm_source');
  
  const response = NextResponse.next();

  // If a referral code exists, stamp it so their future purchases in the Store are attributed
  if (ref) {
    response.cookies.set({
      name: 'gp_affiliate_id',
      value: ref,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  }

  // Stamp UTM Source for Analytics (e.g. from a Link in a TikTok bio)
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
  // Apply this middleware to every route EXCEPT API & internal next files
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
