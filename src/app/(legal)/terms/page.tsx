import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Product Discovery Hub',
  description: 'Terms and conditions for using our platform.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: February 28, 2026</p>

          <div className="prose prose-orange max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using Product Discovery Hub ("the Platform"), you agree to be bound 
                by these Terms of Service. If you disagree with any part of these terms, you may 
                not access the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                Product Discovery Hub is a platform for discovering, sharing, and discussing new 
                products, services, and technologies. Users can submit products, vote, comment, 
                and engage with the community.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-2">3.1 Registration</h3>
              <p className="text-gray-600 mb-4">
                To access certain features, you must create an account. You agree to provide 
                accurate, current, and complete information during registration.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-2">3.2 Account Security</h3>
              <p className="text-gray-600 mb-4">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to notify us immediately of any unauthorized access or use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Product Submissions</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-2">4.1 Eligibility</h3>
              <p className="text-gray-600 mb-4">
                By submitting a product, you confirm that:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>You have the right to promote the product</li>
                <li>The product is available in North America (US, Canada, or Mexico)</li>
                <li>All information provided is accurate and truthful</li>
                <li>The product complies with applicable laws and regulations</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">4.2 Prohibited Products</h3>
              <p className="text-gray-600 mb-4">
                The following are not allowed on the Platform:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Illegal products or services</li>
                <li>Pornographic or adult content</li>
                <li>Weapons or explosives</li>
                <li>Drugs or controlled substances</li>
                <li>Counterfeit or fraudulent items</li>
                <li>Products promoting hate speech or discrimination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Voting and Engagement</h2>
              <p className="text-gray-600 mb-4">
                Users may vote on products and leave comments. You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Use bots or automated systems to manipulate votes</li>
                <li>Create multiple accounts to vote multiple times</li>
                <li>Post spam, harassment, or abusive content</li>
                <li>Impersonate other users or entities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Featured Listings and Payments</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-2">6.1 Payment Terms</h3>
              <p className="text-gray-600 mb-4">
                Featured listings are available for purchase through Stripe. All payments are 
                processed securely. Prices are in USD unless otherwise specified.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-2">6.2 Refund Policy</h3>
              <p className="text-gray-600 mb-4">
                We offer a 30-day money-back guarantee for featured listings. If you are not 
                satisfied with your featured placement, contact us within 30 days for a full refund.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-2">6.3 Listing Guidelines</h3>
              <p className="text-gray-600 mb-4">
                We reserve the right to reject or remove any featured listing that violates our 
                content guidelines. In such cases, a full refund will be provided.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-2">7.1 Your Content</h3>
              <p className="text-gray-600 mb-4">
                You retain ownership of content you submit to the Platform. By submitting content, 
                you grant us a worldwide, non-exclusive, royalty-free license to use, display, 
                and distribute your content on the Platform.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-2">7.2 Platform Content</h3>
              <p className="text-gray-600 mb-4">
                All content provided by Product Discovery Hub, including logos, designs, and 
                software, is our property and protected by intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account immediately, without prior notice or 
                liability, for any reason, including breach of these Terms. Upon termination, 
                your right to use the Platform will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                Product Discovery Hub and its operators shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages resulting from your 
                use of the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by the laws of the United States and the State 
                of [Your State], without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email: legal@producthub.com<br />
                Address: [Your Business Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
