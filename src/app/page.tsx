import Link from 'next/link'
import { TrendingUp, Sparkles, Calendar, MapPin, Search, Menu } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                🚀 Product Hub
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/products" className="text-gray-700 hover:text-primary-600 transition">
                  Products
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition">
                  Categories
                </Link>
                <Link href="/events" className="text-gray-700 hover:text-primary-600 transition">
                  Events
                </Link>
                <Link href="/regions" className="text-gray-700 hover:text-primary-600 transition">
                  Regions
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/search" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Search className="w-5 h-5 text-gray-600" />
              </Link>
              <Link href="/submit" className="btn btn-primary">
                Submit Product
              </Link>
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-orange-500 bg-clip-text text-transparent">
            Discover Amazing Products
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The largest product discovery platform for North America. Find innovative products, connect with makers, and stay ahead of trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn btn-primary text-lg px-8 py-3">
              Explore Products
            </Link>
            <Link href="/submit" className="btn btn-secondary text-lg px-8 py-3">
              Launch Your Product
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-primary-600" />}
            title="Trending Products"
            description="Discover what's hot and trending across North America"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-primary-600" />}
            title="AI Recommendations"
            description="Get personalized product suggestions powered by AI"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-primary-600" />}
            title="Launch Events"
            description="Join exclusive launch events and meet makers"
          />
          <FeatureCard
            icon={<MapPin className="w-8 h-8 text-primary-600" />}
            title="Regional Focus"
            description="Explore products specific to your region"
          />
        </div>
      </section>

      {/* Sample Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Today's Featured Products</h2>
          <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <ProductCard
            name="AI Content Studio"
            tagline="Create stunning content with AI"
            category="Productivity"
            votes={234}
            region="US"
          />
          <ProductCard
            name="CodeFlow"
            tagline="Next-gen code collaboration platform"
            category="Developer Tools"
            votes={189}
            region="CA"
          />
          <ProductCard
            name="DesignHub"
            tagline="All-in-one design toolkit"
            category="Design"
            votes={156}
            region="US"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary-600 to-orange-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Launch?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of makers and reach millions of potential users
          </p>
          <Link href="/submit" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition inline-block">
            Submit Your Product
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Product Hub</h3>
              <p className="text-gray-600 text-sm">
                The largest product discovery platform for North America
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/products">Browse Products</Link></li>
                <li><Link href="/categories">Categories</Link></li>
                <li><Link href="/events">Events</Link></li>
                <li><Link href="/api">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/cookies">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 Product Discovery Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function ProductCard({ name, tagline, category, votes, region }: { name: string; tagline: string; category: string; votes: number; region: string }) {
  return (
    <div className="card group cursor-pointer">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
          {name[0]}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-primary-600 transition">{name}</h3>
          <p className="text-sm text-gray-600">{tagline}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{category}</span>
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{region}</span>
          <span className="flex items-center gap-1 text-primary-600 font-medium">
            ▲ {votes}
          </span>
        </div>
      </div>
    </div>
  )
}
