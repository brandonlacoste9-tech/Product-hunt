import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Pricing configuration
const SPONSOR_TIERS = {
  featured_week: {
    name: 'Featured Product - 1 Week',
    price: 15000, // $150 in cents
    description: 'Your product featured at the top of the homepage for 7 days',
    durationDays: 7,
  },
  featured_month: {
    name: 'Featured Product - 1 Month',
    price: 49900, // $499 in cents
    description: 'Your product featured at the top of the homepage for 30 days',
    durationDays: 30,
  },
  newsletter_spot: {
    name: 'Newsletter Sponsorship',
    price: 25000, // $250 in cents
    description: 'Featured placement in our weekly newsletter (5,000+ subscribers)',
    durationDays: 7,
  },
  homepage_banner: {
    name: 'Homepage Banner',
    price: 50000, // $500 in cents
    description: 'Premium banner placement on the homepage for 7 days',
    durationDays: 7,
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, tier, successUrl, cancelUrl } = body

    // Validate inputs
    if (!productId || !tier || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate tier
    if (!SPONSOR_TIERS[tier as keyof typeof SPONSOR_TIERS]) {
      return NextResponse.json(
        { error: 'Invalid sponsorship tier' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { maker: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const tierConfig = SPONSOR_TIERS[tier as keyof typeof SPONSOR_TIERS]
    
    // Calculate dates
    const startsAt = new Date()
    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + tierConfig.durationDays)

    // Create sponsor purchase record (pending)
    const sponsorPurchase = await prisma.$executeRaw`
      INSERT INTO "SponsorPurchase" (
        id, product_id, stripe_session_id, amount, currency, 
        status, tier, starts_at, ends_at, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${productId}, 'pending', ${tierConfig.price}, 
        'usd', 'pending', ${tier}, ${startsAt}, ${endsAt}, NOW(), NOW()
      )
      RETURNING id
    `

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tierConfig.name,
              description: tierConfig.description,
              images: product.thumbnail ? [product.thumbnail] : undefined,
            },
            unit_amount: tierConfig.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        productId,
        tier,
        sponsorId: sponsorPurchase.toString(),
      },
      customer_email: product.maker?.email,
    })

    // Update sponsor record with session ID
    await prisma.$executeRaw`
      UPDATE "SponsorPurchase" 
      SET stripe_session_id = ${session.id}
      WHERE product_id = ${productId} 
      AND tier = ${tier} 
      AND status = 'pending'
    `

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
