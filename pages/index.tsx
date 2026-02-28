import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/product/ProductCard'
import { GetStaticProps } from 'next'

interface Product {
  id: number
  name: string
  tagline: string
  description: string
  upvotes: number
  category: string
  imageUrl: string
  url: string
  maker: string
  featured: boolean
  city?: string
}

interface HomeProps {
  products: Product[]
  featuredProducts: Product[]
}

export default function Home({ products, featuredProducts }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = ['all', 'saas', 'mobile', 'ai', 'productivity', 'design', 'developer-tools']
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <Layout>
      <Head>
        <title>Discover North America - Product Discovery Hub</title>
        <meta name="description" content="Discover the best new products, startups, and innovations from across North America. Join the community of makers and early adopters." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              Discover North America's Best Products 🚀
            </h1>
            <p className="text-xl mb-8 opacity-90">
              The #1 hub for discovering innovative products, startups, and services across USA 🇺🇸, Canada 🇨🇦, and Mexico 🇲🇽
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/submit" 
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Submit Your Product
              </Link>
              <Link 
                href="/explore" 
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition border-2 border-white"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">580M+</div>
              <div className="text-gray-600">Potential Reach</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">15K+</div>
              <div className="text-gray-600">Startups Yearly</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">3</div>
              <div className="text-gray-600">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">20+</div>
              <div className="text-gray-600">Major Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="text-yellow-500 mr-2">⭐</span>
              Featured Products
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            {selectedCategory === 'all' ? 'All Products' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')} Products`}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Launch Your Product?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of makers showcasing their innovations to North America
          </p>
          <Link 
            href="/submit" 
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Submit Your Product - It's Free
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Discover North America?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🌎</div>
              <h3 className="text-xl font-bold mb-2">Multi-Language Support</h3>
              <p className="text-gray-600">
                Reach audiences in English, Spanish, and French - covering all of North America
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Discovery</h3>
              <p className="text-gray-600">
                Smart recommendations help users find products they'll love
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2">Events & Launches</h3>
              <p className="text-gray-600">
                Join virtual and in-person events, demo days, and product launches
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Public API</h3>
              <p className="text-gray-600">
                Access our data through a developer-friendly REST API
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🏙️</div>
              <h3 className="text-xl font-bold mb-2">Local Sections</h3>
              <p className="text-gray-600">
                Discover products from your city - from San Francisco to Toronto to Mexico City
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Join a community of makers, founders, and early adopters
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // In production, this would fetch from a database
  // For now, we'll use sample data
  const products: Product[] = [
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
      featured: true,
      city: 'San Francisco'
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
      featured: true,
      city: 'Toronto'
    },
    {
      id: 3,
      name: 'DesignKit Plus',
      tagline: 'Beautiful UI components for developers',
      description: 'Production-ready components that just work',
      upvotes: 256,
      category: 'design',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      url: 'https://example.com',
      maker: 'Emily Rodriguez',
      featured: true,
      city: 'Mexico City'
    },
    {
      id: 4,
      name: 'DataViz Studio',
      tagline: 'Create stunning data visualizations in minutes',
      description: 'Transform your data into beautiful, interactive charts',
      upvotes: 198,
      category: 'saas',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      url: 'https://example.com',
      maker: 'Alex Thompson',
      featured: false,
      city: 'New York'
    },
    {
      id: 5,
      name: 'MobileFirst Framework',
      tagline: 'Build mobile apps faster than ever',
      description: 'Cross-platform mobile development made easy',
      upvotes: 176,
      category: 'mobile',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
      url: 'https://example.com',
      maker: 'Jordan Lee',
      featured: false,
      city: 'Austin'
    },
    {
      id: 6,
      name: 'VoiceAI Assistant',
      tagline: 'Your personal AI voice assistant',
      description: 'Natural language processing for everyday tasks',
      upvotes: 234,
      category: 'ai',
      imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400',
      url: 'https://example.com',
      maker: 'Chris Park',
      featured: false,
      city: 'Vancouver'
    }
  ]

  const featuredProducts = products.filter(p => p.featured)

  return {
    props: {
      products,
      featuredProducts
    }
  }
}
