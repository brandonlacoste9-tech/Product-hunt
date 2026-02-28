import Link from 'next/link'
import { getProducts, getAllCategories } from '@/lib/queries'
import { Search } from 'lucide-react'

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const params = {
    query: searchParams.q,
    category: searchParams.category,
    region: searchParams.region,
    page: parseInt(searchParams.page || '1'),
    limit: 20
  }

  const { products, total, totalPages, page } = await getProducts(params)
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              🚀 Product Hub
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/submit" className="btn btn-primary">
                Submit Product
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                defaultValue={params.query}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {/* Region Filter */}
            <select className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">All Regions</option>
              <option value="US">🇺🇸 United States</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="MX">🇲🇽 Mexico</option>
            </select>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-lg transition ${
                !params.category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className={`px-4 py-2 rounded-lg transition ${
                  params.category === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.icon} {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {products.length} of {total} products
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid gap-6 mb-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Logo */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                      {product.logo ? (
                        <img
                          src={product.logo}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        product.name[0]
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{product.tagline}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          {product.category.icon} {product.category.name}
                        </span>
                        {product.region && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {product.region}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {product.pricingType}
                        </span>
                      </div>
                    </div>

                    {/* Votes */}
                    <div className="flex flex-col items-center gap-1 px-4 py-2 bg-gray-50 rounded-lg">
                      <span className="text-2xl">▲</span>
                      <span className="font-bold text-lg text-primary-600">
                        {product.votesCount}
                      </span>
                      <span className="text-xs text-gray-500">votes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/products?page=${page - 1}${params.category ? `&category=${params.category}` : ''}`}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 border rounded-lg bg-primary-600 text-white">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/products?page=${page + 1}${params.category ? `&category=${params.category}` : ''}`}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
