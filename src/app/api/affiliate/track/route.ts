import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/affiliate/track - Track affiliate link clicks
 * 
 * Query Parameters:
 * - productId: Product ID (required)
 * - redirect: Final redirect URL (optional, defaults to product website)
 * 
 * Usage:
 * <a href="/api/affiliate/track?productId=123&redirect=https://product.com">
 *   Buy Now
 * </a>
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const redirectUrl = searchParams.get('redirect')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        website: true,
        affiliateUrl: true,
        affiliateClicks: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Increment click count
    await prisma.$executeRaw`
      UPDATE "Product" 
      SET affiliate_clicks = affiliate_clicks + 1 
      WHERE id = ${productId}
    `

    // Log detailed click data (for analytics)
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'

    await prisma.$executeRaw`
      INSERT INTO "AffiliateClick" (
        id, product_id, ip_address, user_agent, referer, created_at
      ) VALUES (
        gen_random_uuid(), ${productId}, ${ip}, ${userAgent}, ${referer}, NOW()
      )
    `

    // Determine redirect URL
    const finalUrl = product.affiliateUrl || redirectUrl || product.website

    // Redirect to affiliate link
    return NextResponse.redirect(finalUrl, 302)
  } catch (error) {
    console.error('Affiliate tracking error:', error)
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/affiliate/track - Track conversions (webhook from affiliate networks)
 * 
 * This would be called by affiliate networks (Amazon, Impact, etc.)
 * when a sale is completed.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, orderId, amount, commission, network } = body

    if (!productId || !orderId) {
      return NextResponse.json(
        { error: 'Product ID and Order ID required' },
        { status: 400 }
      )
    }

    // Increment conversion count
    await prisma.$executeRaw`
      UPDATE "Product" 
      SET 
        affiliate_conversions = affiliate_conversions + 1,
        updated_at = NOW()
      WHERE id = ${productId}
    `

    // Log conversion
    await prisma.$executeRaw`
      INSERT INTO "AffiliateConversion" (
        id, product_id, order_id, amount, commission, network, created_at
      ) VALUES (
        gen_random_uuid(), ${productId}, ${orderId}, ${amount || 0}, ${commission || 0}, ${network || 'unknown'}, NOW()
      )
    `

    return NextResponse.json({ 
      message: 'Conversion tracked successfully',
      productId,
      orderId,
    })
  } catch (error) {
    console.error('Affiliate conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    )
  }
}
