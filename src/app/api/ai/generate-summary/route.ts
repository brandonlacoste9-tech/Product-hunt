import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

interface OpenAIResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, name, description, regenerate = false } = body

    if (!productId && (!name || !description)) {
      return NextResponse.json(
        { error: 'Product ID or name+description required' },
        { status: 400 }
      )
    }

    // If productId provided, fetch from database
    let productName = name
    let productDescription = description

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { name: true, description: true, aiSummary: true },
      })

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      // Return existing summary if available and not regenerating
      if (product.aiSummary && !regenerate) {
        return NextResponse.json({
          summary: product.aiSummary,
          cached: true,
        })
      }

      productName = product.name
      productDescription = product.description
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // Return a fallback summary if no API key
      const fallbackSummary = generateFallbackSummary(productName, productDescription)
      
      if (productId) {
        await prisma.$executeRaw`
          UPDATE "Product" SET ai_summary = ${fallbackSummary} WHERE id = ${productId}
        `
      }
      
      return NextResponse.json({
        summary: fallbackSummary,
        fallback: true,
        message: 'OpenAI API key not configured. Using fallback summary.',
      })
    }

    // Call OpenAI API
    const prompt = `Generate a compelling 2-sentence summary for a product listing.

Product Name: ${productName}
Product Description: ${productDescription}

Requirements:
- Maximum 40 words total
- Highlight the key benefit
- Use engaging, professional language
- Make it sound exciting but authentic

Summary:`

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a product marketing expert who writes concise, compelling product summaries.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data: OpenAIResponse = await response.json()
    const summary = data.choices[0]?.message?.content?.trim() || 
      generateFallbackSummary(productName, productDescription)

    // Save to database if productId provided
    if (productId) {
      await prisma.$executeRaw`
        UPDATE "Product" SET ai_summary = ${summary} WHERE id = ${productId}
      `
    }

    return NextResponse.json({
      summary,
      cached: false,
      model: 'gpt-3.5-turbo',
    })
  } catch (error) {
    console.error('AI summary generation error:', error)
    
    // Return fallback on error
    const fallbackSummary = generateFallbackSummary(
      body?.name || 'This product',
      body?.description || ''
    )
    
    return NextResponse.json({
      summary: fallbackSummary,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 200 }) // Return 200 with fallback
  }
}

// Fallback summary generator (no AI needed)
function generateFallbackSummary(name: string, description: string): string {
  // Extract first sentence or first 100 characters
  const firstSentence = description
    .split(/[.!?]/)
    .filter(s => s.trim().length > 10)[0] || description
  
  const truncated = firstSentence.slice(0, 120).trim()
  const clean = truncated.endsWith('.') ? truncated : `${truncated}...`
  
  return `${name} helps you ${clean.toLowerCase().replace(/^[a-z]/, c => c.toLowerCase())}`
}
