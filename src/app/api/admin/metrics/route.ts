import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/metrics - Revenue and growth metrics
 * 
 * Authentication: Requires admin role
 * 
 * Returns:
 * - Revenue breakdown (Stripe, affiliates, API)
 * - User growth
 * - Product submissions
 * - Newsletter stats
 * - API usage
 */

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication (simplified - implement proper auth)
    // In production, verify JWT token and check user role === 'ADMIN'
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // Days
    const days = parseInt(period)

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 1. Revenue Metrics (Stripe)
    const stripeRevenue = await prisma.$queryRaw<{
      total_revenue: number
      this_month: number
      active_sponsors: number
    }[]>`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) / 100.0 as total_revenue,
        COALESCE(SUM(CASE 
          WHEN status = 'paid' 
          AND created_at >= DATE_TRUNC('month', NOW()) 
          THEN amount ELSE 0 END), 0) / 100.0 as this_month,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_sponsors
      FROM "SponsorPurchase"
      WHERE created_at >= ${startDate}
    `

    // 2. Newsletter Stats
    const newsletterStats = await prisma.$queryRaw<{
      total_subscribers: number
      new_this_month: number
      by_region_us: number
      by_region_ca: number
      by_region_mx: number
    }[]>`
      SELECT 
        COUNT(CASE WHEN is_active = true THEN 1 END) as total_subscribers,
        COUNT(CASE 
          WHEN is_active = true 
          AND subscribed_at >= DATE_TRUNC('month', NOW()) 
          THEN 1 END) as new_this_month,
        COUNT(CASE WHEN is_active = true AND region = 'US' THEN 1 END) as by_region_us,
        COUNT(CASE WHEN is_active = true AND region = 'CA' THEN 1 END) as by_region_ca,
        COUNT(CASE WHEN is_active = true AND region = 'MX' THEN 1 END) as by_region_mx
      FROM "NewsletterSubscriber"
    `

    // 3. User Growth
    const userStats = await prisma.$queryRaw<{
      total_users: number
      new_this_month: number
      makers: number
      premium_users: number
    }[]>`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= DATE_TRUNC('month', NOW()) THEN 1 END) as new_this_month,
        COUNT(CASE WHEN role = 'MAKER' THEN 1 END) as makers,
        COUNT(CASE WHEN is_premium = true THEN 1 END) as premium_users
      FROM "User"
    `

    // 4. Product Stats
    const productStats = await prisma.$queryRaw<{
      total_products: number
      new_this_month: number
      featured: number
      total_votes: number
      by_region_us: number
      by_region_ca: number
      by_region_mx: number
    }[]>`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN created_at >= DATE_TRUNC('month', NOW()) THEN 1 END) as new_this_month,
        COUNT(CASE WHEN featured = true THEN 1 END) as featured,
        COALESCE(SUM(votes_count), 0) as total_votes,
        COUNT(CASE WHEN region = 'US' THEN 1 END) as by_region_us,
        COUNT(CASE WHEN region = 'CA' THEN 1 END) as by_region_ca,
        COUNT(CASE WHEN region = 'MX' THEN 1 END) as by_region_mx
      FROM "Product"
      WHERE status = 'APPROVED'
    `

    // 5. Affiliate Stats
    const affiliateStats = await prisma.$queryRaw<{
      total_clicks: number
      total_conversions: number
      estimated_revenue: number
    }[]>`
      SELECT 
        COALESCE(SUM(affiliate_clicks), 0) as total_clicks,
        COALESCE(SUM(affiliate_conversions), 0) as total_conversions,
        COALESCE(SUM(affiliate_conversions * 50), 0) as estimated_revenue
      FROM "Product"
    `

    // 6. API Usage Stats
    const apiStats = await prisma.$queryRaw<{
      total_requests: number
      unique_keys: number
      avg_response_time: number
    }[]>`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(DISTINCT api_key_id) as unique_keys,
        COALESCE(AVG(response_time_ms), 0) as avg_response_time
      FROM "ApiUsage"
      WHERE created_at >= ${startDate}
    `

    // 7. Revenue by tier (for MRR calculation)
    const revenueByTier = await prisma.$queryRaw<{
      tier: string
      count: number
      revenue: number
    }[]>`
      SELECT 
        tier,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) / 100.0 as revenue
      FROM "SponsorPurchase"
      WHERE status = 'paid'
        AND created_at >= ${startDate}
      GROUP BY tier
    `

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = stripeRevenue[0]?.this_month || 0

    // Compile response
    const metrics = {
      summary: {
        mrr,
        totalRevenue: stripeRevenue[0]?.total_revenue || 0,
        totalUsers: Number(userStats[0]?.total_users),
        totalProducts: Number(productStats[0]?.total_products),
        newsletterSubscribers: Number(newsletterStats[0]?.total_subscribers),
      },
      revenue: {
        stripe: {
          total: stripeRevenue[0]?.total_revenue || 0,
          thisMonth: stripeRevenue[0]?.this_month || 0,
          activeSponsors: Number(stripeRevenue[0]?.active_sponsors),
          byTier: revenueByTier,
        },
        affiliate: {
          totalClicks: Number(affiliateStats[0]?.total_clicks),
          totalConversions: Number(affiliateStats[0]?.total_conversions),
          estimatedRevenue: Number(affiliateStats[0]?.estimated_revenue),
          conversionRate: affiliateStats[0]?.total_clicks > 0
            ? (Number(affiliateStats[0]?.total_conversions) / Number(affiliateStats[0]?.total_clicks) * 100).toFixed(2) + '%'
            : '0%',
        },
        api: {
          totalRequests: Number(apiStats[0]?.total_requests),
          uniqueKeys: Number(apiStats[0]?.unique_keys),
          avgResponseTime: Number(apiStats[0]?.avg_response_time).toFixed(2) + 'ms',
        },
      },
      growth: {
        users: {
          total: Number(userStats[0]?.total_users),
          newThisMonth: Number(userStats[0]?.new_this_month),
          makers: Number(userStats[0]?.makers),
          premium: Number(userStats[0]?.premium_users),
        },
        products: {
          total: Number(productStats[0]?.total_products),
          newThisMonth: Number(productStats[0]?.new_this_month),
          featured: Number(productStats[0]?.featured),
          totalVotes: Number(productStats[0]?.total_votes),
          byRegion: {
            us: Number(productStats[0]?.by_region_us),
            ca: Number(productStats[0]?.by_region_ca),
            mx: Number(productStats[0]?.by_region_mx),
          },
        },
        newsletter: {
          total: Number(newsletterStats[0]?.total_subscribers),
          newThisMonth: Number(newsletterStats[0]?.new_this_month),
          byRegion: {
            us: Number(newsletterStats[0]?.by_region_us),
            ca: Number(newsletterStats[0]?.by_region_ca),
            mx: Number(newsletterStats[0]?.by_region_mx),
          },
        },
      },
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Admin metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
