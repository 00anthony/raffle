// middleware.ts (temporary debug version)
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

type CookieToSet = { name: string; value: string; options?: CookieOptions }

export async function middleware(request: NextRequest) {
  console.log('[middleware]', request.nextUrl.pathname)

  if (!request.nextUrl.pathname.startsWith('/admin')) return NextResponse.next()

  if (request.nextUrl.pathname === '/admin/login') {
    console.log('[middleware] skipping — exact match on /admin/login')
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: CookieToSet[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  console.log('[middleware] user:', user?.id ?? 'none')

  if (!user) {
    console.log('[middleware] redirecting to /admin/login')
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}