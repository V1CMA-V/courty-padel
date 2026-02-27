"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Plus, Trash2 } from "lucide-react"

const categorySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  modality: z.string(),
  gender: z.string(),
  level: z.string(),
  entryFeeCents: z.string(),
  maxEntries: z.string(),
  rules: z.string(),
})

const tournamentSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string(),
  location: z.string(),
  venueNote: z.string(),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string(),
  visibility: z.string(),
  categories: z.array(categorySchema).min(1, "Agrega al menos una categoría"),
})

type TournamentFormValues = z.infer<typeof tournamentSchema>

const defaultCategory = {
  name: "",
  modality: "DOUBLES",
  gender: "OPEN",
  level: "",
  entryFeeCents: "",
  maxEntries: "",
  rules: "",
}

export function TournamentForm() {
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TournamentFormValues>({
    // @ts-expect-error — zodResolver works with Zod v4 at runtime; type overloads mismatch
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      venueNote: "",
      startDate: "",
      endDate: "",
      visibility: "PUBLIC",
      categories: [{ ...defaultCategory }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  })

  const onSubmit = async (values: TournamentFormValues) => {
    setSaving(true)
    try {
      const payload = {
        ...values,
        categories: values.categories.map((cat) => ({
          ...cat,
          entryFeeCents: cat.entryFeeCents ? Number(cat.entryFeeCents) : null,
          maxEntries: cat.maxEntries ? Number(cat.maxEntries) : null,
        })),
      }
      const res = await fetch("/api/my-club/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al crear torneo")
      }
      toast.success("Torneo creado exitosamente")
      window.location.href = "/dashboard/torneos"
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al crear torneo")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Tournament Info */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold">Información del torneo</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="name">Nombre del torneo *</Label>
            <Input id="name" placeholder="Torneo Abierto de Padel" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              placeholder="Describe tu torneo..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" placeholder="Club Padel Centro, CDMX" {...register("location")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueNote">Nota del venue</Label>
            <Input id="venueNote" placeholder="Estacionamiento disponible" {...register("venueNote")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de inicio *</Label>
            <Input id="startDate" type="datetime-local" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Fecha de fin</Label>
            <Input id="endDate" type="datetime-local" {...register("endDate")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidad</Label>
            <select
              id="visibility"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none dark:bg-input/30"
              {...register("visibility")}
            >
              <option value="PUBLIC">Público</option>
              <option value="PRIVATE">Privado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Categorías</h2>
            <p className="text-sm text-muted-foreground">
              Agrega las categorías de tu torneo (ej. Varonil A, Mixto B).
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ ...defaultCategory })}
          >
            <Plus className="size-4 mr-1.5" />
            Agregar
          </Button>
        </div>

        {errors.categories?.root && (
          <p className="text-sm text-destructive">{errors.categories.root.message}</p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-4 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Categoría {index + 1}
                </span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input
                    placeholder="Varonil A"
                    {...register(`categories.${index}.name`)}
                  />
                  {errors.categories?.[index]?.name && (
                    <p className="text-sm text-destructive">
                      {errors.categories[index].name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Modalidad</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none dark:bg-input/30"
                    {...register(`categories.${index}.modality`)}
                  >
                    <option value="">Sin especificar</option>
                    <option value="SINGLES">Singles</option>
                    <option value="DOUBLES">Dobles</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Género</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none dark:bg-input/30"
                    {...register(`categories.${index}.gender`)}
                  >
                    <option value="">Sin especificar</option>
                    <option value="MALE">Varonil</option>
                    <option value="FEMALE">Femenil</option>
                    <option value="MIXED">Mixto</option>
                    <option value="OPEN">Abierto</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Nivel</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none dark:bg-input/30"
                    {...register(`categories.${index}.level`)}
                  >
                    <option value="">Sin especificar</option>
                    <option value="BEGINNER">Principiante</option>
                    <option value="INTERMEDIATE">Intermedio</option>
                    <option value="ADVANCED">Avanzado</option>
                    <option value="PRO">Pro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Costo inscripción (MXN)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    {...register(`categories.${index}.entryFeeCents`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Máx. equipos</Label>
                  <Input
                    type="number"
                    placeholder="16"
                    {...register(`categories.${index}.maxEntries`)}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3 space-y-2">
                  <Label>Reglas</Label>
                  <textarea
                    placeholder="Reglas específicas de esta categoría..."
                    rows={2}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                    {...register(`categories.${index}.rules`)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Crear torneo
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/dashboard/torneos">Cancelar</a>
        </Button>
      </div>
    </form>
  )
}
