"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, Calendar, MapPin, Users, Eye, EyeOff } from "lucide-react"

interface Category {
  id: string
  name: string
  modality: string | null
  gender: string | null
  _count: { entries: number }
}

interface Tournament {
  id: string
  name: string
  description: string | null
  location: string | null
  startDate: string
  endDate: string | null
  status: string
  visibility: string
  categories: Category[]
}

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  DRAFT: { label: "Borrador", class: "bg-muted text-muted-foreground" },
  REGISTRATION_OPEN: { label: "Inscripciones abiertas", class: "bg-green-500/15 text-green-700 dark:text-green-400" },
  REGISTRATION_CLOSED: { label: "Inscripciones cerradas", class: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  IN_PROGRESS: { label: "En curso", class: "bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  FINISHED: { label: "Finalizado", class: "bg-muted text-muted-foreground" },
  CANCELLED: { label: "Cancelado", class: "bg-destructive/15 text-destructive" },
}

export function TournamentsList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/my-club/tournaments")
      .then((res) => res.json())
      .then((data) => setTournaments(data.tournaments ?? []))
      .catch(() => toast.error("Error al cargar torneos"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed bg-card p-16">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No tienes torneos todavía</p>
          <p className="mt-1 text-sm text-muted-foreground">Crea tu primer torneo para comenzar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tournaments.map((t) => {
        const status = STATUS_MAP[t.status] ?? STATUS_MAP.DRAFT
        const totalEntries = t.categories.reduce((sum, c) => sum + c._count.entries, 0)
        const date = new Date(t.startDate)

        return (
          <div
            key={t.id}
            className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight line-clamp-2">{t.name}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.class}`}>
                  {status.label}
                </span>
              </div>

              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>
                    {date.toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {t.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    <span className="truncate">{t.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  <span>{totalEntries} inscripciones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {t.visibility === "PUBLIC" ? (
                    <Eye className="size-3.5" />
                  ) : (
                    <EyeOff className="size-3.5" />
                  )}
                  <span>{t.visibility === "PUBLIC" ? "Público" : "Privado"}</span>
                </div>
              </div>

              {t.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
