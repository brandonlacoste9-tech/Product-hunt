import Link from 'next/link'
import { useState } from 'react'

interface Product {
  id: number
  name: string
  tagline: string
  upvotes: number
  category: string
  imageUrl: string
  maker: string
  city?: string
}

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const [upvoted, setUpvoted] = useState(false)
  const [currentUpvotes, setCurrentUpvotes] = useState(product.upvotes)

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!upvoted) {
      setUpvoted(true)
      setCurrentUpvotes(prev => prev + 1)
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 ${featured ? 'border-2 border-primary-200' : 'border border-gray-200'}`}>
      {featured && (
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
            ⭐ Featured
          </span>
        </div>
      )}
      
      <Link href={`/products/${product.id}`}>
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              {product.name.charAt(0)}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-grow">
            <h3 className="font-bold text-lg mb-1 hover:text-primary-600 transition">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {product.tagline}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {product.maker}
              </span>
              {product.city && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {product.city}
                </span>
              )}
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                {product.category}
              </span>
            </div>
          </div>

          {/* Upvote Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleUpvote}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 transition ${
                upvoted 
                  ? 'bg-primary-500 border-primary-500 text-white' 
                  : 'bg-white border-gray-200 hover:border-primary-500 text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(-90 12 12)" />
              </svg>
              <span className="text-xs font-bold">{currentUpvotes}</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
