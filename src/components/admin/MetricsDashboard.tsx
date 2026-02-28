'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Users, 
  Package, 
  Mail, 
  TrendingUp, 
  MousePointer, 
  ShoppingCart,
  Activity,
  Globe
} from 'lucide-react'

interface MetricsData {
  summary: {
    mrr: number
    totalRevenue: number
    totalUsers: number
    totalProducts: number
    newsletterSubscribers: number
  }
  revenue: {
    stripe: {
      total: number
      thisMonth: number
      activeSponsors: number
      byTier: Array<{ tier: string; count: number; revenue: number }>
    }
    affiliate: {
      totalClicks: number
      totalConversions: number
      estimatedRevenue: number
      conversionRate: string
    }
    api: {
      totalRequests: number
      uniqueKeys: number
      avgResponseTime: string
    }
  }
  growth: {
    users: {
      total: number
      newThisMonth: number
      makers: number
      premium: number
    }
    products: {
      total: number
      newThisMonth: number
      featured: number
      totalVotes: number
      byRegion: { us: number; ca: number; mx: number }
    }
    newsletter: {
      total: number
      newThisMonth: number
      byRegion: { us: number; ca: number; mx: number }
    }
  }
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics()
  }, [period])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/metrics?period=${period}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }
      
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-xl">
        <h3 className="font-semibold mb-2">Error loading metrics</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!metrics) return null

  const { summary, revenue, growth } = metrics

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <SummaryCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(summary.mrr)}
          icon={<DollarSign className="w-5 h-5" />}
          trend="+12%"
          color="green"
        />
        <SummaryCard
          title="Total Users"
          value={formatNumber(summary.totalUsers)}
          icon={<Users className="w-5 h-5" />}
          trend={`+${growth.users.newThisMonth} this month`}
          color="blue"
        />
        <SummaryCard
          title="Products Listed"
          value={formatNumber(summary.totalProducts)}
          icon={<Package className="w-5 h-5" />}
          trend={`+${growth.products.newThisMonth} this month`}
          color="purple"
        />
        <SummaryCard
          title="Newsletter Subscribers"
          value={formatNumber(summary.newsletterSubscribers)}
          icon={<Mail className="w-5 h-5" />}
          trend={`+${growth.newsletter.newThisMonth} this month`}
          color="orange"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Stripe Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Stripe Revenue</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold">{formatCurrency(revenue.stripe.thisMonth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total ({period} days)</span>
              <span className="font-semibold">{formatCurrency(revenue.stripe.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Sponsors</span>
              <span className="font-semibold">{revenue.stripe.activeSponsors}</span>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-500 mb-2">By Tier:</p>
              {revenue.stripe.byTier.map((tier) => (
                <div key={tier.tier} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{tier.tier.replace('_', ' ')}</span>
                  <span>{formatCurrency(tier.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Affiliate Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Affiliate Revenue</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Clicks</span>
              <span className="font-semibold">{formatNumber(revenue.affiliate.totalClicks)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conversions</span>
              <span className="font-semibold">{formatNumber(revenue.affiliate.totalConversions)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold">{revenue.affiliate.conversionRate}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Revenue</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(revenue.affiliate.estimatedRevenue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* API Usage */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">API Usage</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Requests</span>
              <span className="font-semibold">{formatNumber(revenue.api.totalRequests)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active API Keys</span>
              <span className="font-semibold">{revenue.api.uniqueKeys}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Response Time</span>
              <span className="font-semibold">{revenue.api.avgResponseTime}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">API Revenue</span>
                <span className="font-semibold">
                  {formatCurrency(revenue.api.uniqueKeys * 30)} {/* Estimate $30/key */}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Geographic Distribution</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Products by Region</p>
              <div className="flex gap-4">
                <RegionBadge flag="🇺🇸" count={growth.products.byRegion.us} label="US" />
                <RegionBadge flag="🇨🇦" count={growth.products.byRegion.ca} label="CA" />
                <RegionBadge flag="🇲🇽" count={growth.products.byRegion.mx} label="MX" />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Newsletter Subscribers by Region</p>
              <div className="flex gap-4">
                <RegionBadge flag="🇺🇸" count={growth.newsletter.byRegion.us} label="US" />
                <RegionBadge flag="🇨🇦" count={growth.newsletter.byRegion.ca} label="CA" />
                <RegionBadge flag="🇲🇽" count={growth.newsletter.byRegion.mx} label="MX" />
              </div>
            </div>
          </div>
        </div>

        {/* User Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">User Breakdown</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold text-lg">{formatNumber(growth.users.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Makers</span>
              <span className="font-semibold">{formatNumber(growth.users.makers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Premium Users</span>
              <span className="font-semibold text-orange-600">{formatNumber(growth.users.premium)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New This Month</span>
              <span className="font-semibold text-green-600">+{formatNumber(growth.users.newThisMonth)}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Votes</span>
                <span className="font-semibold">{formatNumber(growth.products.totalVotes)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}: { 
  title: string
  value: string
  icon: React.ReactNode
  trend: string
  color: 'green' | 'blue' | 'purple' | 'orange'
}) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-green-600">{trend}</span>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function RegionBadge({ flag, count, label }: { flag: string; count: number; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
      <span className="text-xl">{flag}</span>
      <div>
        <p className="font-semibold text-gray-900">{count}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}
