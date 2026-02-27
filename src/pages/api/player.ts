import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const player = await prisma.player.findUnique({
    where: { userId: session.user.id },
  })

  // Fetch entries this user participates in (via EntryPlayer)
  const entryPlayers = await prisma.entryPlayer.findMany({
    where: { userId: session.user.id },
    include: {
      entry: {
        include: {
          category: {
            include: {
              tournament: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const entries = entryPlayers.map((ep) => ({
    id: ep.entry.id,
    status: ep.entry.status,
    createdAt: ep.entry.createdAt,
    tournament: {
      id: ep.entry.category.tournament.id,
      name: ep.entry.category.tournament.name,
      location: ep.entry.category.tournament.location,
      date: ep.entry.category.tournament.startDate,
      category: ep.entry.category.name,
      status: ep.entry.category.tournament.status,
    },
  }))

  return new Response(
    JSON.stringify({ player: player ? { ...player, entries } : null }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}

export const PUT: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const body = await request.json()

  const data = {
    displayName: body.displayName ?? null,
    nickname: body.nickname ?? null,
    dominantHand: body.dominantHand ?? null,
    preferredSide: body.preferredSide ?? null,
    playStyle: body.playStyle ?? null,
    level: body.level ?? null,
    heightCm: body.heightCm ? parseInt(body.heightCm, 10) : null,
    birthDate: body.birthDate ? new Date(body.birthDate) : null,
    about: body.about ?? null,
  }

  const player = await prisma.player.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      userId: session.user.id,
      ...data,
    },
  })

  return new Response(JSON.stringify({ player }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
