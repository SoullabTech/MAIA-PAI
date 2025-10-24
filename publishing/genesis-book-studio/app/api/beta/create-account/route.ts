import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/beta/create-account
 * Creates a new user account with beta access
 */
export async function POST(request: NextRequest) {
  try {
    const { code, fullName, email, password } = await request.json()

    // Validate inputs
    if (!code || !fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Mock account creation - In production, use Supabase Auth
    console.log('Creating account:', { code, fullName, email })

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock success response
    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: 'mock-user-id',
        email,
        fullName,
        betaTier: 'FOUNDER', // Would come from code validation
      },
      redirectTo: '/welcome',
    })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create account' },
      { status: 500 }
    )
  }
}

/*
 * PRODUCTION VERSION (when Supabase is connected):
 *
 * import { createClient } from '@/lib/supabase/server'
 *
 * const supabase = createClient()
 *
 * // 1. Validate code again (in case status changed)
 * const { data: codeData } = await supabase
 *   .from('beta_codes')
 *   .select('*')
 *   .eq('code', code)
 *   .eq('status', 'available')
 *   .single()
 *
 * if (!codeData) {
 *   return error response
 * }
 *
 * // 2. Create auth user
 * const { data: authData, error: authError } = await supabase.auth.signUp({
 *   email,
 *   password,
 *   options: {
 *     data: {
 *       full_name: fullName,
 *     },
 *   },
 * })
 *
 * if (authError) {
 *   return error response
 * }
 *
 * // 3. Activate beta code using stored function
 * const { data: activationData } = await supabase.rpc('activate_beta_code', {
 *   p_code: code,
 *   p_user_id: authData.user.id,
 * })
 *
 * // 4. Return success
 * return success response with user data
 */
