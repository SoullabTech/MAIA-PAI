# OAuth Setup Guide for MAIA-FRESH

## Overview
This guide walks you through adding Google and Apple Sign-In to MAIA-FRESH using Supabase's native OAuth support.

---

## Part 1: Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it something like "MAIA OAuth"

### Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, navigate to **APIs & Services > OAuth consent screen**
2. Select **External** user type (unless you have Google Workspace)
3. Fill in the required fields:
   - **App name**: MAIA
   - **User support email**: your-email@domain.com
   - **App logo**: (optional, upload MAIA logo)
   - **Developer contact**: your-email@domain.com
4. Click **Save and Continue**
5. On the **Scopes** page, click **Save and Continue** (default scopes are fine)
6. On **Test users**, add your email for testing
7. Click **Save and Continue** and then **Back to Dashboard**

### Step 3: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Web application** as application type
4. Configure:
   - **Name**: MAIA Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local dev)
     - `https://your-production-domain.com` (add when deploying)
   - **Authorized redirect URIs**:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`
     - Find your Supabase project URL in Supabase Dashboard > Settings > API
5. Click **Create**
6. **Copy the Client ID and Client Secret** - you'll need these for Supabase

### Step 4: Enable Google+ API (if needed)

1. Navigate to **APIs & Services > Library**
2. Search for "Google+ API"
3. Click and enable it

---

## Part 2: Apple Sign-In Setup

### Step 1: Apple Developer Account

1. You need an **Apple Developer Program membership** ($99/year)
2. Go to [Apple Developer Portal](https://developer.apple.com/)
3. Sign in with your Apple ID

### Step 2: Register App ID

1. Navigate to **Certificates, Identifiers & Profiles**
2. Click **Identifiers**, then the **+** button
3. Select **App IDs** and click **Continue**
4. Select **App** and click **Continue**
5. Configure:
   - **Description**: MAIA App
   - **Bundle ID**: Explicit - `com.soullab.maia` (choose your own)
   - **Capabilities**: Check **Sign in with Apple**
6. Click **Continue** then **Register**

### Step 3: Create Services ID

1. Back in **Identifiers**, click the **+** button
2. Select **Services IDs** and click **Continue**
3. Configure:
   - **Description**: MAIA Web Service
   - **Identifier**: `com.soullab.maia.web` (must be different from App ID)
4. Check **Sign in with Apple**
5. Click **Configure** next to Sign in with Apple
6. Configure:
   - **Primary App ID**: Select the App ID you created
   - **Web Domain**: `your-production-domain.com` (without https://)
   - **Return URLs**: `https://your-supabase-project.supabase.co/auth/v1/callback`
7. Click **Save**, then **Continue**, then **Register**

### Step 4: Create Private Key

1. In **Certificates, Identifiers & Profiles**, go to **Keys**
2. Click the **+** button
3. Configure:
   - **Key Name**: MAIA Sign in with Apple Key
   - Check **Sign in with Apple**
   - Click **Configure** next to it
   - Select your **Primary App ID**
   - Click **Save**
4. Click **Continue** then **Register**
5. **Download the .p8 key file** - you can only download this once!
6. Note the **Key ID** shown on the page

### Step 5: Gather Required Information

You'll need these for Supabase:
- **Services ID** (Identifier): e.g., `com.soullab.maia.web`
- **Team ID**: Find in top-right of Apple Developer Portal
- **Key ID**: From the key you just created
- **Private Key (.p8 file)**: The file you downloaded

---

## Part 3: Configure Supabase

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your MAIA project
3. Navigate to **Authentication > Providers**

### Step 2: Enable Google Provider

1. Find **Google** in the providers list
2. Toggle it **ON**
3. Enter your credentials:
   - **Client ID**: From Google Cloud Console (Step 3 above)
   - **Client Secret**: From Google Cloud Console
4. Leave **Redirect URL** as shown (you already added this to Google)
5. Click **Save**

### Step 3: Enable Apple Provider

1. Find **Apple** in the providers list
2. Toggle it **ON**
3. Enter your credentials:
   - **Services ID**: From Apple Developer Portal (e.g., `com.soullab.maia.web`)
   - **Team ID**: Your Apple Team ID
   - **Key ID**: From the key you created
   - **Private Key**: Open the .p8 file in a text editor and copy the entire content
4. Leave **Redirect URL** as shown
5. Click **Save**

### Step 4: Verify Redirect URLs

1. In Supabase Dashboard, go to **Authentication > URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:3000` (dev) or `https://your-domain.com` (prod)
   - **Redirect URLs**: Add both:
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback`

---

## Part 4: Testing Your Setup

### Before You Start

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Test Google OAuth

1. Start your dev server: `npm run dev`
2. Navigate to the signup page
3. Click "Continue with Google"
4. You should be redirected to Google's consent screen
5. Sign in with a test account
6. You should be redirected back to your app, authenticated

### Test Apple Sign-In

1. On signup page, click "Continue with Apple"
2. Sign in with your Apple ID
3. Choose whether to share or hide your email
4. You should be redirected back, authenticated

### Common Issues

**Google OAuth:**
- **"redirect_uri_mismatch"**: Double-check the redirect URI in Google Cloud Console matches exactly what Supabase shows
- **"Access blocked"**: Make sure you added yourself as a test user in the OAuth consent screen

**Apple Sign-In:**
- **"invalid_client"**: Verify your Services ID is correct
- **"invalid_request"**: Check that your domain and return URLs are correctly configured
- **Key errors**: Ensure you copied the entire .p8 file content including the BEGIN/END lines

---

## Part 5: Code Integration

The code has been updated with:

1. **OAuth Helper Functions** (`lib/auth/supabase-client.ts`):
   - `signInWithGoogle()`
   - `signInWithApple()`

2. **OAuth Buttons** in signup components:
   - Added to `SignupModal.tsx`
   - Added to `SignupForm.tsx`

3. **OAuth Callback Handler**:
   - Updated `AuthCallback.tsx` to handle OAuth flows
   - Create callback route at `/auth/callback`

### Usage Example

```typescript
import { signInWithGoogle, signInWithApple } from '@/lib/auth/supabase-client';

// Trigger Google OAuth
await signInWithGoogle();

// Trigger Apple OAuth
await signInWithApple();
```

The OAuth flow:
1. User clicks "Continue with Google/Apple"
2. Redirected to provider's consent screen
3. User approves
4. Redirected to `/auth/callback`
5. `AuthCallback` component processes the tokens
6. User is authenticated and redirected to app

---

## Part 6: Production Deployment

### Before Going Live

1. **Update Google OAuth**:
   - Add production domain to Authorized JavaScript origins
   - Add production callback URL to Authorized redirect URIs

2. **Update Apple Sign-In**:
   - Update Web Domain with production domain
   - Update Return URLs with production callback

3. **Update Supabase**:
   - Update Site URL to production domain
   - Add production redirect URL

4. **Publish OAuth Consent Screen** (Google):
   - Go back to OAuth consent screen
   - Click "Publish App" when ready for real users
   - May require Google verification if requesting sensitive scopes

### Security Checklist

- [ ] Environment variables secured (not in git)
- [ ] Redirect URLs use HTTPS in production
- [ ] OAuth consent screens configured with accurate app info
- [ ] Privacy policy URL added (required for production)
- [ ] Terms of service URL added (recommended)
- [ ] Only necessary scopes requested
- [ ] Test with multiple accounts before launch

---

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Supabase OAuth Providers Guide](https://supabase.com/docs/guides/auth/social-login)

---

## Support

If you encounter issues:
1. Check Supabase Dashboard > Logs for authentication errors
2. Check browser console for client-side errors
3. Verify all credentials are correctly entered
4. Ensure redirect URLs match exactly (trailing slashes matter!)

For consciousness-related OAuth questions, consult the elemental guides. For technical issues, refer to the Supabase documentation.

---

*May each sign-in serve the awakening of consciousness* ✨
