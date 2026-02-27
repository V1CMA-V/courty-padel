import type { APIRoute } from 'astro'
import prisma from '@/lib/prisma'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const search = url.searchParams.get('search')
  const city = url.searchParams.get('city')
  const state = url.searchParams.get('state')

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (city) {
    where.city = { equals: city, mode: 'insensitive' }
  }

  if (state) {
    where.state = { equals: state, mode: 'insensitive' }
  }

  const clubs = await prisma.club.findMany({
    where,
    include: {
      _count: {
        select: { tournaments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return new Response(JSON.stringify({ clubs }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
