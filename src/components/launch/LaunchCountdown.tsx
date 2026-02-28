'use client'

import { useState, useEffect } from 'react'
import { Clock, Bell, Share2 } from 'lucide-react'

interface LaunchCountdownProps {
  productName: string
  launchDate: Date | string
  productUrl?: string
  onNotifyMe?: (email: string) => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function LaunchCountdown({ 
  productName, 
  launchDate, 
  productUrl,
  onNotifyMe 
}: LaunchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [email, setEmail] = useState('')
  const [notified, setNotified] = useState(false)
  const targetDate = new Date(launchDate)
  const isLaunched = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onNotifyMe) {
      onNotifyMe(email)
      setNotified(true)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `${productName} is launching soon!`,
      text: `Check out ${productName} launching on Product Discovery Hub`,
      url: productUrl || window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6" />
        <h3 className="text-xl font-bold">
          {isLaunched ? '🚀 Now Live!' : 'Launching Soon'}
        </h3>
      </div>

      <p className="text-orange-100 mb-6">
        {isLaunched 
          ? `${productName} is now live! Check it out.`
          : `${productName} is launching soon. Be the first to know.`
        }
      </p>

      {!isLaunched && (
        <>
          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>

          {/* Notify Me Form */}
          {!notified ? (
            <form onSubmit={handleNotifyMe} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-white outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Notify Me
                </button>
              </div>
              <p className="text-xs text-orange-200 mt-2">
                We'll email you when {productName} launches. No spam.
              </p>
            </form>
          ) : (
            <div className="bg-white/20 rounded-lg p-4 mb-4 text-center">
              <p className="font-semibold">✅ You're on the list!</p>
              <p className="text-sm text-orange-100">We'll notify you at {email}</p>
            </div>
          )}
        </>
      )}

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share Launch
      </button>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/10 rounded-lg p-3 text-center">
      <div className="text-2xl font-bold">{String(value).padStart(2, '0')}</div>
      <div className="text-xs text-orange-200">{label}</div>
    </div>
  )
}

/**
 * Featured Launch Banner - For homepage
 */
export function FeaturedLaunchBanner({ 
  products 
}: { 
  products: Array<{
    id: string
    name: string
    tagline: string
    launchDate: Date
    image?: string
  }>
}) {
  const upcomingLaunches = products
    .filter(p => new Date(p.launchDate) > new Date())
    .sort((a, b) => new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime())
    .slice(0, 3)

  if (upcomingLaunches.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-orange-600" />
        Upcoming Launches
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {upcomingLaunches.map((product) => (
          <div 
            key={product.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-start gap-4 mb-4">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.tagline}</p>
              </div>
            </div>
            <LaunchCountdown 
              productName={product.name}
              launchDate={product.launchDate}
              productUrl={`/products/${product.id}`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
