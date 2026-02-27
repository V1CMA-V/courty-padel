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

  const club = await prisma.club.findFirst({
    where: { ownerUserId: session.user.id },
  })

  return new Response(JSON.stringify({ club }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
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
    name: body.name,
    description: body.description ?? null,
    address: body.address ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    country: body.country ?? null,
    phone: body.phone ?? null,
    website: body.website ?? null,
  }

  const existing = await prisma.club.findFirst({
    where: { ownerUserId: session.user.id },
  })

  let club
  if (existing) {
    club = await prisma.club.update({
      where: { id: existing.id },
      data,
    })
  } else {
    club = await prisma.club.create({
      data: {
        ownerUserId: session.user.id,
        ...data,
      },
    })
  }

  return new Response(JSON.stringify({ club }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
