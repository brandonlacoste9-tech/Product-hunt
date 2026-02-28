# 🔧 Implementation Guide - Product Discovery Hub

This comprehensive technical guide covers all aspects of implementing and customizing your Product Discovery Hub.

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Feature Implementation](#feature-implementation)
4. [Customization Guide](#customization-guide)
5. [API Reference](#api-reference)
6. [Deployment Options](#deployment-options)
7. [Security Best Practices](#security-best-practices)
8. [Performance Optimization](#performance-optimization)

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────┐
│   Next.js Frontend/Backend  │
│  ┌────────────────────────┐ │
│  │   React Components     │ │
│  ├────────────────────────┤ │
│  │   API Routes          │ │
│  └────────────────────────┘ │
└──────┬──────────────┬───────┘
       │              │
       ↓              ↓
┌─────────────┐ ┌──────────────┐
│ PostgreSQL  │ │ External APIs│
│  Database   │ │ (OpenAI, etc)│
└─────────────┘ └──────────────┘
```

### Database Schema

The platform uses Prisma ORM with PostgreSQL. Key models:

- **User**: User accounts and profiles
- **Product**: Product listings with full details
- **Category**: Product categories
- **Vote**: User votes on products
- **Comment**: Comments and discussions
- **Event**: Launch events and meetups
- **Follow**: User follow relationships
- **Newsletter**: Email subscribers

See `prisma/schema.prisma` for complete schema.

---

## 🛠️ Technology Stack

### Core Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Next.js | 14.1+ | Full-stack React framework |
| Language | TypeScript | 5.3+ | Type-safe development |
| Database | PostgreSQL | 14+ | Primary data store |
| ORM | Prisma | 5.9+ | Database access layer |
| Styling | Tailwind CSS | 3.4+ | Utility-first CSS |
| Auth | NextAuth.js | 4.24+ | Authentication |
| Icons | Lucide React | 0.320+ | Icon library |
| i18n | next-intl | 3.9+ | Internationalization |

### Optional Integrations

- **OpenAI**: AI-powered recommendations
- **Stripe**: Payment processing
- **SendGrid/AWS SES**: Email delivery
- **AWS S3**: Image storage
- **Google Analytics**: User analytics
- **Sentry**: Error tracking

---

## 🎨 Feature Implementation

### 1. Multi-Language Support

**Location**: `src/app/[locale]/`

**Implementation Steps**:

1. Create locale folders:
```bash
mkdir -p src/app/en src/app/es src/app/fr
```

2. Create translation files:
```typescript
// src/locales/en.json
{
  "common": {
    "submit": "Submit Product",
    "login": "Login",
    "signup": "Sign Up"
  },
  "home": {
    "hero": "Discover Amazing Products",
    "tagline": "The largest product discovery platform..."
  }
}
```

3. Configure next-intl in `next.config.js`:
```javascript
i18n: {
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en',
}
```

4. Use translations in components:
```typescript
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('home')
  return <h1>{t('hero')}</h1>
}
```

### 2. Regional Sections

**Implementation**:

1. Add region filter to product queries:
```typescript
// src/lib/queries.ts
export async function getProductsByRegion(region: string) {
  return await prisma.product.findMany({
    where: { region, status: 'APPROVED' },
    orderBy: { launchDate: 'desc' }
  })
}
```

2. Create regional pages:
```typescript
// src/app/regions/[region]/page.tsx
export default async function RegionPage({ 
  params 
}: { 
  params: { region: string } 
}) {
  const products = await getProductsByRegion(params.region)
  return <ProductList products={products} />
}
```

3. Add region selector:
```typescript
const regions = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' }
]
```

### 3. AI-Powered Recommendations

**Requirements**: OpenAI API key

**Implementation**:

1. Install OpenAI SDK:
```bash
npm install openai
```

2. Create AI service:
```typescript
// src/lib/ai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function getRecommendations(userId: string) {
  // Get user's voting history
  const votes = await getUserVotes(userId)
  
  // Generate recommendations using GPT
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "You are a product recommendation engine..."
    }, {
      role: "user",
      content: `Based on these products: ${votes.join(', ')}, recommend similar products.`
    }]
  })
  
  return response.choices[0].message.content
}
```

3. Create API endpoint:
```typescript
// src/app/api/recommendations/route.ts
export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session) return new Response('Unauthorized', { status: 401 })
  
  const recommendations = await getRecommendations(session.user.id)
  return Response.json(recommendations)
}
```

### 4. Events System

**Implementation**:

1. Create event submission form:
```typescript
// src/app/events/submit/page.tsx
export default function SubmitEvent() {
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="description" required />
      <input type="datetime-local" name="startDate" required />
      <input type="datetime-local" name="endDate" required />
      <input name="location" />
      <input type="checkbox" name="virtual" />
      <button type="submit">Create Event</button>
    </form>
  )
}
```

2. Create event listing page:
```typescript
// src/app/events/page.tsx
export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: {
      startDate: { gte: new Date() }
    },
    orderBy: { startDate: 'asc' },
    include: { products: true }
  })
  
  return <EventList events={events} />
}
```

3. Add calendar integration:
```typescript
export function generateICS(event: Event) {
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(event.startDate)}
DTEND:${formatDate(event.endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`
}
```

### 5. Public API

**Implementation**:

1. Create API routes:
```typescript
// src/app/api/v1/products/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  // Rate limiting check
  const apiKey = request.headers.get('X-API-Key')
  if (!await checkRateLimit(apiKey)) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
  
  const products = await prisma.product.findMany({
    where: { status: 'APPROVED' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      category: true,
      maker: { select: { name: true, image: true } }
    }
  })
  
  return Response.json({
    data: products,
    meta: {
      page,
      limit,
      total: await prisma.product.count()
    }
  })
}
```

2. Add API authentication:
```typescript
// src/lib/api-auth.ts
export async function authenticateAPIKey(apiKey: string) {
  const user = await prisma.user.findFirst({
    where: { 
      apiKeys: { some: { key: apiKey, active: true } }
    }
  })
  return user
}
```

3. Implement rate limiting:
```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier)
  return success
}
```

### 6. Search Functionality

**Implementation**:

1. Basic search:
```typescript
// src/lib/search.ts
export async function searchProducts(query: string) {
  return await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { tagline: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query.toLowerCase() } }
      ],
      status: 'APPROVED'
    },
    orderBy: { votesCount: 'desc' }
  })
}
```

2. Advanced search with filters:
```typescript
export async function advancedSearch(params: SearchParams) {
  const where: any = { status: 'APPROVED' }
  
  if (params.query) {
    where.OR = [
      { name: { contains: params.query, mode: 'insensitive' } },
      { tagline: { contains: params.query, mode: 'insensitive' } }
    ]
  }
  
  if (params.category) {
    where.categoryId = params.category
  }
  
  if (params.region) {
    where.region = params.region
  }
  
  if (params.pricingType) {
    where.pricingType = params.pricingType
  }
  
  return await prisma.product.findMany({ where })
}
```

### 7. Voting System

**Implementation**:

1. Vote API endpoint:
```typescript
// src/app/api/products/[id]/vote/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  try {
    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: params.id
        }
      }
    })
    
    if (existingVote) {
      // Unvote
      await prisma.vote.delete({
        where: { id: existingVote.id }
      })
      await prisma.product.update({
        where: { id: params.id },
        data: { votesCount: { decrement: 1 } }
      })
      return Response.json({ voted: false })
    } else {
      // Vote
      await prisma.vote.create({
        data: {
          userId: session.user.id,
          productId: params.id
        }
      })
      await prisma.product.update({
        where: { id: params.id },
        data: { votesCount: { increment: 1 } }
      })
      return Response.json({ voted: true })
    }
  } catch (error) {
    return new Response('Error', { status: 500 })
  }
}
```

2. Vote button component:
```typescript
// src/components/VoteButton.tsx
'use client'

export function VoteButton({ productId, initialVoted, initialCount }) {
  const [voted, setVoted] = useState(initialVoted)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  
  async function handleVote() {
    setLoading(true)
    const res = await fetch(`/api/products/${productId}/vote`, {
      method: 'POST'
    })
    const data = await res.json()
    setVoted(data.voted)
    setCount(c => data.voted ? c + 1 : c - 1)
    setLoading(false)
  }
  
  return (
    <button 
      onClick={handleVote}
      disabled={loading}
      className={voted ? 'voted' : ''}
    >
      ▲ {count}
    </button>
  )
}
```

---

## 🎨 Customization Guide

### Branding

1. **Logo**: Replace files in `public/`:
   - `logo.png` (main logo)
   - `favicon.ico` (browser icon)
   - `apple-touch-icon.png` (iOS icon)

2. **Colors**: Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#your-color',
    // ... up to 900
  }
}
```

3. **Typography**: Change font in `src/app/layout.tsx`:
```typescript
import { YourFont } from 'next/font/google'

const yourFont = YourFont({ subsets: ['latin'] })
```

### Adding New Categories

1. Via Prisma Studio:
```bash
npm run prisma:studio
```

2. Via seed script:
```typescript
// prisma/seed.ts
const categories = [
  { name: 'AI & ML', slug: 'ai-ml', icon: '🤖' },
  { name: 'Productivity', slug: 'productivity', icon: '⚡' },
  // Add more...
]

for (const cat of categories) {
  await prisma.category.create({ data: cat })
}
```

### Customizing Email Templates

Create templates in `src/emails/`:

```typescript
// src/emails/welcome.ts
export function welcomeEmail(userName: string) {
  return {
    subject: 'Welcome to Product Hub!',
    html: `
      <h1>Hi ${userName}!</h1>
      <p>Welcome to our community...</p>
    `
  }
}
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros**: Easiest, automatic SSL, global CDN, preview deployments
**Cost**: Free tier available, $20/mo for Pro

**Steps**:
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Option 2: AWS

**Pros**: Full control, scalable, many services
**Cost**: ~$50-200/mo depending on usage

**Components**:
- EC2 for application
- RDS for PostgreSQL
- S3 for static assets
- CloudFront for CDN
- Route 53 for DNS

### Option 3: DigitalOcean

**Pros**: Simple, cost-effective, good balance
**Cost**: ~$30-100/mo

**Steps**:
1. Create Droplet (Ubuntu 22.04)
2. Install Node.js and PostgreSQL
3. Set up Nginx reverse proxy
4. Deploy with PM2
5. Configure SSL with Let's Encrypt

---

## 🔒 Security Best Practices

### 1. Environment Variables

Never commit secrets. Use `.env` for local, platform secrets for production.

### 2. Authentication

- Use NextAuth.js for secure auth
- Implement rate limiting on login
- Use secure session cookies
- Enable 2FA for admin accounts

### 3. Input Validation

```typescript
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(3).max(100),
  website: z.string().url(),
  description: z.string().min(50).max(5000)
})

// Use in API:
const validated = productSchema.parse(requestBody)
```

### 4. SQL Injection Prevention

Prisma prevents SQL injection by default. Never use raw SQL unless necessary.

### 5. XSS Prevention

- Sanitize user input
- Use React's built-in XSS protection
- Set proper CSP headers

### 6. CORS Configuration

```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'your-domain.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' }
      ]
    }
  ]
}
```

---

## ⚡ Performance Optimization

### 1. Database Optimization

**Indexing**:
```prisma
@@index([field1, field2])
@@index([status, launchDate])
```

**Query Optimization**:
```typescript
// Bad: N+1 query problem
const products = await prisma.product.findMany()
for (const p of products) {
  const votes = await prisma.vote.count({ where: { productId: p.id } })
}

// Good: Use include or select
const products = await prisma.product.findMany({
  include: { _count: { select: { votes: true } } }
})
```

### 2. Caching

**Redis caching**:
```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedProducts() {
  const cached = await redis.get('featured-products')
  if (cached) return JSON.parse(cached)
  
  const products = await fetchProducts()
  await redis.set('featured-products', JSON.stringify(products), 'EX', 3600)
  return products
}
```

### 3. Image Optimization

Use Next.js Image component:
```typescript
import Image from 'next/image'

<Image 
  src="/product.png"
  width={300}
  height={200}
  alt="Product"
  priority={false}
  loading="lazy"
/>
```

### 4. Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Spinner />,
  ssr: false
})
```

---

## 📊 Monitoring & Analytics

### Application Monitoring

**Sentry Integration**:
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### Business Analytics

**Track key events**:
```typescript
// src/lib/analytics.ts
export function trackEvent(event: string, properties?: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties)
  }
}

// Usage:
trackEvent('product_viewed', { productId, category })
trackEvent('vote_cast', { productId })
```

---

## 🧪 Testing

### Unit Tests

```typescript
// src/lib/__tests__/search.test.ts
import { searchProducts } from '../search'

describe('searchProducts', () => {
  it('should return matching products', async () => {
    const results = await searchProducts('AI')
    expect(results).toHaveLength(5)
    expect(results[0].name).toContain('AI')
  })
})
```

### API Tests

```typescript
import { GET } from '../app/api/products/route'

describe('Products API', () => {
  it('should return products list', async () => {
    const request = new Request('http://localhost/api/products')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.data).toBeInstanceOf(Array)
  })
})
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Database connection fails
**Solution**: Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`

**Issue**: Build fails with type errors
**Solution**: Run `npm run prisma:generate` to regenerate types

**Issue**: Images not loading
**Solution**: Add domain to `next.config.js` images.domains

**Issue**: API rate limit not working
**Solution**: Ensure Redis is configured and accessible

---

## 📞 Support

For implementation help:
- GitHub Issues: [Repository Issues](https://github.com/brandonlacoste9-tech/Product-hunt/issues)
- Documentation: [Full Docs](../README.md)
- Community: [Discord](https://discord.gg/producthub)

---

**Happy Building! 🚀**
