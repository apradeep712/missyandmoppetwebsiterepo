import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Clean the Base URL to avoid double slashes (e.g., //account)
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
  const SITE_URL = rawSiteUrl.replace(/\/$/, '')

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Exchange the temporary code for a permanent user session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // SUCCESS: Using the cleaned SITE_URL to go to /account
      return NextResponse.redirect(`${SITE_URL}/account`)
    }
  }

  // FAILURE: Back to auth with an error message
  return NextResponse.redirect(`${SITE_URL}/auth?error=auth-code-error`)
}