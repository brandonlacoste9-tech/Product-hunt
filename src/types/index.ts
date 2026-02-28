export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  website: string
  logo?: string | null
  thumbnail?: string | null
  images: string[]
  categoryId: string
  tags: string[]
  locale: string
  status: ProductStatus
  featured: boolean
  sponsored: boolean
  launchDate: Date
  region?: string | null
  city?: string | null
  twitterUrl?: string | null
  facebookUrl?: string | null
  linkedinUrl?: string | null
  pricingType: PricingType
  price?: number | null
  votesCount: number
  commentsCount: number
  viewsCount: number
  makerId: string
  createdAt: Date
  updatedAt: Date
}

export enum ProductStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}

export enum PricingType {
  FREE = 'FREE',
  FREEMIUM = 'FREEMIUM',
  PAID = 'PAID',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ONE_TIME = 'ONE_TIME'
}

export enum Role {
  USER = 'USER',
  MAKER = 'MAKER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string
  name?: string | null
  email: string
  emailVerified?: Date | null
  image?: string | null
  bio?: string | null
  website?: string | null
  twitter?: string | null
  linkedin?: string | null
  role: Role
  isPremium: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  color?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string | null
  virtual: boolean
  eventUrl?: string | null
  region?: string | null
  city?: string | null
  timezone?: string | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SearchParams {
  query?: string
  category?: string
  region?: string
  pricingType?: PricingType
  status?: ProductStatus
  page?: number
  limit?: number
  orderBy?: 'votes' | 'date' | 'name'
  order?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
}
