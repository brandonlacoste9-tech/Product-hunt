import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout/Layout'

const cities = [
  { name: 'San Francisco', slug: 'san-francisco', country: '🇺🇸', products: 234, makers: 89 },
  { name: 'New York', slug: 'new-york', country: '🇺🇸', products: 198, makers: 76 },
  { name: 'Toronto', slug: 'toronto', country: '🇨🇦', products: 156, makers: 62 },
  { name: 'Austin', slug: 'austin', country: '🇺🇸', products: 143, makers: 54 },
  { name: 'Vancouver', slug: 'vancouver', country: '🇨🇦', products: 128, makers: 48 },
  { name: 'Mexico City', slug: 'mexico-city', country: '🇲🇽', products: 112, makers: 45 },
  { name: 'Seattle', slug: 'seattle', country: '🇺🇸', products: 134, makers: 51 },
  { name: 'Los Angeles', slug: 'los-angeles', country: '🇺🇸', products: 167, makers: 63 },
  { name: 'Boston', slug: 'boston', country: '🇺🇸', products: 145, makers: 57 },
  { name: 'Montreal', slug: 'montreal', country: '🇨🇦', products: 98, makers: 39 },
  { name: 'Chicago', slug: 'chicago', country: '🇺🇸', products: 121, makers: 47 },
  { name: 'Miami', slug: 'miami', country: '🇺🇸', products: 87, makers: 34 },
  { name: 'Denver', slug: 'denver', country: '🇺🇸', products: 76, makers: 29 },
  { name: 'Guadalajara', slug: 'guadalajara', country: '🇲🇽', products: 65, makers: 28 },
  { name: 'Atlanta', slug: 'atlanta', country: '🇺🇸', products: 93, makers: 38 },
]

export default function Local() {
  return (
    <Layout>
      <Head>
        <title>Local Sections - Discover North America</title>
        <meta name="description" content="Discover products from your city. Connect with local makers and startups across North America." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">🏙️ Local Product Discovery</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Discover innovative products and connect with makers in your city. From San Francisco to Mexico City, explore North America's tech hubs.
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse by City</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cities.map(city => (
              <Link 
                key={city.slug}
                href={`/local/${city.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="text-3xl mb-2">{city.country}</div>
                <h3 className="text-xl font-bold mb-2">{city.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{city.products} products</div>
                  <div>{city.makers} makers</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Local Matters</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold text-lg mb-2">Connect Locally</h3>
              <p className="text-gray-600">
                Build relationships with makers and founders in your city
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-lg mb-2">Support Local</h3>
              <p className="text-gray-600">
                Discover and support innovative products from your community
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-bold text-lg mb-2">In-Person Events</h3>
              <p className="text-gray-600">
                Join local meetups, demo days, and networking events
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
