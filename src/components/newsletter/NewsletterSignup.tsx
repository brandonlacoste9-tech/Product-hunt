'use client'

import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'default' | 'inline' | 'card'
  className?: string
}

export function NewsletterSignup({ variant = 'default', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [region, setRegion] = useState('US')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          region,
          interests: ['productivity', 'saas', 'startups'],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    }
  }

  // Inline variant (compact, for header/footer)
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
        >
          {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe'}
        </button>
      </form>
    )
  }

  // Card variant (for dedicated newsletter page)
  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-8 h-8" />
          <h3 className="text-2xl font-bold">Weekly Newsletter</h3>
        </div>
        <p className="text-orange-100 mb-6">
          Get the best new products delivered to your inbox every Tuesday. 
          Join 5,000+ makers and entrepreneurs.
        </p>

        {status === 'success' ? (
          <div className="flex items-center gap-3 bg-white/20 rounded-lg p-4">
            <Check className="w-6 h-6 text-green-300" />
            <p>{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white outline-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white outline-none"
                required
              />
            </div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white outline-none"
            >
              <option value="US">🇺🇸 United States</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="MX">🇲🇽 Mexico</option>
            </select>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 disabled:opacity-50 transition"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subscribing...
                </span>
              ) : (
                'Subscribe Free'
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-4 text-red-200">{message}</p>
        )}

        <p className="mt-4 text-sm text-orange-200">
          No spam. Unsubscribe anytime. Read our{' '}
          <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
        </p>
      </div>
    )
  }

  // Default variant (for homepage/landing)
  return (
    <div className={`bg-gray-50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Mail className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Weekly Digest</h3>
          <p className="text-sm text-gray-600">Top 10 products every Tuesday</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <Check className="w-5 h-5" />
          <span className="text-sm">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-3 text-sm text-red-600">{message}</p>
      )}
    </div>
  )
}
