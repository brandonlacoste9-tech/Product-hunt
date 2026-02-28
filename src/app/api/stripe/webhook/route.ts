import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update sponsor purchase to paid
        await prisma.$executeRaw`
          UPDATE "SponsorPurchase" 
          SET 
            status = 'paid',
            stripe_payment_intent_id = ${session.payment_intent as string},
            updated_at = NOW()
          WHERE stripe_session_id = ${session.id}
        `

        // If it's a featured listing, mark the product as featured
        const metadata = session.metadata
        if (metadata?.productId && metadata?.tier?.includes('featured')) {
          await prisma.product.update({
            where: { id: metadata.productId },
            data: { featured: true },
          })
        }

        console.log(`✅ Payment successful for session: ${session.id}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Mark sponsor purchase as expired
        await prisma.$executeRaw`
          UPDATE "SponsorPurchase" 
          SET status = 'expired', updated_at = NOW()
          WHERE stripe_session_id = ${session.id}
        `
        
        console.log(`⏰ Session expired: ${session.id}`)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // Find and update the sponsor purchase
        const paymentIntentId = charge.payment_intent as string
        await prisma.$executeRaw`
          UPDATE "SponsorPurchase" 
          SET status = 'refunded', updated_at = NOW()
          WHERE stripe_payment_intent_id = ${paymentIntentId}
        `

        // Remove featured status if applicable
        const purchase = await prisma.$queryRaw<[{ product_id: string }]>`
          SELECT product_id FROM "SponsorPurchase" 
          WHERE stripe_payment_intent_id = ${paymentIntentId}
          LIMIT 1
        `
        
        if (purchase[0]) {
          await prisma.product.update({
            where: { id: purchase[0].product_id },
            data: { featured: false },
          })
        }

        console.log(`💰 Refund processed for: ${paymentIntentId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
}
