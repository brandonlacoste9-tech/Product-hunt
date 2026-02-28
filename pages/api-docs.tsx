import Head from 'next/head'
import Layout from '../components/layout/Layout'

export default function ApiDocs() {
  return (
    <Layout>
      <Head>
        <title>API Documentation - Discover North America</title>
        <meta name="description" content="Access product data through our RESTful API. Build apps, tools, and integrations." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">📊 Developer API</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Access product discovery data through our RESTful API. Build apps, research tools, and integrations.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
          
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg mb-8">
            <code className="text-sm">
              <div className="mb-2">curl https://api.discoverna.com/v1/products \</div>
              <div className="ml-4">-H "Authorization: Bearer YOUR_API_KEY"</div>
            </code>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold mb-2">🔑 Get Your API Key</h3>
            <p className="text-gray-700 mb-4">
              Sign up for a free API account to get started. Free tier includes 100 requests per day.
            </p>
            <button className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition">
              Get API Key
            </button>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-8">API Endpoints</h2>

          {/* Products */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-bold">GET</span>
              <code className="text-lg font-mono">/v1/products</code>
            </div>
            <p className="text-gray-700 mb-4">Get a list of products with optional filters</p>
            
            <h4 className="font-bold mb-2">Query Parameters:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <code className="text-primary-600 font-mono">category</code>
                <span className="text-gray-600">Filter by category (saas, mobile, ai, etc.)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-primary-600 font-mono">city</code>
                <span className="text-gray-600">Filter by city slug</span>
              </div>
              <div className="flex gap-4">
                <code className="text-primary-600 font-mono">limit</code>
                <span className="text-gray-600">Number of results (default: 20, max: 100)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-primary-600 font-mono">offset</code>
                <span className="text-gray-600">Pagination offset</span>
              </div>
            </div>

            <div className="mt-4 bg-gray-900 text-gray-100 p-4 rounded text-sm">
              <pre>{`{
  "products": [
    {
      "id": 1,
      "name": "TaskFlow AI",
      "tagline": "AI-powered task management",
      "upvotes": 342,
      "category": "productivity",
      "maker": "Sarah Chen",
      "city": "san-francisco",
      "url": "https://example.com",
      "created_at": "2024-02-28T00:00:00Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}`}</pre>
            </div>
          </div>

          {/* Single Product */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-bold">GET</span>
              <code className="text-lg font-mono">/v1/products/:id</code>
            </div>
            <p className="text-gray-700">Get detailed information about a specific product</p>
          </div>

          {/* Trending */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-bold">GET</span>
              <code className="text-lg font-mono">/v1/products/trending</code>
            </div>
            <p className="text-gray-700">Get trending products based on recent activity</p>
          </div>

          {/* Makers */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-bold">GET</span>
              <code className="text-lg font-mono">/v1/makers/:id</code>
            </div>
            <p className="text-gray-700">Get information about a specific maker and their products</p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-bold">GET</span>
              <code className="text-lg font-mono">/v1/stats</code>
            </div>
            <p className="text-gray-700">Get platform statistics and aggregated data</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-8">API Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">$0<span className="text-base font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>100 requests/day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Basic endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Community support</span>
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                Get Started
              </button>
            </div>

            <div className="bg-white border-2 border-primary-500 rounded-lg p-6 relative">
              <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 text-sm font-bold rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <div className="text-3xl font-bold mb-4">$29<span className="text-base font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>10,000 requests/day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>All endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Email support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Rate limit: 60 req/min</span>
                </li>
              </ul>
              <button className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition">
                Subscribe
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">$99<span className="text-base font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>100,000 requests/day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>All endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Rate limit: 300 req/min</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Webhook notifications</span>
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-6">Rate Limits & Best Practices</h2>
          
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="font-bold mb-3">Rate Limiting</h3>
            <p className="text-gray-700 mb-4">
              API requests are rate-limited based on your subscription tier. Rate limit information is included in response headers:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded text-sm font-mono">
              <div>X-RateLimit-Limit: 60</div>
              <div>X-RateLimit-Remaining: 58</div>
              <div>X-RateLimit-Reset: 1677628800</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold mb-3">Best Practices</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Cache responses when possible to reduce API calls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Use pagination with limit and offset parameters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Handle rate limit errors gracefully (HTTP 429)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Include your API key in the Authorization header</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  )
}
