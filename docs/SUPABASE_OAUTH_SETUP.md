# Supabase OAuth Setup Guide

This guide walks you through configuring Apple and Google OAuth providers in your Supabase project.

## Prerequisites

- Supabase project created
- Apple Developer account (for Apple Sign In)
- Google Cloud account (for Google OAuth)
- Access to your Supabase project dashboard

---

## Part 1: Apple Sign In Configuration

### Step 1: Apple Developer Console Setup

1. **Go to Apple Developer Portal**
   - Navigate to: https://developer.apple.com/account/resources
   - Sign in with your Apple Developer account

2. **Create App ID**
   - Go to **Identifiers** → **App IDs**
   - Click **+** to create new App ID
   - Description: `MAIA Personal Oracle`
   - Bundle ID: `life.soullab.maia` (explicit)
   - Enable **Sign In with Apple** capability
   - Click **Continue** → **Register**

3. **Create Services ID** (for web/OAuth)
   - Go to **Identifiers** → **Services IDs**
   - Click **+** to create new Services ID
   - Description: `MAIA Personal Oracle Web`
   - Identifier: `life.soullab.maia.web`
   - Enable **Sign In with Apple**
   - Click **Configure** next to Sign In with Apple:
     - Primary App ID: Select your App ID from Step 2
     - Domains: `soullab.life`
     - Return URLs: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
       - Get your project ref from Supabase dashboard URL
       - Example: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
   - Click **Save** → **Continue** → **Register**

4. **Create Private Key**
   - Go to **Keys** section
   - Click **+** to create new key
   - Key Name: `MAIA Apple Sign In Key`
   - Enable **Sign In with Apple**
   - Click **Configure** → Select your Primary App ID
   - Click **Save** → **Continue** → **Register**
   - **Download the .p8 file** (you can only download once!)
   - Note your **Key ID** (10-character string shown on confirmation page)

5. **Get Your Team ID**
   - Go to **Membership** in left sidebar
   - Copy your **Team ID** (10-character string)

### Step 2: Supabase Apple OAuth Configuration

1. **Open Supabase Dashboard**
   - Go to your project: https://app.supabase.com
   - Navigate to **Authentication** → **Providers**

2. **Enable Apple Provider**
   - Find **Apple** in the provider list
   - Toggle **Enable Sign in with Apple**

3. **Configure Apple Settings**
   - **Services ID**: `life.soullab.maia.web` (from Step 1.3)
   - **Team ID**: Your Team ID (from Step 1.5)
   - **Key ID**: Your Key ID (from Step 1.4)
   - **Private Key**: Open the .p8 file and paste entire contents
     ```
     -----BEGIN PRIVATE KEY-----
     [Your private key content]
     -----END PRIVATE KEY-----
     ```

4. **Save Configuration**
   - Click **Save**
   - Apple Sign In is now enabled

---

## Part 2: Google OAuth Configuration

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Navigate to: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create or Select Project**
   - Click project dropdown at top
   - Click **New Project**
   - Project name: `MAIA Personal Oracle`
   - Click **Create**

3. **Enable Google+ API** (if not already enabled)
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - User Type: **External** (unless you have Google Workspace)
   - Click **Create**

   **App Information:**
   - App name: `MAIA Personal Oracle`
   - User support email: `your-email@soullab.life`
   - App logo: (optional - upload MAIA logo)

   **App Domain:**
   - Application home page: `https://soullab.life`
   - Application privacy policy: `https://soullab.life/privacy`
   - Application terms of service: `https://soullab.life/terms`

   **Authorized domains:**
   - Add: `soullab.life`
   - Add: `supabase.co`

   **Developer contact:**
   - Your email address

   - Click **Save and Continue**

5. **Scopes** (optional - defaults are fine)
   - Click **Save and Continue**

6. **Test Users** (for development)
   - Add your email and beta tester emails
   - Click **Save and Continue**

7. **Create OAuth 2.0 Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `MAIA Web Client`

   **Authorized JavaScript origins:**
   - Add: `https://soullab.life`
   - Add: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co`

   **Authorized redirect URIs:**
   - Add: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`

   - Click **Create**
   - **Copy Client ID** and **Client Secret** (shown in popup)

### Step 2: Supabase Google OAuth Configuration

1. **Open Supabase Dashboard**
   - Go to your project: https://app.supabase.com
   - Navigate to **Authentication** → **Providers**

2. **Enable Google Provider**
   - Find **Google** in the provider list
   - Toggle **Enable Sign in with Google**

3. **Configure Google Settings**
   - **Client ID**: Paste from Google Cloud Console (Step 1.7)
   - **Client Secret**: Paste from Google Cloud Console (Step 1.7)

4. **Save Configuration**
   - Click **Save**
   - Google Sign In is now enabled

---

## Part 3: Testing OAuth Providers

### Test in Development

1. **Get Callback URL**
   - Your Supabase callback URL format:
   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

2. **Test Sign In Flow**
   - Navigate to your auth page: `http://localhost:3000/auth`
   - Click "Continue with Apple" or "Continue with Google"
   - Complete OAuth flow
   - Should redirect back to your app with auth token

3. **Verify in Supabase**
   - Go to **Authentication** → **Users** in Supabase dashboard
   - You should see new user with provider listed

### Common Issues

**Apple Sign In:**
- "invalid_client" error → Check Services ID matches exactly
- "invalid_grant" error → Check Return URL is correct
- Private key error → Ensure entire .p8 contents copied including BEGIN/END lines

**Google Sign In:**
- "redirect_uri_mismatch" → Check authorized redirect URIs match exactly
- "access_denied" → Check OAuth consent screen is configured
- "invalid_client" → Check Client ID/Secret copied correctly

---

## Part 4: Update Environment Variables

Add to `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# OAuth Providers (optional - configured in Supabase dashboard)
# These are retrieved from Supabase, not needed in env
```

---

## Security Checklist

- [ ] Private keys stored securely (never commit .p8 files)
- [ ] OAuth redirect URLs use HTTPS in production
- [ ] Supabase RLS policies enabled on users table
- [ ] OAuth consent screen reviewed for branding
- [ ] Test users added for beta testing phase
- [ ] Rate limiting enabled in Supabase (under Settings → API)

---

## Next Steps

After OAuth is configured:

1. Update `/app/auth/page.tsx` with social login buttons
2. Test authentication flow end-to-end
3. Verify user profile creation in `public.users` table
4. Confirm RelationshipAnamnesis soul signature generation
5. Add WebAuthn for biometric enrollment

---

## Support Resources

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Apple Sign In Docs**: https://developer.apple.com/sign-in-with-apple/
- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2

---

**Last Updated**: 2025-11-03
**For**: MAIA Personal Oracle Beta Launch
