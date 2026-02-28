import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Product Discovery Hub',
  description: 'How we collect, use, and protect your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: February 28, 2026</p>

          <div className="prose prose-orange max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Product Discovery Hub ("we," "our," or "us") respects your privacy and is committed 
                to protecting your personal data. This privacy policy explains how we collect, use, 
                and safeguard your information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-2">2.1 Personal Information</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Name and email address</li>
                <li>Profile information (bio, website, social links)</li>
                <li>Account credentials (via OAuth providers)</li>
                <li>Payment information (processed by Stripe)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">2.2 Usage Information</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Products you view, vote on, or submit</li>
                <li>Comments and interactions</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Provide and maintain our services</li>
                <li>Process your product submissions and votes</li>
                <li>Send newsletters and updates (with your consent)</li>
                <li>Process payments for featured listings</li>
                <li>Improve our platform and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
              <p className="text-gray-600 mb-4">
                We use industry-standard security measures to protect your data. Your information 
                is stored on secure servers provided by Supabase (PostgreSQL). We implement 
                encryption, access controls, and regular security audits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights (GDPR/CCPA)</h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to deletion ("right to be forgotten")</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p className="text-gray-600">
                To exercise these rights, contact us at privacy@producthub.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Affiliate Links Disclosure</h2>
              <p className="text-gray-600 mb-4">
                Some product listings contain affiliate links. When you click these links and make 
                a purchase, we may earn a commission. This does not affect the price you pay. 
                We clearly label all affiliate links.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze traffic, 
                and personalize content. You can control cookies through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li><strong>Stripe</strong> - Payment processing</li>
                <li><strong>Supabase</strong> - Database and authentication</li>
                <li><strong>Vercel</strong> - Hosting and analytics</li>
                <li><strong>SendGrid/MailerLite</strong> - Email delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email: privacy@producthub.com<br />
                Address: [Your Business Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
