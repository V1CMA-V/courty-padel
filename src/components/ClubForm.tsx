'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

const clubSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  phone: z.string(),
  website: z.string(),
})

type ClubFormValues = z.infer<typeof clubSchema>

export function ClubForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ClubFormValues>({
    // @ts-expect-error — zodResolver works with Zod v4 at runtime; type overloads mismatch
    resolver: zodResolver(clubSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      website: '',
    },
  })

  useEffect(() => {
    fetch('/api/my-club')
      .then((res) => res.json())
      .then((data) => {
        if (data.club) {
          reset({
            name: data.club.name ?? '',
            description: data.club.description ?? '',
            address: data.club.address ?? '',
            city: data.club.city ?? '',
            state: data.club.state ?? '',
            country: data.club.country ?? '',
            phone: data.club.phone ?? '',
            website: data.club.website ?? '',
          })
        }
      })
      .catch(() => toast.error('Error al cargar datos del club'))
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (values: ClubFormValues) => {
    setSaving(true)
    try {
      const res = await fetch('/api/my-club', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      reset({
        name: data.club.name ?? '',
        description: data.club.description ?? '',
        address: data.club.address ?? '',
        city: data.club.city ?? '',
        state: data.club.state ?? '',
        country: data.club.country ?? '',
        phone: data.club.phone ?? '',
        website: data.club.website ?? '',
      })
      toast.success('Club actualizado correctamente')
    } catch {
      toast.error('Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="name">Nombre del club *</Label>
          <Input
            id="name"
            placeholder="Club Padel Centro"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <textarea
            id="description"
            placeholder="Describe tu club..."
            rows={3}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
            {...register('description')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            placeholder="Av. Principal #123"
            {...register('address')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            placeholder="Ciudad de México"
            {...register('city')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" placeholder="CDMX" {...register('state')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input id="country" placeholder="México" {...register('country')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+52 55 1234 5678"
            {...register('phone')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Sitio web</Label>
          <Input
            id="website"
            placeholder="https://miclub.com"
            {...register('website')}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving || !isDirty}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Guardar cambios
        </Button>
        {isDirty && (
          <p className="text-sm text-muted-foreground">
            Tienes cambios sin guardar
          </p>
        )}
      </div>
    </form>
  )
}
