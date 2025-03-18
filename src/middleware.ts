import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasVisited = request.cookies.get('has_visited');
  
  if (request.nextUrl.pathname === '/' && !hasVisited) {
    const response = NextResponse.redirect(new URL('/landing', request.url));
    response.cookies.set('has_visited', 'true', { 
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
}; 