import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey } from '../auth/api-key/route'

/**
 * GET /api/feed - Premium API feed for B2B customers
 * 
 * Authentication: Bearer token (API Key)
 * Rate Limiting: Based on API key tier
 * 
 * Query Parameters:
 * - limit: Number of results (default: 100, max: 1000)
 * - offset: Pagination offset (default: 0)
 * - category: Filter by category slug
 * - region: Filter by region (US, CA, MX)
 * - since: Products created after this date (ISO 8601)
 * - format: 'json' or 'csv' (default: json)
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // 1. Authenticate request
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: 'API key required. Use: Authorization: Bearer YOUR_API_KEY',
          documentation: 'https://docs.yoursite.com/api'
        },
        { status: 401 }
      )
    }

    const apiKey = authHeader.substring(7)
    const validation = await validateApiKey(apiKey)

    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: validation.error 
        },
        { status: 401 }
      )
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const region = searchParams.get('region')
    const since = searchParams.get('since')
    const format = searchParams.get('format') || 'json'

    // 3. Build query
    let whereConditions: string[] = ['p.status = \'APPROVED\'']
    
    if (category) {
      whereConditions.push(`c.slug = '${category}'`)
    }
    
    if (region) {
      whereConditions.push(`p.region = '${region}'`)
    }
    
    if (since) {
      whereConditions.push(`p.created_at > '${since}'`)
    }

    const whereClause = whereConditions.join(' AND ')

    // 4. Fetch data
    const products = await prisma.$queryRaw<{
      id: string
      name: string
      tagline: string
      description: string
      website: string
      logo: string | null
      category: string
      category_slug: string
      tags: string[]
      region: string | null
      pricing_type: string
      price: number | null
      votes_count: number
      comments_count: number
      views_count: number
      launch_date: Date | null
      created_at: Date
      maker_name: string | null
      maker_twitter: string | null
    }[]>`
      SELECT 
        p.id,
        p.name,
        p.tagline,
        p.description,
        p.website,
        p.logo,
        c.name as category,
        c.slug as category_slug,
        p.tags,
        p.region,
        p.pricing_type,
        p.price,
        p.votes_count,
        p.comments_count,
        p.views_count,
        p.launch_date,
        p.created_at,
        u.name as maker_name,
        u.twitter as maker_twitter
      FROM "Product" p
      JOIN "Category" c ON p.category_id = c.id
      LEFT JOIN "User" u ON p.maker_id = u.id
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    // 5. Get total count for pagination
    const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "Product" p
      JOIN "Category" c ON p.category_id = c.id
      WHERE ${whereClause}
    `
    const totalCount = Number(countResult[0].count)

    // 6. Log usage
    const responseTime = Date.now() - startTime
    await prisma.$executeRaw`
      INSERT INTO "ApiUsage" (
        id, api_key_id, endpoint, method, status_code, response_time_ms, created_at
      ) VALUES (
        gen_random_uuid(), ${validation.keyId}, '/api/feed', 'GET', 200, ${responseTime}, NOW()
      )
    `

    // 7. Return response
    const response = {
      data: products,
      meta: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
        tier: validation.tier,
        dailyLimit: validation.limit,
      },
    }

    // CSV format
    if (format === 'csv') {
      const headers = Object.keys(products[0] || {}).join(',')
      const rows = products.map(p => 
        Object.values(p).map(v => 
          typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
        ).join(',')
      ).join('\n')
      
      return new NextResponse(`${headers}\n${rows}`, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="products.csv"',
        },
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Feed API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Public endpoint (limited) - No API key required
 * GET /api/feed/public - Free tier, heavily rate-limited
 */
export async function POST(request: NextRequest) {
  // Handle POST requests if needed
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
