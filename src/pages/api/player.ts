import type { APIRoute } from 'astro'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const player = await prisma.player.findUnique({
    where: { userId: session.user.id },
    include: {
      enrollments: {
        include: {
          tournament: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return new Response(JSON.stringify({ player }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const PUT: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
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
