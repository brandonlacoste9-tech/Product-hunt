# 💰 Monetization Setup Guide

This guide walks you through setting up the revenue-generating features of your Product Discovery Hub.

## Table of Contents

1. [Stripe Payments (Featured Listings)](#1-stripe-payments-featured-listings)
2. [Newsletter System](#2-newsletter-system)
3. [Affiliate Links](#3-affiliate-links)
4. [AI Summaries](#4-ai-summaries)
5. [Revenue Tracking](#5-revenue-tracking)

---

## 1. Stripe Payments (Featured Listings)

### 1.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete verification (business details, bank account)
3. Switch to "Test mode" for development

### 1.2 Get API Keys

1. In Stripe Dashboard → Developers → API Keys
2. Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy **Secret key** (starts with `sk_test_` or `sk_live_`)
4. For webhooks, go to Developers → Webhooks → Add endpoint

### 1.3 Configure Environment Variables

Add to your `.env.local`:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 1.4 Set Up Webhook Endpoint

1. In Stripe Dashboard → Webhooks → Add endpoint
2. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.refunded`

### 1.5 Run Database Migration

Execute the SQL migration to add sponsor tables:

```bash
# Option 1: Via Supabase Dashboard
# Go to SQL Editor → New Query → Paste contents of:
# prisma/migrations/add_sponsor_and_newsletter.sql

# Option 2: Via Prisma (if you add to schema)
npx prisma migrate dev --name add_sponsor_tables
```

### 1.6 Test Payment Flow

1. Start development server: `npm run dev`
2. Go to any product page
3. Click "Promote This Product"
4. Select a tier (e.g., "Featured Product - $150")
5. Use Stripe test card: `4242 4242 4242 4242`
6. Any future date, any 3-digit CVC, any ZIP
7. Complete payment → Should redirect to success page

---

## 2. Newsletter System

### 2.1 Choose Email Provider

**Option A: MailerLite** (Recommended for beginners)
- Free up to 1,000 subscribers
- Easy automation
- Newsletter templates

**Option B: SendGrid**
- Free 100 emails/day
- Better for transactional
- Good API

**Option C: ConvertKit**
- Built for creators
- Advanced automation
- Paid after 1,000 subs

### 2.2 MailerLite Setup

1. Create account at [mailerlite.com](https://mailerlite.com)
2. Go to Forms → Create Embedded Form
3. Get your API key: Account → Integrations → API
4. Configure the form for your brand colors

### 2.3 Add to Environment

```bash
# MailerLite
MAILERLITE_API_KEY=your-api-key
MAILERLITE_GROUP_ID=your-group-id

# OR SendGrid
SENDGRID_API_KEY=SG.xxx
```

### 2.4 Create Newsletter Automation

1. In MailerLite → Automation
2. Create "Welcome Email" workflow:
   - Trigger: Subscriber joins
   - Delay: Immediately
   - Email: Welcome + "What to expect"
3. Create "Weekly Digest" workflow:
   - Trigger: Every Tuesday 9 AM
   - Content: Top 10 products from last week

### 2.5 Newsletter Content Strategy

**Weekly Structure:**
```
Subject: 🚀 Top 10 Products This Week (Feb 26)

1. Sponsor Spotlight (Paid placement - $250)
2. #1 Product of the Week (Highest voted)
3. #2 Runner up
4-9. Other trending products
10. Newcomer spotlight

Footer: Unsubscribe | Update preferences
```

---

## 3. Affiliate Links

### 3.1 Join Affiliate Programs

**Recommended Programs:**

| Program | Commission | Best For |
|---------|-----------|----------|
| Amazon Associates | 1-10% | Physical products |
| AppSumo | 15-30% | SaaS deals |
| PartnerStack | Varies | B2B software |
| Impact | Varies | Tech products |
| ShareASale | Varies | Various |

### 3.2 Implementation

1. When adding a product, include affiliate URL:
   ```sql
   UPDATE "Product" 
   SET affiliate_url = 'https://product.com?ref=YOUR_ID'
   WHERE id = '...';
   ```

2. Frontend automatically tracks clicks:
   - Click → increment `affiliate_clicks`
   - User buys (tracked via cookie) → increment `affiliate_conversions`

3. Disclosure (required by FTC):
   - Add "(affiliate link)" next to buy buttons
   - Include in Terms of Service
   - Already implemented in Privacy Policy

---

## 4. AI Summaries

### 4.1 OpenAI Setup

1. Create account at [platform.openai.com](https://platform.openai.com)
2. Add payment method (pay-as-you-go)
3. Create API key
4. Set usage limits (start with $20/month)

### 4.2 Add to Environment

```bash
OPENAI_API_KEY=sk-...
```

### 4.3 How It Works

When a product is submitted:

1. User fills out product form
2. On submit, API calls `/api/ai/generate-summary`
3. OpenAI generates 2-sentence summary
4. Summary saved to `ai_summary` column
5. Displayed on product cards

### 4.4 Cost Estimate

- GPT-3.5-turbo: ~$0.002 per summary
- 100 products/month: $0.20
- Much cheaper than hiring copywriters

### 4.5 Fallback Mode

If OpenAI key is not set, system generates fallback summary from first sentence of description.

---

## 5. Revenue Tracking

### 5.1 Dashboard Metrics

Create a simple admin dashboard:

```typescript
// Key metrics to track
interface RevenueMetrics {
  // Stripe revenue
  stripeRevenue: number;        // Total from featured listings
  stripeRevenueThisMonth: number;
  activeSponsors: number;
  
  // Newsletter
  subscriberCount: number;
  subscriberGrowth: number;     // % this month
  newsletterOpenRate: number;
  
  // Affiliate
  affiliateClicks: number;
  affiliateConversions: number;
  affiliateRevenue: number;     // Estimated
  
  // Overall
  totalRevenue: number;
  mrr: number;                  // Monthly recurring
}
```

### 5.2 Analytics Setup

**Plausible Analytics** (Privacy-friendly):
```bash
# Add script to layout.tsx
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

**Google Analytics 4** (Free):
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 5.3 Monthly Reporting

Create a monthly report template:

```markdown
# Monthly Revenue Report - [Month Year]

## Summary
- Total Revenue: $X,XXX
- MRR Growth: +X%
- New Subscribers: XXX

## Revenue Breakdown
| Source | Amount | % of Total |
|--------|--------|-----------|
| Featured Listings | $X,XXX | XX% |
| Newsletter Sponsors | $X,XXX | XX% |
| API Access | $XXX | XX% |
| Affiliate | $XXX | XX% |
| Events | $XXX | XX% |

## Top Performing Products
1. Product A - XXX votes, $XXX sponsor revenue
2. Product B - XXX votes, $XXX sponsor revenue

## Goals for Next Month
- [ ] Increase MRR to $X,XXX
- [ ] Close X newsletter sponsors
- [ ] Launch [feature]
```

---

## 6. Pricing Strategy

### 6.1 Featured Listing Pricing

| Tier | Price | Duration | Value Proposition |
|------|-------|----------|-------------------|
| Featured Week | $150 | 7 days | Entry-level visibility |
| Featured Month | $499 | 30 days | Best value |
| Newsletter | $250 | 1 issue | Direct to 5K+ subscribers |
| Banner | $500 | 7 days | Premium placement |

### 6.2 Discount Strategy

- **Launch discount**: 30% off first month
- **Annual prepay**: 2 months free
- **Non-profit**: 50% off (verify 501(c)(3))
- **Bulk purchases**: Buy 3 months, get 1 free

### 6.3 Competitive Analysis

| Platform | Featured Price | Notes |
|----------|---------------|-------|
| Product Hunt | $0 (algorithm) | Can't buy featured |
| BetaList | $299 | One-time fee |
| Launching Next | $99 | Smaller audience |
| Your Platform | $150 | NA-focused, better ROI |

---

## 7. Launch Checklist for Monetization

### Week 1: Setup
- [ ] Stripe account created
- [ ] Webhook endpoint configured
- [ ] Test payment completed
- [ ] MailerLite account created
- [ ] Welcome email automated

### Week 2: Integration
- [ ] Sponsor component on product pages
- [ ] Newsletter signup on homepage
- [ ] Affiliate links tracked
- [ ] AI summaries working

### Week 3: Launch
- [ ] First sponsor pitch (friends/family)
- [ ] Newsletter goes live
- [ ] Revenue tracking dashboard
- [ ] First $100 revenue!

---

## 8. Troubleshooting

### Stripe webhook not working?
1. Check webhook secret matches
2. Verify endpoint URL is correct
3. Check Vercel logs for errors
4. Use Stripe CLI to test locally

### Newsletter not sending?
1. Verify API key
2. Check subscriber is in correct group
3. Test with personal email
4. Check spam folders

### AI summaries not generating?
1. Check OPENAI_API_KEY is set
2. Verify API key has credits
3. Check rate limits (20/minute free)
4. Review Vercel function logs

---

## 9. Next Steps

After setup is complete:

1. **First sponsor**: Reach out to 5 products already on your site
2. **Newsletter launch**: Send first issue to yourself + friends
3. **Pricing experiments**: A/B test different price points
4. **Expand revenue**: Add API access tier ($30-99/month)

---

**Expected Timeline:**
- Setup: 1 day
- First revenue: 1-2 weeks
- $1K MRR: 3-4 months
- $10K MRR: 12 months

**Questions?** Refer to the main documentation or open an issue on GitHub.
