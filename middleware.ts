import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Let the user access /admin/login freely
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // In full Supabase implementation, we would inspect session cookies.
    // For demo purposes and until Supabase is connected, we allow all dashboard access,
    // or let it proceed to let layout handle the fallback warning client side.
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
