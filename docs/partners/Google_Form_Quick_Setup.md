# Google Form Quick Setup (30-Minute Version)
## Soullab Inside Streamlined Intake

**Full version:** 106 questions (60-90 min to build)
**Quick version:** 25 essential questions (30 min to build)

Choose based on your needs:
- **Quick version:** Get started fast, use MAIA for deep discovery
- **Full version:** One comprehensive form, all data upfront

---

## Quick Setup (25 Questions)

### Create New Form

1. Go to https://forms.google.com
2. Click "Blank Form"
3. Title: "Soullab Inside - Partnership Discovery"

---

### Section 1: Contact & Business (5 questions)

**Q1:** Your Name *
- Type: Short answer
- Required: Yes

**Q2:** Business Name *
- Type: Short answer
- Required: Yes

**Q3:** Email Address *
- Type: Short answer
- Validation: Email
- Required: Yes

**Q4:** Website or Social Media
- Type: Short answer
- Help text: "Your current online presence"

**Q5:** What do you offer?
- Type: Paragraph
- Help text: "Describe your products/services in 2-3 sentences"
- Required: Yes

---

### Section 2: Vision & Goals (5 questions)

**PAGE BREAK** (Add section: "Your Vision")

**Q6:** What are your top 3 goals for this app? *
- Type: Checkboxes
- Required: Yes, exactly 3
- Options:
  - Increase online sales
  - Improve customer experience
  - Build customer loyalty
  - Enable mobile shopping
  - Add subscriptions
  - Automate operations
  - Other: ___

**Q7:** What problem does this app solve?
- Type: Paragraph
- Required: Yes

**Q8:** When do you want to launch? *
- Type: Multiple choice
- Options:
  - ASAP (1-2 months)
  - 3-4 months
  - 5-6 months
  - Flexible
  - Just exploring

**Q9:** What's your budget range? *
- Type: Multiple choice
- Options:
  - Under $10,000
  - $10,000 - $20,000
  - $20,000 - $35,000
  - $35,000 - $50,000
  - $50,000+
  - Need guidance

**Q10:** Magic Wand Question: If you could create the perfect customer experience with no constraints, what would it look like?
- Type: Paragraph
- Help text: "Dream big!"
- Required: Yes

---

### Section 3: Products & Customers (5 questions)

**PAGE BREAK** (Add section: "Your Offering")

**Q11:** How many products/services do you offer?
- Type: Short answer
- Help text: "Approximate total SKUs"

**Q12:** Price range
- Type: Short answer
- Help text: "e.g., $15-$150"

**Q13:** Who are your ideal customers?
- Type: Paragraph
- Help text: "Age, values, what they're struggling with"
- Required: Yes

**Q14:** How do customers currently purchase from you?
- Type: Checkboxes
- Options:
  - Online store (Shopify/WooCommerce/etc.)
  - In-person only
  - Instagram/DMs
  - Email orders
  - Not selling yet
  - Other: ___

**Q15:** Current monthly sales (optional)
- Type: Multiple choice
- Options:
  - Under $1,000
  - $1,000 - $5,000
  - $5,000 - $15,000
  - $15,000 - $50,000
  - $50,000+
  - Prefer not to say

---

### Section 4: Features & Functionality (5 questions)

**PAGE BREAK** (Add section: "Features You Want")

**Q16:** Would you like personalized product recommendations?
- Type: Multiple choice
- Options:
  - Yes - based on customer quiz/intake
  - Yes - based on purchase history
  - Yes - AI-powered
  - No - customers browse freely
  - Not sure

**Q17:** Are you interested in subscriptions?
- Type: Multiple choice
- Options:
  - Yes - priority feature
  - Maybe - future phase
  - No - not for my business

**Q18:** Would you like a conversational AI guide (like chatting with you)?
- Type: Multiple choice
- Options:
  - Yes - love this idea!
  - Maybe - want to see demo first
  - No - prefer traditional shopping

**Q19:** What integrations do you need?
- Type: Checkboxes
- Options:
  - Email marketing (Mailchimp, Klaviyo)
  - Accounting (QuickBooks, Xero)
  - Shipping (ShipStation, Shippo)
  - Payment (Stripe, PayPal)
  - Other: ___

**Q20:** Do you have product photography?
- Type: Multiple choice
- Options:
  - Yes - professional photos
  - Yes - DIY photos
  - No - need help with this

---

### Section 5: Design & Content (3 questions)

**PAGE BREAK** (Add section: "Design & Branding")

**Q21:** Do you have brand guidelines (logo, colors, fonts)?
- Type: Multiple choice
- Options:
  - Yes - comprehensive
  - Partial - logo and colors only
  - No - need help developing brand

**Q22:** Visual mood
- Type: Multiple choice
- Options:
  - Minimal & modern
  - Mystical & ethereal
  - Earthy & organic
  - Luxe & sophisticated
  - Other: ___

**Q23:** Who will write product descriptions?
- Type: Multiple choice
- Options:
  - I will
  - I have a copywriter
  - Need help with this
  - Mix of both

---

### Section 6: Wrap-Up (2 questions)

**PAGE BREAK** (Add section: "Final Questions")

**Q24:** Is there anything else we should know?
- Type: Paragraph
- Help text: "Concerns, questions, additional context"

**Q25:** How did you hear about Soullab Inside?
- Type: Multiple choice
- Options:
  - Loralee Crowder
  - Instagram
  - LinkedIn
  - Google search
  - Referral from friend
  - Other: ___

---

## Settings

### General
- ✅ Collect email addresses
- ✅ Limit to 1 response
- ✅ Allow response editing

### Presentation
- ✅ Show progress bar
- ✅ Confirmation message:

```
Thank you! 🌿

Your responses have been sent to Kelly. She'll review and create a custom proposal within 2-3 business days.

Next step: Schedule your proposal review call
→ https://calendly.com/kelly-soullab/proposal-review

Questions? Email kelly@soullab.org
```

### Responses
- ✅ Get email notifications for new responses
- ✅ Link to Sheets (auto-creates spreadsheet)

---

## After Creating Form

### 1. Share Link
Copy shareable link: Click "Send" → Link icon → Shorten URL → Copy

### 2. Set Up Spreadsheet
Responses → View in Sheets → Rename to "Soullab Inside Leads"

**Add these calculated columns:**

**Column Z: Next Steps**
```
=IF(B2="","",
  "1. Create proposal
  2. Email: "&C2&"
  3. Schedule call")
```

**Column AA: Priority Score**
```
=IF(B2="","",
  IF(I2="ASAP (1-2 months)",5,0)+
  IF(REGEXMATCH(J2,"35,000|50,000"),5,0)+
  IF(REGEXMATCH(K2,"perfect"),3,0))
```
*Scores leads: 8-13 = hot, 5-7 = warm, 0-4 = cold*

**Column AB: Status**
- Dropdown: New, Reviewed, Proposal Sent, Call Scheduled, Won, Lost

---

## Email Template for Sending

```
Subject: Quick intake for Soullab Inside partnership

Hi [Name],

I'm excited to explore creating a custom app for [Their Business]!

To get started, fill out this 10-minute questionnaire:
[Your Form Link]

It covers:
• Your business and vision
• Your customers and products
• Features and functionality you need
• Budget and timeline

Once submitted, I'll create a custom proposal within 2-3 days.

Alternatively, if you'd prefer a conversational approach instead of a form, you can chat with MAIA (our AI intake specialist) here:
[Link to MAIA intake page]

Looking forward to learning more!

Kelly
kelly@soullab.org
```

---

## Upgrade Path

Once you've used this quick form with 5-10 clients, you'll know:
1. Which questions are most valuable
2. What's confusing or missing
3. Whether to expand to full 106-question version
4. Whether MAIA conversational intake works better

**Recommended:** Use this quick form + MAIA follow-up conversation for best results.

---

## Time Estimate

- **Build form:** 30 minutes
- **Send to first client:** Immediate
- **Review first response:** 15 minutes
- **Iterate and improve:** Ongoing

**vs. Full 106-question form:**
- **Build form:** 90 minutes
- **Client completion time:** 60-90 minutes (higher drop-off)
- **More complete data:** Yes, but is it necessary upfront?

**Recommendation:** Start with this quick version. You can always ask follow-up questions via email or on the call!

---

## Copy-Paste Form Builder

Want to build this even faster? Copy this JSON and use a Google Forms template generator:

**[Note: Google Forms doesn't support JSON import, but you can use this structure as a checklist]**

✅ = Added to form

Section 1: Contact & Business
- ✅ Your Name (short answer, required)
- ✅ Business Name (short answer, required)
- ✅ Email (short answer, email validation, required)
- ✅ Website/Social (short answer)
- ✅ What do you offer? (paragraph, required)

Section 2: Vision & Goals
- ✅ Top 3 goals (checkboxes, exactly 3)
- ✅ Problem solved (paragraph, required)
- ✅ Launch timeline (multiple choice, required)
- ✅ Budget range (multiple choice, required)
- ✅ Magic wand question (paragraph, required)

Section 3: Products & Customers
- ✅ Product/service count (short answer)
- ✅ Price range (short answer)
- ✅ Ideal customers (paragraph, required)
- ✅ Current sales method (checkboxes)
- ✅ Monthly sales (multiple choice, optional)

Section 4: Features & Functionality
- ✅ Personalization (multiple choice)
- ✅ Subscriptions (multiple choice)
- ✅ Conversational AI (multiple choice)
- ✅ Integrations needed (checkboxes)
- ✅ Photography status (multiple choice)

Section 5: Design & Content
- ✅ Brand guidelines (multiple choice)
- ✅ Visual mood (multiple choice)
- ✅ Content writing (multiple choice)

Section 6: Wrap-Up
- ✅ Anything else? (paragraph)
- ✅ How did you hear about us? (multiple choice)

**Total setup time: 30 minutes** ⏱️

---

Ready to build it? Open a new tab: https://forms.google.com

Or jump straight to the MAIA conversational intake: `/soullab-inside/intake`
