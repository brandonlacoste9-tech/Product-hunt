import { Metadata } from 'next'
import { MetricsDashboard } from '@/components/admin/MetricsDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Product Discovery Hub',
  description: 'Revenue and growth metrics dashboard.',
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Revenue, growth, and platform metrics</p>
            </div>
            <a 
              href="/" 
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              ← Back to Site
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <MetricsDashboard />

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <QuickActionCard
            title="Manage Products"
            description="Review pending submissions"
            href="/admin/products"
            count="12 pending"
          />
          <QuickActionCard
            title="Newsletter"
            description="Send weekly digest"
            href="/admin/newsletter"
            count="Draft ready"
          />
          <QuickActionCard
            title="API Keys"
            description="Manage API access"
            href="/admin/api-keys"
            count="24 active"
          />
          <QuickActionCard
            title="Sponsors"
            description="View sponsor activity"
            href="/admin/sponsors"
            count="8 active"
          />
        </div>
      </main>
    </div>
  )
}

function QuickActionCard({ 
  title, 
  description, 
  href, 
  count 
}: { 
  title: string
  description: string
  href: string
  count: string
}) {
  return (
    <a 
      href={href}
      className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
          {count}
        </span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  )
}
