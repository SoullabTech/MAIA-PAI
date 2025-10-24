'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  BookOpen,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefilledCode = searchParams.get('code') || ''

  const [step, setStep] = useState<'code' | 'details'>('code')
  const [betaCode, setBetaCode] = useState(prefilledCode)
  const [validatedCode, setValidatedCode] = useState<any>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isValidating, setIsValidating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  // Validate beta code
  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsValidating(true)

    try {
      const response = await fetch('/api/beta/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: betaCode }),
      })

      const result = await response.json()

      if (result.success) {
        setValidatedCode(result.codeData)
        setStep('details')
      } else {
        setError(result.message || 'Invalid beta code')
      }
    } catch (err) {
      setError('Failed to validate code. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  // Create account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsCreating(true)

    try {
      const response = await fetch('/api/beta/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: betaCode,
          fullName,
          email,
          password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to dashboard or welcome page
        router.push('/welcome')
      } else {
        setError(result.message || 'Failed to create account')
      }
    } catch (err) {
      setError('Failed to create account. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const getTierBadge = (tier: string) => {
    const badges = {
      FOUNDER: {
        bg: 'bg-fire',
        text: 'text-white',
        label: '🔥 Founding Member',
      },
      CREATOR: {
        bg: 'bg-air',
        text: 'text-white',
        label: '✨ Creator',
      },
      PARTNER: {
        bg: 'bg-water',
        text: 'text-white',
        label: '💧 Partner',
      },
    }
    return badges[tier as keyof typeof badges] || badges.CREATOR
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment/10 via-white to-air/5 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center gap-2 justify-center">
              <BookOpen className="text-fire" size={32} />
              <span className="text-2xl font-heading font-bold text-gray-900">
                Genesis Book Studio
              </span>
            </div>
          </Link>

          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            {step === 'code' ? 'Beta Access' : 'Create Your Account'}
          </h1>
          <p className="text-gray-600">
            {step === 'code'
              ? 'Enter your beta code to get started'
              : 'Welcome to the future of book creation'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-leather/10 p-8">
          {/* Step 1: Beta Code Validation */}
          {step === 'code' && (
            <form onSubmit={handleValidateCode} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Beta Access Code
                </label>
                <input
                  type="text"
                  value={betaCode}
                  onChange={(e) => setBetaCode(e.target.value.toUpperCase())}
                  placeholder="GENESIS-BETA-XXXXX-XXXXX"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-fire focus:outline-none font-mono text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Don't have a code?{' '}
                  <Link href="/beta" className="text-fire hover:text-fire-dark">
                    Apply for beta access
                  </Link>
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isValidating || !betaCode}
                className="w-full px-6 py-3 bg-fire text-white rounded-lg hover:bg-fire-dark transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Validating...
                  </>
                ) : (
                  <>
                    Validate Code
                    <CheckCircle size={20} />
                  </>
                )}
              </button>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Already have an account?{' '}
                  <Link href="/login" className="text-fire hover:text-fire-dark font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: Account Details */}
          {step === 'details' && validatedCode && (
            <div>
              {/* Code Success Message */}
              <div className="mb-6 p-4 bg-fire/5 border border-fire/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-fire" size={20} />
                  <span className="font-semibold text-fire">Code Validated!</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTierBadge(validatedCode.tier).bg} ${getTierBadge(validatedCode.tier).text}`}>
                    {getTierBadge(validatedCode.tier).label}
                  </span>
                  <span className="text-sm text-gray-600">
                    6 months free + 50% lifetime discount
                  </span>
                </div>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-fire focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-fire focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-fire focus:outline-none"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    At least 8 characters
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full px-6 py-3 bg-fire text-white rounded-lg hover:bg-fire-dark transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <Sparkles size={20} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('code')}
                  className="w-full px-6 py-2 text-gray-600 hover:text-gray-900 transition text-sm"
                >
                  ← Use a different code
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-fire hover:text-fire-dark">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-fire hover:text-fire-dark">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
