# Custom GPT Integration Guide for Elemental Oracle 2.0 + MAIA

## ✅ What's Complete

Your Custom GPT setup is **90% done**! Here's what's ready:

1. ✅ **API Endpoints Created:**
   - `POST /api/oracle/consult` - Get archetypal wisdom from EO framework
   - `POST /api/maia/chat` - Direct conversation with MAIA
   - `GET /api/memory/context` - Retrieve AIN memory for continuity

2. ✅ **OpenAPI Schema Configured** - All actions defined
3. ✅ **Privacy Policy Page** - Available at `/privacy`
4. ✅ **Analytics Tracking** - All conversations logged with full metadata

## ⚠️ What Needs To Be Updated

### 1. Replace Placeholder Domain in OpenAPI Schema

Your Custom GPT schema currently has:
```yaml
servers:
  - url: https://your-maia-domain.com/api
```

**You need to replace `your-maia-domain.com` with your actual production domain.**

#### Option A: Using Vercel (Recommended)
If deployed on Vercel:
```yaml
servers:
  - url: https://your-app-name.vercel.app/api
```

#### Option B: Using Custom Domain
If you have a custom domain:
```yaml
servers:
  - url: https://yourdomain.com/api
```

#### Option C: Using Localhost for Testing
For local testing only (won't work in ChatGPT):
```yaml
servers:
  - url: http://localhost:3000/api
```

### 2. Update Privacy Policy URL

In your Custom GPT settings, change:
```
https://app.example.com/privacy
```

To your actual URL:
```
https://your-actual-domain.com/privacy
```

### 3. Deploy Your API Endpoints

The three new endpoints need to be deployed:
- `/app/api/oracle/consult/route.ts`
- `/app/api/maia/chat/route.ts`
- `/app/api/memory/context/route.ts`

**Deployment steps:**

```bash
# If using Vercel
git add .
git commit -m "Add Custom GPT API endpoints"
git push origin main
# Vercel will auto-deploy

# If using another platform, follow their deployment process
```

---

## 🧪 Testing Your Integration

### Step 1: Test Endpoints Locally

```bash
# Start your dev server
npm run dev

# Test MAIA chat endpoint
curl -X POST http://localhost:3000/api/maia/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "message": "Hello MAIA",
    "conversationMode": "walking"
  }'

# Test Oracle consult endpoint
curl -X POST http://localhost:3000/api/oracle/consult \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "userInput": "I feel stuck in a pattern",
    "conversationMode": "classic"
  }'

# Test memory context endpoint
curl http://localhost:3000/api/memory/context?userId=test-user-123
```

### Step 2: Test in Custom GPT

Once deployed, test in ChatGPT:

1. **Test chatWithMaia:**
   ```
   Call chatWithMaia with message "Hello MAIA"
   ```

2. **Test consultOracle:**
   ```
   Consult the Oracle about transformation and fire element
   ```

3. **Test getUserMemoryContext:**
   ```
   Get my memory context
   ```

---

## 📝 Complete OpenAPI Schema (Corrected)

Here's your schema with placeholders marked - **replace these with your actual values:**

```yaml
openapi: 3.1.0
info:
  title: Elemental Oracle & MAIA API
  version: 2.1.0
  description: API for Elemental Oracle wisdom framework and MAIA conversational interface

servers:
  - url: https://YOUR-ACTUAL-DOMAIN.com/api  # ⚠️ REPLACE THIS
    description: Production API

paths:
  /oracle/consult:
    post:
      operationId: consultOracle
      summary: Get archetypal wisdom from Elemental Oracle
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                  description: User identifier
                userInput:
                  type: string
                  description: User's current question or situation
                conversationMode:
                  type: string
                  enum: [walking, classic, adaptive, her]
                  default: classic
              required:
                - userId
                - userInput
      responses:
        '200':
          description: Oracle wisdom and MAIA response
          content:
            application/json:
              schema:
                type: object
                properties:
                  oracleWisdom:
                    type: object
                    properties:
                      element:
                        type: string
                      symbols:
                        type: array
                        items:
                          type: string
                      archetypes:
                        type: array
                        items:
                          type: string
                      ritualSuggestions:
                        type: array
                        items:
                          type: string
                  maiaResponse:
                    type: string
                  element:
                    type: string

  /maia/chat:
    post:
      operationId: chatWithMaia
      summary: Direct conversation with MAIA
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                message:
                  type: string
                conversationMode:
                  type: string
                  enum: [walking, classic, adaptive, her]
                  default: walking
                voiceEnabled:
                  type: boolean
                  default: false
              required:
                - userId
                - message
      responses:
        '200':
          description: MAIA's response
          content:
            application/json:
              schema:
                type: object
                properties:
                  response:
                    type: string
                  element:
                    type: string
                  metadata:
                    type: object

  /memory/context:
    get:
      operationId: getUserMemoryContext
      summary: Retrieve user's AIN memory context
      parameters:
        - name: userId
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User's memory context
          content:
            application/json:
              schema:
                type: object
                properties:
                  spiralPhase:
                    type: string
                  elementBalance:
                    type: object
                  activeArchetypes:
                    type: array
                    items:
                      type: object
                  symbolicThreads:
                    type: array
                    items:
                      type: object
```

---

## 🚀 Quick Start Checklist

- [ ] Deploy API endpoints to production
- [ ] Get production URL (e.g., `https://yourapp.vercel.app`)
- [ ] Update OpenAPI schema server URL
- [ ] Update Privacy Policy URL in Custom GPT settings
- [ ] Save Custom GPT changes
- [ ] Test `chatWithMaia` action in ChatGPT
- [ ] Test `consultOracle` action in ChatGPT
- [ ] Test `getUserMemoryContext` action in ChatGPT

---

## 💡 Example Conversations

### Walking Mode (Brief)
**User:** "I'm feeling anxious"
**MAIA:** "Breathe. What's beneath it?"

### Classic Mode (Depth)
**User:** "I'm feeling anxious"
**MAIA:** "Anxiety often carries a message. What if this restlessness is your body's way of saying you've outgrown something? Let's explore what wants to be released. When did you first notice this feeling today?"

### Consulting Oracle
**User:** "I need guidance on a major life transition"
**Oracle Wisdom:**
- Element: Water (emotional flow, letting go)
- Archetype: The Threshold Guardian (standing at the edge)
- Ritual: River stone ceremony - release what no longer serves
**MAIA's Response:** "You're at the river's edge. The Guardian asks: what are you carrying that the current could carry for you?"

---

## 🔐 Security Notes

1. **No Authentication Required (Initial)** - Your Custom GPT schema has `Authentication: None`
2. **Consider Adding API Keys Later** - For production, add Bearer token authentication
3. **Rate Limiting** - Consider implementing rate limits to prevent abuse
4. **CORS** - Already configured in `/memory/context` endpoint

---

## 📊 Analytics

Every Custom GPT conversation is automatically tracked with:
- Model used (GPT-4o, GPT-5, Claude)
- Conversation mode (walking, classic, adaptive, her)
- Response times and token usage
- Cost per conversation
- Brevity scores

View analytics at: `https://your-domain.com/analytics`

---

## 🆘 Troubleshooting

### Error: "API is currently unavailable"
✅ **Solution:** Update the `servers` URL in your OpenAPI schema with your actual deployed domain

### Error: "userId is required"
✅ **Solution:** Make sure your Custom GPT instructions include passing a userId in API calls

### Memory context returns empty
✅ **Solution:** User needs to have at least one conversation first to populate AIN memory

### Response is too verbose in Walking mode
✅ **Solution:** MAIA is still learning! The prompt emphasizes brevity, but may need tuning based on analytics

---

## 📞 Next Steps

1. **Deploy your app** (Vercel recommended)
2. **Get your production URL**
3. **Update OpenAPI schema** with real domain
4. **Test all three actions** in Custom GPT
5. **Share your Custom GPT** with users!

Your Custom GPT will now have direct access to MAIA's full intelligence, 500+ hours of Elemental Oracle IP, and user-specific AIN memory continuity. 🎉
