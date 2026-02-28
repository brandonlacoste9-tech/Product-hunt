'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Sparkles, Clock, Mail, Home } from 'lucide-react'

const SPONSOR_TIERS = [
  {
    id: 'featured_week',
    name: 'Featured Product',
    price: 150,
    duration: '7 days',
    description: 'Your product featured at the top of the homepage',
    icon: Sparkles,
    popular: true,
  },
  {
    id: 'featured_month',
    name: 'Featured Product Pro',
    price: 499,
    duration: '30 days',
    description: 'Maximum visibility with a full month of featured placement',
    icon: Clock,
    popular: false,
  },
  {
    id: 'newsletter_spot',
    name: 'Newsletter Sponsorship',
    price: 250,
    duration: '1 issue',
    description: 'Featured in our weekly newsletter (5,000+ subscribers)',
    icon: Mail,
    popular: false,
  },
  {
    id: 'homepage_banner',
    name: 'Homepage Banner',
    price: 500,
    duration: '7 days',
    description: 'Premium banner placement at the top of the homepage',
    icon: Home,
    popular: false,
  },
]

interface SponsorPurchaseProps {
  productId: string
  productName: string
}

export function SponsorPurchase({ productId, productName }: SponsorPurchaseProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async (tierId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          tier: tierId,
          successUrl: `${window.location.origin}/sponsor/success`,
          cancelUrl: `${window.location.origin}/sponsor/cancel`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Promote {productName}
        </h3>
        <p className="text-gray-600">
          Get more visibility and reach thousands of potential customers
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {SPONSOR_TIERS.map((tier) => {
          const Icon = tier.icon
          return (
            <div
              key={tier.id}
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedTier === tier.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  selectedTier === tier.id ? 'bg-orange-200' : 'bg-gray-100'
                }`}>
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                    <span className="text-xl font-bold text-orange-600">
                      ${tier.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                  <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tier.duration}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        className="w-full mt-6 bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        disabled={!selectedTier || isLoading}
        onClick={() => selectedTier && handlePurchase(selectedTier)}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : selectedTier ? (
          `Get Featured - $${SPONSOR_TIERS.find(t => t.id === selectedTier)?.price}`
        ) : (
          'Select a plan'
        )}
      </button>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Secure payment powered by Stripe. 30-day money-back guarantee.
      </p>
    </div>
  )
}
