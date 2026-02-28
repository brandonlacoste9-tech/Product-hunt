import Head from 'next/head'
import Layout from '../components/layout/Layout'
import { useState } from 'react'

export default function Submit() {
  const [formData, setFormData] = useState({
    productName: '',
    tagline: '',
    description: '',
    url: '',
    category: 'saas',
    city: '',
    makerName: '',
    makerEmail: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send data to the backend
    console.log('Submitting product:', formData)
    alert('Thank you! Your product has been submitted for review.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Layout>
      <Head>
        <title>Submit Your Product - Discover North America</title>
        <meta name="description" content="Share your product with thousands of early adopters across North America." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">🚀 Submit Your Product</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Share your product with thousands of early adopters, makers, and tech enthusiasts across North America.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Submit Your Product?</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl mb-2">👀</div>
              <div className="font-bold">Get Visibility</div>
              <div className="text-sm text-gray-600">Reach 10K+ users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💬</div>
              <div className="font-bold">Get Feedback</div>
              <div className="text-sm text-gray-600">Real user insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔗</div>
              <div className="font-bold">Build Links</div>
              <div className="text-sm text-gray-600">SEO benefits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold">Find Users</div>
              <div className="text-sm text-gray-600">Early adopters</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              {/* Product Information */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">Product Information</h3>
                
                <div className="mb-6">
                  <label className="block font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., TaskFlow AI"
                  />
                </div>

                <div className="mb-6">
                  <label className="block font-medium mb-2">Tagline *</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    required
                    maxLength={60}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="One-line description (max 60 characters)"
                  />
                  <div className="text-sm text-gray-500 mt-1">{formData.tagline.length}/60 characters</div>
                </div>

                <div className="mb-6">
                  <label className="block font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us more about your product..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block font-medium mb-2">Product URL *</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://yourproduct.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-medium mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="saas">SaaS</option>
                      <option value="mobile">Mobile App</option>
                      <option value="ai">AI / Machine Learning</option>
                      <option value="productivity">Productivity</option>
                      <option value="design">Design Tools</option>
                      <option value="developer-tools">Developer Tools</option>
                      <option value="marketing">Marketing</option>
                      <option value="analytics">Analytics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">City (Optional)</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., San Francisco"
                    />
                  </div>
                </div>
              </div>

              {/* Maker Information */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">Maker Information</h3>
                
                <div className="mb-6">
                  <label className="block font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="makerName"
                    value={formData.makerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div className="mb-6">
                  <label className="block font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="makerEmail"
                    value={formData.makerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                  <div className="text-sm text-gray-500 mt-1">We'll send you updates about your submission</div>
                </div>
              </div>

              {/* Submit */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-bold mb-2">✨ Want to get featured?</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Featured products get 5x more visibility and appear at the top of the homepage. Starting at $99.
                </p>
                <button type="button" className="text-primary-600 font-medium text-sm hover:text-primary-700">
                  Learn more about featured listings →
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-600 transition"
              >
                Submit Product for Free
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                By submitting, you agree to our Terms of Service and acknowledge our Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Tips for a Successful Launch</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold mb-1">📝 Write a compelling tagline</h4>
              <p className="text-sm text-gray-600">Keep it under 60 characters and focus on the main benefit</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold mb-1">📸 Use high-quality images</h4>
              <p className="text-sm text-gray-600">First impressions matter. Show your product in action</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold mb-1">💬 Engage with comments</h4>
              <p className="text-sm text-gray-600">Respond to questions and feedback quickly</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold mb-1">📢 Share your launch</h4>
              <p className="text-sm text-gray-600">Tell your audience you're launching. Bring your community</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
