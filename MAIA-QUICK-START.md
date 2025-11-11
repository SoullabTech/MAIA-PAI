# MAIA Quick Start Guide

## Starting MAIA (Bulletproof Method)

```bash
./start-maia.sh
```

This script will:
1. Kill any existing dev servers
2. Verify your API keys are configured
3. Start MAIA on port **3003**
4. Display the access URL

## Access MAIA

Once started, go to: **http://localhost:3003/maia**

## If You Get "Can't Connect" Errors

This is almost always a **browser cache** issue, not a server issue.

### Quick Fix:
1. Open **Incognito/Private Window**
2. Go to http://localhost:3003/maia

### Full Fix:
1. Open DevTools (F12 or Cmd+Opt+I)
2. Go to **Application** tab
3. Click **Clear site data**
4. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## Troubleshooting

### Check if server is running:
```bash
curl http://localhost:3003/api/test-env
```

Should return: `{"env":{"hasAnthropicKey":true,...}}`

### Test MAIA API directly:
```bash
curl -X POST http://localhost:3003/api/between/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello","userId":"test","sessionId":"test","soulSignature":"test","conversationHistory":[],"streaming":false}'
```

Should return a JSON response with MAIA's greeting.

### Check API key:
```bash
grep ANTHROPIC_API_KEY .env.local
```

Should show a valid key starting with `sk-ant-api03-`

## For Production Deployment

Your photojournalist friend should access MAIA via the **production URL** (when deployed), not localhost. The production deployment will be rock-solid with:
- No port conflicts
- No cache issues  
- No environment setup needed
- HTTPS encryption
- Global CDN

Current production setup needed:
- Deploy to Vercel/Render
- Set ANTHROPIC_API_KEY in environment variables
- Access via https://your-domain.com/maia

---

**Note**: The localhost dev environment has fragility because browsers cache aggressively during development. Production deployments don't have these issues.
