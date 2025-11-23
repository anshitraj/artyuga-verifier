import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add cache control header for homepage
  if (request.nextUrl.pathname === '/') {
    response.headers.set('Cache-Control', 'max-age=0');
  }
  
  return response;
}

export const config = {
  matcher: '/',
};

