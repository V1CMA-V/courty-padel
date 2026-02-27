import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { APIRoute } from 'astro'

export const prerender = false

async function getClubId(userId: string) {
  const club = await prisma.club.findFirst({
    where: { ownerUserId: userId },
    select: { id: true },
  })
  return club?.id ?? null
}

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const clubId = await getClubId(session.user.id)
  if (!clubId) {
    return new Response(JSON.stringify({ tournaments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const tournaments = await prisma.tournament.findMany({
    where: { clubId },
    include: {
      categories: {
        include: {
          _count: { select: { entries: true } },
        },
      },
    },
    orderBy: { startDate: 'desc' },
  })

  return new Response(JSON.stringify({ tournaments }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const clubId = await getClubId(session.user.id)
  if (!clubId) {
    return new Response(JSON.stringify({ error: 'Primero crea tu club' }), { status: 400 })
  }

  const body = await request.json()

  if (!body.name?.trim()) {
    return new Response(JSON.stringify({ error: 'El nombre es requerido' }), { status: 400 })
  }
  if (!body.startDate) {
    return new Response(JSON.stringify({ error: 'La fecha de inicio es requerida' }), { status: 400 })
  }
  if (!body.categories || body.categories.length === 0) {
    return new Response(JSON.stringify({ error: 'Agrega al menos una categoría' }), { status: 400 })
  }

  const tournament = await prisma.tournament.create({
    data: {
      clubId,
      name: body.name.trim(),
      description: body.description?.trim() || null,
      venueNote: body.venueNote?.trim() || null,
      location: body.location?.trim() || null,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      status: body.status || 'DRAFT',
      visibility: body.visibility || 'PUBLIC',
      categories: {
        create: body.categories.map((cat: Record<string, unknown>) => ({
          name: (cat.name as string).trim(),
          modality: cat.modality || null,
          gender: cat.gender || null,
          level: cat.level || null,
          entryFeeCents: cat.entryFeeCents ? Number(cat.entryFeeCents) : null,
          maxEntries: cat.maxEntries ? Number(cat.maxEntries) : null,
          rules: (cat.rules as string)?.trim() || null,
        })),
      },
    },
    include: {
      categories: true,
    },
  })

  return new Response(JSON.stringify({ tournament }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
