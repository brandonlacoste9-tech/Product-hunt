import type { NextApiRequest, NextApiResponse } from 'next'

type Product = {
  id: number
  name: string
  tagline: string
  description: string
  upvotes: number
  category: string
  imageUrl: string
  url: string
  maker: string
  city?: string
  created_at: string
}

type ApiResponse = {
  products: Product[]
  total: number
  limit: number
  offset: number
}

type ErrorResponse = {
  error: string
}

// Sample data - in production, this would come from a database
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'TaskFlow AI',
    tagline: 'AI-powered task management for modern teams',
    description: 'Streamline your workflow with intelligent task prioritization and automation',
    upvotes: 342,
    category: 'productivity',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
    url: 'https://example.com',
    maker: 'Sarah Chen',
    city: 'san-francisco',
    created_at: '2024-02-28T00:00:00Z'
  },
  {
    id: 2,
    name: 'CodeMentor Pro',
    tagline: 'Learn to code with AI-powered mentorship',
    description: 'Get personalized coding lessons and real-time feedback',
    upvotes: 289,
    category: 'developer-tools',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    url: 'https://example.com',
    maker: 'Marcus Johnson',
    city: 'toronto',
    created_at: '2024-02-27T00:00:00Z'
  },
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | ErrorResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check for API key (in production, validate against database)
  const apiKey = req.headers.authorization?.replace('Bearer ', '')
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }

  // Parse query parameters
  const { category, city, limit = '20', offset = '0' } = req.query
  
  const limitNum = parseInt(limit as string, 10)
  const offsetNum = parseInt(offset as string, 10)

  // Validate limit
  if (limitNum > 100) {
    return res.status(400).json({ error: 'Limit cannot exceed 100' })
  }

  // Filter products
  let filteredProducts = [...sampleProducts]
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category)
  }
  
  if (city) {
    filteredProducts = filteredProducts.filter(p => p.city === city)
  }

  // Pagination
  const paginatedProducts = filteredProducts.slice(offsetNum, offsetNum + limitNum)

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', '100')
  res.setHeader('X-RateLimit-Remaining', '99')
  res.setHeader('X-RateLimit-Reset', Date.now() + 86400000) // 24 hours from now

  // Return response
  res.status(200).json({
    products: paginatedProducts,
    total: filteredProducts.length,
    limit: limitNum,
    offset: offsetNum
  })
}
