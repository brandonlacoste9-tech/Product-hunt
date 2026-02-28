import { prisma } from './prisma'
import { SearchParams, ProductStatus } from '@/types'

export async function getProducts(params: SearchParams = {}) {
  const {
    query,
    category,
    region,
    pricingType,
    status = ProductStatus.APPROVED,
    page = 1,
    limit = 20,
    orderBy = 'votes',
    order = 'desc'
  } = params

  const where: any = { status }

  // Search query
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { tagline: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { tags: { has: query.toLowerCase() } }
    ]
  }

  // Filters
  if (category) where.categoryId = category
  if (region) where.region = region
  if (pricingType) where.pricingType = pricingType

  // Ordering
  const orderByClause: any = {}
  if (orderBy === 'votes') orderByClause.votesCount = order
  else if (orderBy === 'date') orderByClause.launchDate = order
  else orderByClause.name = order

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: orderByClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        maker: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      }
    }),
    prisma.product.count({ where })
  ])

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      maker: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          website: true,
          twitter: true
        }
      },
      votes: {
        select: {
          userId: true,
          createdAt: true
        }
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })
}

export async function getFeaturedProducts(limit = 10) {
  return await prisma.product.findMany({
    where: {
      status: ProductStatus.APPROVED,
      featured: true
    },
    orderBy: {
      votesCount: 'desc'
    },
    take: limit,
    include: {
      category: true,
      maker: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function getTrendingProducts(limit = 10) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return await prisma.product.findMany({
    where: {
      status: ProductStatus.APPROVED,
      launchDate: {
        gte: sevenDaysAgo
      }
    },
    orderBy: {
      votesCount: 'desc'
    },
    take: limit,
    include: {
      category: true,
      maker: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function getProductsByCategory(categorySlug: string, limit = 20) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  })

  if (!category) return null

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      status: ProductStatus.APPROVED
    },
    orderBy: {
      votesCount: 'desc'
    },
    take: limit,
    include: {
      category: true,
      maker: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })

  return { category, products }
}

export async function getProductsByRegion(region: string, limit = 20) {
  return await prisma.product.findMany({
    where: {
      region,
      status: ProductStatus.APPROVED
    },
    orderBy: {
      votesCount: 'desc'
    },
    take: limit,
    include: {
      category: true,
      maker: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: {
      order: 'asc'
    }
  })
}

export async function getUpcomingEvents(limit = 10) {
  return await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date()
      }
    },
    orderBy: {
      startDate: 'asc'
    },
    take: limit,
    include: {
      products: {
        take: 5,
        include: {
          category: true
        }
      }
    }
  })
}
