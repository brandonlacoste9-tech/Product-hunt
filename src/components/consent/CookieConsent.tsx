'use client'

import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setShowConsent(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }))
    setShowConsent(false)
    // Enable analytics
    window.dispatchEvent(new Event('cookie-consent-granted'))
  }

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }))
    setShowConsent(false)
  }

  const handleSavePreferences = (preferences: {
    analytics: boolean
    marketing: boolean
  }) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: new Date().toISOString(),
    }))
    setShowPreferences(false)
    setShowConsent(false)
    
    if (preferences.analytics) {
      window.dispatchEvent(new Event('cookie-consent-granted'))
    }
  }

  if (!showConsent) return null

  return (
    <>
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-orange-100 rounded-lg hidden sm:block">
                <Cookie className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  We value your privacy
                </h3>
                <p className="text-sm text-gray-600 max-w-2xl">
                  We use cookies to enhance your browsing experience, serve personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                  Read our{' '}
                  <a href="/privacy" className="text-orange-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  for more information.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowPreferences(true)}
                className="flex-1 md:flex-none px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Preferences
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="flex-1 md:flex-none px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Necessary Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <PreferencesModal 
          onClose={() => setShowPreferences(false)}
          onSave={handleSavePreferences}
        />
      )}
    </>
  )
}

function PreferencesModal({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void
  onSave: (prefs: { analytics: boolean; marketing: boolean }) => void
}) {
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Necessary - Always on */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Necessary</h3>
              <p className="text-sm text-gray-600 mt-1">
                Essential cookies required for the website to function properly. 
                Cannot be disabled.
              </p>
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600 cursor-not-allowed">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white" />
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Help us understand how visitors interact with our website 
                (Google Analytics, Plausible).
              </p>
            </div>
            <button
              onClick={() => setAnalytics(!analytics)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                analytics ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`${
                  analytics ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
          </div>

          {/* Marketing */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Marketing</h3>
              <p className="text-sm text-gray-600 mt-1">
                Used to deliver personalized advertisements and track their performance 
                (Meta Pixel, Twitter Pixel).
              </p>
            </div>
            <button
              onClick={() => setMarketing(!marketing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                marketing ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`${
                  marketing ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ analytics, marketing })}
            className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper hook to check if analytics is enabled
export function useAnalyticsConsent(): boolean {
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    const checkConsent = () => {
      const stored = localStorage.getItem('cookie-consent')
      if (stored) {
        const parsed = JSON.parse(stored)
        setConsent(parsed.analytics === true)
      }
    }

    checkConsent()
    window.addEventListener('cookie-consent-granted', checkConsent)
    return () => window.removeEventListener('cookie-consent-granted', checkConsent)
  }, [])

  return consent
}
