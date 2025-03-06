import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log("Hello This project is made by Rishabh Rajput and Manisha Swain");
  const token = request.cookies.get('ams_token')?.value;
  const userRole = request.cookies.get('ams_user_role')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicPaths = ['/login', '/signup'];
  
  // Redirect authenticated users from public routes
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protected routes
  const protectedPaths = [
    '/dashboard/admin/overview',
    '/dashboard/admin/alumni',
    '/dashboard/admin/alumni/request',
    '/dashboard/admin/faculty',
    '/dashboard/admin/event/upcoming',
    '/dashboard/admin/event/past-event',
    '/dashboard/admin/event/request',
    '/dashboard/admin/event/rejected-event',
    '/dashboard/faculty/event/upcoming',
     '/dashboard/faculty/overview',
    '/dashboard/faculty/event/past-event',
    '/dashboard/faculty/certificates',
    '/dashboard/alumni/overview',
    '/dashboard/alumni/event/upcoming',
    '/dashboard/alumni/event/past-event',
    '/dashboard/alumni/certificates',
    '/dashboard/alumni/job-opportunity',

  ];

  if (!token && protectedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

// Applies middleware to specific paths
export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/login',
    '/signup',
    '/dashboard/admin/overview',
    '/dashboard/admin/alumni',
    '/dashboard/admin/alumni/request',
    '/dashboard/admin/faculty',
    '/dashboard/admin/event/upcoming',
    '/dashboard/admin/event/past-event',
    '/dashboard/admin/event/request',
    '/dashboard/admin/event/rejected-event',
    '/dashboard/faculty/event/upcoming',
     '/dashboard/faculty/overview',
    '/dashboard/faculty/event/past-event',
    '/dashboard/faculty/certificates',
    '/dashboard/alumni/overview',
    '/dashboard/alumni/event/upcoming',
    '/dashboard/alumni/event/past-event',
    '/dashboard/alumni/certificates',
    '/dashboard/alumni/job-opportunity',
  ]
};
