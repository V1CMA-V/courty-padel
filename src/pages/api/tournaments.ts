import type { APIRoute } from 'astro'
import prisma from '@/lib/prisma'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const status = url.searchParams.get('status')
  const modality = url.searchParams.get('modality')
  const gender = url.searchParams.get('gender')
  const search = url.searchParams.get('search')

  const where: Record<string, unknown> = {
    visibility: 'PUBLIC',
  }

  if (status) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (modality || gender) {
    where.categories = {
      some: {
        ...(modality ? { modality } : {}),
        ...(gender ? { gender } : {}),
      },
    }
  }

  const tournaments = await prisma.tournament.findMany({
    where,
    include: {
      categories: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { startDate: 'asc' },
  })

  return new Response(JSON.stringify({ tournaments }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
