import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">🚀 Discover NA</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/explore" className="text-gray-700 hover:text-primary-600 transition">
                Explore
              </Link>
              <Link href="/local" className="text-gray-700 hover:text-primary-600 transition">
                Local
              </Link>
              <Link href="/events" className="text-gray-700 hover:text-primary-600 transition">
                Events
              </Link>
              <Link href="/api-docs" className="text-gray-700 hover:text-primary-600 transition">
                API
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 transition">
                About
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/submit" 
                className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition"
              >
                Submit Product
              </Link>
              <button className="text-gray-700 hover:text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🚀 Discover NA</h3>
              <p className="text-gray-400">
                The #1 product discovery hub for North America
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/explore" className="text-gray-400 hover:text-white transition">Explore</Link></li>
                <li><Link href="/submit" className="text-gray-400 hover:text-white transition">Submit Product</Link></li>
                <li><Link href="/events" className="text-gray-400 hover:text-white transition">Events</Link></li>
                <li><Link href="/local" className="text-gray-400 hover:text-white transition">Local Sections</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Developers</h4>
              <ul className="space-y-2">
                <li><Link href="/api-docs" className="text-gray-400 hover:text-white transition">API Docs</Link></li>
                <li><Link href="/api-pricing" className="text-gray-400 hover:text-white transition">API Pricing</Link></li>
                <li><Link href="/developers" className="text-gray-400 hover:text-white transition">Developer Hub</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Discover North America. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-400 hover:text-white transition text-sm">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">Privacy</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
