import Link from 'next/link'
import { getAllCategories } from '@/lib/queries'

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <nav className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            🚀 Product Hub
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse by Category</h1>
          <p className="text-xl text-gray-600">
            Explore products across {categories.length} categories
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center"
              style={{ borderTop: `4px solid ${category.color || '#ef4444'}` }}
            >
              <div className="text-5xl mb-3">{category.icon || '📦'}</div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
