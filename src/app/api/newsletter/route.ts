import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  region: z.enum(['US', 'CA', 'MX']).optional(),
  interests: z.array(z.string()).optional(),
})

// GET /api/newsletter - Get subscriber count (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'count') {
      const result = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count 
        FROM "NewsletterSubscriber" 
        WHERE is_active = true
      `
      
      return NextResponse.json({ 
        count: Number(result[0].count),
        formatted: `${Number(result[0].count).toLocaleString()}+ subscribers`,
      })
    }

    if (action === 'stats') {
      const stats = await prisma.$queryRaw<{
        total: bigint
        us: bigint
        ca: bigint
        mx: bigint
      }[]>`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE region = 'US') as us,
          COUNT(*) FILTER (WHERE region = 'CA') as ca,
          COUNT(*) FILTER (WHERE region = 'MX') as mx
        FROM "NewsletterSubscriber" 
        WHERE is_active = true
      `

      return NextResponse.json({
        total: Number(stats[0].total),
        byRegion: {
          us: Number(stats[0].us),
          ca: Number(stats[0].ca),
          mx: Number(stats[0].mx),
        },
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Newsletter GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter stats' },
      { status: 500 }
    )
  }
}

// POST /api/newsletter - Subscribe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = subscribeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { email, name, region, interests } = result.data

    // Check if already subscribed
    const existing = await prisma.$queryRaw<[{ id: string; is_active: boolean }]>`
      SELECT id, is_active 
      FROM "NewsletterSubscriber" 
      WHERE email = ${email}
      LIMIT 1
    `

    if (existing.length > 0) {
      if (existing[0].is_active) {
        return NextResponse.json(
          { message: 'You are already subscribed!', status: 'already_subscribed' },
          { status: 200 }
        )
      } else {
        // Resubscribe
        await prisma.$executeRaw`
          UPDATE "NewsletterSubscriber" 
          SET is_active = true, unsubscribed_at = NULL, updated_at = NOW()
          WHERE email = ${email}
        `
        return NextResponse.json(
          { message: 'Welcome back! You have been resubscribed.', status: 'resubscribed' },
          { status: 200 }
        )
      }
    }

    // Create new subscriber
    await prisma.$executeRaw`
      INSERT INTO "NewsletterSubscriber" (
        id, email, name, region, interests, is_active, subscribed_at, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${email}, ${name || null}, ${region || null}, 
        ${interests || null}, true, NOW(), NOW(), NOW()
      )
    `

    // TODO: Send welcome email via SendGrid/MailerLite
    // await sendWelcomeEmail(email, name)

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to the newsletter!',
        status: 'subscribed',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

// DELETE /api/newsletter - Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    await prisma.$executeRaw`
      UPDATE "NewsletterSubscriber" 
      SET is_active = false, unsubscribed_at = NOW(), updated_at = NOW()
      WHERE email = ${email}
    `

    return NextResponse.json(
      { message: 'You have been unsubscribed. Sorry to see you go!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    )
  }
}
