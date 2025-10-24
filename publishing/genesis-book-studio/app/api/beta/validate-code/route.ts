import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/beta/validate-code
 * Validates a beta access code
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Beta code is required' },
        { status: 400 }
      )
    }

    // Mock validation - In production, query Supabase
    const validCodes = {
      'GENESIS-BETA-FOUNDER-ALCHEMY2025': {
        tier: 'FOUNDER',
        status: 'activated',
        message: 'This code has already been used',
      },
      'GENESIS-BETA-FOUNDER-TRANSFORM01': {
        tier: 'FOUNDER',
        status: 'available',
      },
      'GENESIS-BETA-FOUNDER-AWAKEN01': {
        tier: 'FOUNDER',
        status: 'available',
      },
      'GENESIS-BETA-CREATOR-WISDOM02': {
        tier: 'CREATOR',
        status: 'available',
      },
      'GENESIS-BETA-CREATOR-TRANSFORM01': {
        tier: 'CREATOR',
        status: 'available',
      },
      'GENESIS-BETA-PARTNER-SOULLAB01': {
        tier: 'PARTNER',
        status: 'available',
      },
    }

    const codeData = validCodes[code as keyof typeof validCodes]

    if (!codeData) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid beta code. Please check and try again.',
        },
        { status: 404 }
      )
    }

    if (codeData.status === 'activated') {
      return NextResponse.json(
        {
          success: false,
          message: 'This code has already been used.',
        },
        { status: 400 }
      )
    }

    if (codeData.status === 'revoked') {
      return NextResponse.json(
        {
          success: false,
          message: 'This code has been revoked.',
        },
        { status: 400 }
      )
    }

    // Code is valid and available
    return NextResponse.json({
      success: true,
      codeData: {
        tier: codeData.tier,
        benefits: getBenefits(codeData.tier),
      },
    })
  } catch (error) {
    console.error('Error validating beta code:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

function getBenefits(tier: string) {
  const benefits = {
    FOUNDER: [
      'Founding member status (forever!)',
      'Special founder badge',
      'Listed in founding credits',
      '6 months free beta access',
      '50% lifetime discount after beta',
      'Priority support & feature requests',
      'Direct line to founders',
    ],
    CREATOR: [
      '6 months free beta access',
      '50% lifetime discount after beta',
      'Full platform access',
      'Team workspace (5 members)',
      'MAIA AI assistants',
      'Priority support',
    ],
    PARTNER: [
      'All CREATOR benefits',
      'Extended team (10 members)',
      'Co-branding options',
      'Joint case studies',
      'Partner recognition',
    ],
  }

  return benefits[tier as keyof typeof benefits] || benefits.CREATOR
}

/*
 * PRODUCTION VERSION (when Supabase is connected):
 *
 * import { createClient } from '@/lib/supabase/server'
 *
 * const supabase = createClient()
 *
 * const { data, error } = await supabase
 *   .from('beta_codes')
 *   .select('*')
 *   .eq('code', code)
 *   .single()
 *
 * if (error || !data) {
 *   return invalid code response
 * }
 *
 * if (data.status !== 'available') {
 *   return already used response
 * }
 *
 * return success with data.tier
 */
