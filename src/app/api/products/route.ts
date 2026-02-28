import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/queries'
import { ProductStatus } from '@/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      region: searchParams.get('region') || undefined,
      pricingType: searchParams.get('pricingType') as any,
      status: ProductStatus.APPROVED,
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
      orderBy: (searchParams.get('orderBy') as any) || 'votes',
      order: (searchParams.get('order') as any) || 'desc'
    }

    const result = await getProducts(params)

    return NextResponse.json({
      data: result.products,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // TODO: Add authentication check
    // TODO: Validate request body
    // TODO: Create product in database
    
    return NextResponse.json(
      { error: 'Not implemented yet' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
