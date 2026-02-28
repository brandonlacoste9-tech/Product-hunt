import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Generate a secure API key
function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = `pk_live_${crypto.randomBytes(32).toString('hex')}`
  const hash = crypto.createHash('sha256').update(key).digest('hex')
  const prefix = key.substring(0, 12)
  return { key, hash, prefix }
}

// Hash an existing key for lookup
function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

// POST /api/auth/api-key - Create new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, tier = 'free' } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Validate tier
    const validTiers = ['free', 'starter', 'growth', 'enterprise']
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // Set limits based on tier
    const limits: Record<string, number> = {
      free: 100,
      starter: 5000,
      growth: 50000,
      enterprise: 1000000,
    }

    const { key, hash, prefix } = generateApiKey()

    // Store hashed key
    await prisma.$executeRaw`
      INSERT INTO "ApiKey" (
        id, key_hash, key_prefix, user_id, name, tier, 
        requests_limit, requests_count, requests_reset_at, is_active, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${hash}, ${prefix}, ${userId}, ${name || 'API Key'}, ${tier},
        ${limits[tier]}, 0, NOW() + INTERVAL '1 day', true, NOW(), NOW()
      )
    `

    // Return the plain key (only shown once!)
    return NextResponse.json({
      key, // SAVE THIS - won't be shown again
      prefix,
      tier,
      requestsLimit: limits[tier],
      message: 'Save this API key now. It will not be shown again.',
    }, { status: 201 })
  } catch (error) {
    console.error('API key creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

// GET /api/auth/api-key - List user's API keys (without full keys)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const keys = await prisma.$queryRaw<{
      id: string
      key_prefix: string
      name: string
      tier: string
      requests_limit: number
      requests_count: number
      requests_reset_at: Date
      last_used_at: Date | null
      is_active: boolean
      created_at: Date
    }[]>`
      SELECT 
        id,
        key_prefix,
        name,
        tier,
        requests_limit,
        requests_count,
        requests_reset_at,
        last_used_at,
        is_active,
        created_at
      FROM "ApiKey"
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ keys })
  } catch (error) {
    console.error('API key list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/api-key - Revoke an API key
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!keyId || !userId) {
      return NextResponse.json(
        { error: 'Key ID and User ID required' },
        { status: 400 }
      )
    }

    await prisma.$executeRaw`
      UPDATE "ApiKey" 
      SET is_active = false, updated_at = NOW()
      WHERE id = ${keyId} AND user_id = ${userId}
    `

    return NextResponse.json({ message: 'API key revoked successfully' })
  } catch (error) {
    console.error('API key revocation error:', error)
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    )
  }
}

// Helper function to validate API key (used by other routes)
export async function validateApiKey(key: string): Promise<{
  valid: boolean
  keyId?: string
  tier?: string
  limit?: number
  error?: string
}> {
  try {
    const hash = hashKey(key)
    
    const result = await prisma.$queryRaw<{
      id: string
      tier: string
      requests_limit: number
      requests_count: number
      requests_reset_at: Date
      is_active: boolean
    }[]>`
      SELECT id, tier, requests_limit, requests_count, requests_reset_at, is_active
      FROM "ApiKey"
      WHERE key_hash = ${hash}
      LIMIT 1
    `

    if (result.length === 0) {
      return { valid: false, error: 'Invalid API key' }
    }

    const keyData = result[0]

    if (!keyData.is_active) {
      return { valid: false, error: 'API key revoked' }
    }

    // Check rate limit
    const canProceed = await prisma.$queryRaw<[{ can_proceed: boolean }]>`
      SELECT check_rate_limit(${keyData.id}, ${keyData.requests_limit}) as can_proceed
    `

    if (!canProceed[0].can_proceed) {
      return { valid: false, error: 'Rate limit exceeded. Resets daily.' }
    }

    return {
      valid: true,
      keyId: keyData.id,
      tier: keyData.tier,
      limit: keyData.requests_limit,
    }
  } catch (error) {
    console.error('API key validation error:', error)
    return { valid: false, error: 'Validation failed' }
  }
}
