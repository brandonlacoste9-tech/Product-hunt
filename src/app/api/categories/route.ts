import { NextResponse } from 'next/server'
import { getAllCategories } from '@/lib/queries'

export async function GET() {
  try {
    const categories = await getAllCategories()
    
    return NextResponse.json({
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
