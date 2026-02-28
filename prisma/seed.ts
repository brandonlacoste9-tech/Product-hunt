import { PrismaClient, Role, ProductStatus, PricingType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  console.log('Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'AI & Machine Learning',
        slug: 'ai-ml',
        description: 'Artificial intelligence and ML products',
        icon: '🤖',
        color: '#3B82F6',
        order: 1
      }
    }),
    prisma.category.create({
      data: {
        name: 'Productivity',
        slug: 'productivity',
        description: 'Tools to boost your productivity',
        icon: '⚡',
        color: '#10B981',
        order: 2
      }
    }),
    prisma.category.create({
      data: {
        name: 'Developer Tools',
        slug: 'developer-tools',
        description: 'Tools for developers and engineers',
        icon: '👨‍💻',
        color: '#8B5CF6',
        order: 3
      }
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'Design tools and resources',
        icon: '🎨',
        color: '#EC4899',
        order: 4
      }
    }),
    prisma.category.create({
      data: {
        name: 'Marketing',
        slug: 'marketing',
        description: 'Marketing and growth tools',
        icon: '📈',
        color: '#F59E0B',
        order: 5
      }
    }),
    prisma.category.create({
      data: {
        name: 'E-commerce',
        slug: 'ecommerce',
        description: 'Online store and shopping tools',
        icon: '🛒',
        color: '#EF4444',
        order: 6
      }
    }),
    prisma.category.create({
      data: {
        name: 'Finance',
        slug: 'finance',
        description: 'Financial and accounting tools',
        icon: '💰',
        color: '#059669',
        order: 7
      }
    }),
    prisma.category.create({
      data: {
        name: 'Education',
        slug: 'education',
        description: 'Learning and education platforms',
        icon: '📚',
        color: '#6366F1',
        order: 8
      }
    })
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create sample users
  console.log('Creating sample users...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'maker1@example.com',
        name: 'Alex Johnson',
        role: Role.MAKER,
        bio: 'Building the future of AI',
        website: 'https://example.com',
        twitter: '@alexjohnson'
      }
    }),
    prisma.user.create({
      data: {
        email: 'maker2@example.com',
        name: 'Sarah Chen',
        role: Role.MAKER,
        bio: 'Designer & entrepreneur',
        website: 'https://example.com',
        twitter: '@sarahchen'
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: Role.ADMIN,
        isPremium: true
      }
    })
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create sample products
  console.log('Creating sample products...')
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'AI Content Studio',
        tagline: 'Create stunning content with AI in seconds',
        description: 'AI Content Studio is a revolutionary platform that uses advanced AI to help you create high-quality content for blogs, social media, and marketing campaigns. Features include: AI writing assistant, image generation, content optimization, and multi-language support.',
        website: 'https://aicontentstudio.com',
        categoryId: categories[0].id,
        makerId: users[0].id,
        tags: ['ai', 'content', 'writing', 'marketing'],
        status: ProductStatus.APPROVED,
        featured: true,
        pricingType: PricingType.FREEMIUM,
        region: 'US',
        votesCount: 234,
        launchDate: new Date()
      }
    }),
    prisma.product.create({
      data: {
        name: 'CodeFlow',
        tagline: 'Next-gen code collaboration platform',
        description: 'CodeFlow brings your development team together with real-time collaboration, code reviews, and integrated CI/CD. Built for modern development teams who value speed and quality.',
        website: 'https://codeflow.dev',
        categoryId: categories[2].id,
        makerId: users[0].id,
        tags: ['developer', 'collaboration', 'code-review', 'ci-cd'],
        status: ProductStatus.APPROVED,
        featured: true,
        pricingType: PricingType.SUBSCRIPTION,
        price: 29,
        region: 'CA',
        votesCount: 189,
        launchDate: new Date()
      }
    }),
    prisma.product.create({
      data: {
        name: 'DesignHub',
        tagline: 'All-in-one design toolkit for modern teams',
        description: 'DesignHub combines the best design tools into one powerful platform. Create stunning graphics, edit photos, design websites, and collaborate with your team - all in one place.',
        website: 'https://designhub.io',
        categoryId: categories[3].id,
        makerId: users[1].id,
        tags: ['design', 'graphics', 'collaboration', 'ui-ux'],
        status: ProductStatus.APPROVED,
        pricingType: PricingType.FREEMIUM,
        region: 'US',
        votesCount: 156,
        launchDate: new Date()
      }
    }),
    prisma.product.create({
      data: {
        name: 'TaskMaster Pro',
        tagline: 'Project management for high-performing teams',
        description: 'TaskMaster Pro helps teams stay organized and productive with powerful project management features, time tracking, and team collaboration tools.',
        website: 'https://taskmasterpro.com',
        categoryId: categories[1].id,
        makerId: users[1].id,
        tags: ['productivity', 'project-management', 'tasks', 'team'],
        status: ProductStatus.APPROVED,
        pricingType: PricingType.PAID,
        price: 15,
        region: 'US',
        votesCount: 142,
        launchDate: new Date()
      }
    }),
    prisma.product.create({
      data: {
        name: 'GrowthMetrics',
        tagline: 'Marketing analytics that drive results',
        description: 'GrowthMetrics provides comprehensive marketing analytics, customer insights, and growth tracking for modern businesses. Make data-driven decisions with confidence.',
        website: 'https://growthmetrics.io',
        categoryId: categories[4].id,
        makerId: users[0].id,
        tags: ['marketing', 'analytics', 'growth', 'data'],
        status: ProductStatus.APPROVED,
        pricingType: PricingType.SUBSCRIPTION,
        price: 49,
        region: 'CA',
        votesCount: 98,
        launchDate: new Date()
      }
    })
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create sample event
  console.log('Creating sample events...')
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 14)
  
  const endDate = new Date(futureDate)
  endDate.setHours(endDate.getHours() + 2)

  const event = await prisma.event.create({
    data: {
      title: 'Product Launch Summit 2024',
      description: 'Join us for the biggest product launch event of the year! Meet makers, discover new products, and learn from successful entrepreneurs. This virtual summit features 20+ speakers, product demos, and networking opportunities.',
      startDate: futureDate,
      endDate: endDate,
      virtual: true,
      eventUrl: 'https://summit.producthub.com',
      region: 'US',
      timezone: 'America/New_York',
      products: {
        connect: products.slice(0, 3).map(p => ({ id: p.id }))
      }
    }
  })

  console.log(`✅ Created 1 event`)

  console.log('✨ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
