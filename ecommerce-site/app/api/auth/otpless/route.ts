import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    const cookieStore = await cookies()

    // 1. Initialize Supabase Server Client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // 2. Verify the Token with OTPless Servers
    const otpResponse = await fetch("https://otpless.com/v2/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "appId": process.env.NEXT_PUBLIC_OTPLESS_APP_ID!,
        "appSecret": process.env.OTPLESS_APP_SECRET!
      },
      body: JSON.stringify({ token })
    })

    const userData = await otpResponse.json()

    if (userData.success) {
      // Get the phone number (or email) from OTPless
      const identifier = userData.authDetail.phoneNumber || userData.authDetail.email;

      // 3. Sign into Supabase using an OTP flow 
      // This creates the user in Supabase Auth if they don't exist
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: identifier.startsWith('+') ? identifier : `+${identifier}`,
      })

      if (error) throw error

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Invalid OTPless token" }, { status: 400 })
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}