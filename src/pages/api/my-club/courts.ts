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
    return new Response(JSON.stringify({ courts: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const courts = await prisma.court.findMany({
    where: { clubId },
    orderBy: { createdAt: 'asc' },
  })

  return new Response(JSON.stringify({ courts }), {
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

  const court = await prisma.court.create({
    data: {
      clubId,
      name: body.name.trim(),
      isActive: body.isActive ?? true,
    },
  })

  return new Response(JSON.stringify({ court }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const PUT: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const clubId = await getClubId(session.user.id)
  if (!clubId) {
    return new Response(JSON.stringify({ error: 'Club no encontrado' }), { status: 400 })
  }

  const body = await request.json()
  if (!body.id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 })
  }

  const existing = await prisma.court.findFirst({
    where: { id: body.id, clubId },
  })
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Cancha no encontrada' }), { status: 404 })
  }

  const court = await prisma.court.update({
    where: { id: body.id },
    data: {
      name: body.name?.trim() || existing.name,
      isActive: body.isActive ?? existing.isActive,
    },
  })

  return new Response(JSON.stringify({ court }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const DELETE: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const clubId = await getClubId(session.user.id)
  if (!clubId) {
    return new Response(JSON.stringify({ error: 'Club no encontrado' }), { status: 400 })
  }

  const body = await request.json()
  if (!body.id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 })
  }

  const existing = await prisma.court.findFirst({
    where: { id: body.id, clubId },
  })
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Cancha no encontrada' }), { status: 404 })
  }

  await prisma.court.delete({ where: { id: body.id } })

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
