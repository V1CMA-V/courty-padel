import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Loader2, Save, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PlayerData {
  displayName: string
  nickname: string
  dominantHand: string
  preferredSide: string
  playStyle: string
  level: string
  heightCm: string
  birthDate: string
  about: string
}

interface Enrollment {
  id: string
  status: string
  createdAt: string
  tournament: {
    id: string
    name: string
    location: string | null
    date: string
    category: string | null
    status: string
  }
}

interface Props {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

const emptyPlayer: PlayerData = {
  displayName: '',
  nickname: '',
  dominantHand: '',
  preferredSide: '',
  playStyle: '',
  level: '',
  heightCm: '',
  birthDate: '',
  about: '',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    CONFIRMED: {
      bg: 'bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      label: 'Confirmado',
    },
    PENDING: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-600 dark:text-yellow-400',
      label: 'Pendiente',
    },
    CANCELLED: {
      bg: 'bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
      label: 'Cancelado',
    },
    OPEN: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      label: 'Abierto',
    },
    IN_PROGRESS: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      label: 'En curso',
    },
    FINISHED: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      label: 'Finalizado',
    },
  }
  const s = map[status] ?? {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    label: status,
  }
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  )
}

export function PlayerProfileForm({ user }: Props) {
  const [form, setForm] = useState<PlayerData>(emptyPlayer)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/player')
      .then((res) => res.json())
      .then((data) => {
        if (data.player) {
          const p = data.player
          setForm({
            displayName: p.displayName ?? '',
            nickname: p.nickname ?? '',
            dominantHand: p.dominantHand ?? '',
            preferredSide: p.preferredSide ?? '',
            playStyle: p.playStyle ?? '',
            level: p.level ?? '',
            heightCm: p.heightCm?.toString() ?? '',
            birthDate: p.birthDate ? p.birthDate.split('T')[0] : '',
            about: p.about ?? '',
          })
          setEnrollments(p.enrollments ?? [])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/player', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Perfil guardado correctamente.' })
      } else {
        setMessage({ type: 'error', text: 'Error al guardar el perfil.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const update = (key: keyof PlayerData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Info Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-xl">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="rounded-xl text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Jugador</CardTitle>
          <CardDescription>
            Configura tu información deportiva visible para otros jugadores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Nombre deportivo</FieldLabel>
              <Input
                value={form.displayName}
                onChange={(e) => update('displayName')(e.target.value)}
                placeholder="Ej: Juan 'El Muro' Pérez"
              />
            </Field>
            <Field>
              <FieldLabel>Apodo</FieldLabel>
              <Input
                value={form.nickname}
                onChange={(e) => update('nickname')(e.target.value)}
                placeholder="Ej: El Muro"
              />
            </Field>
          </div>

          <Separator />

          {/* Playing style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Mano dominante</FieldLabel>
              <Select
                value={form.dominantHand}
                onValueChange={update('dominantHand')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="RIGHT">Derecha</SelectItem>
                    <SelectItem value="LEFT">Izquierda</SelectItem>
                    <SelectItem value="BOTH">Ambas</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Lado preferido</FieldLabel>
              <Select
                value={form.preferredSide}
                onValueChange={update('preferredSide')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="RIGHT">Derecha</SelectItem>
                    <SelectItem value="LEFT">Revés</SelectItem>
                    <SelectItem value="BOTH">Ambos</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Estilo de juego</FieldLabel>
              <Select
                value={form.playStyle}
                onValueChange={update('playStyle')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="AGGRESSIVE">Agresivo</SelectItem>
                    <SelectItem value="DEFENSIVE">Defensivo</SelectItem>
                    <SelectItem value="BALANCED">Equilibrado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Nivel</FieldLabel>
              <Select value={form.level} onValueChange={update('level')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="BEGINNER">Principiante</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                    <SelectItem value="ADVANCED">Avanzado</SelectItem>
                    <SelectItem value="PRO">Profesional</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Altura (cm)</FieldLabel>
              <Input
                type="number"
                value={form.heightCm}
                onChange={(e) => update('heightCm')(e.target.value)}
                placeholder="175"
              />
            </Field>
            <Field>
              <FieldLabel>Fecha de nacimiento</FieldLabel>
              <Input
                type="date"
                value={form.birthDate}
                onChange={(e) => update('birthDate')(e.target.value)}
              />
            </Field>
          </div>

          <Separator />

          {/* Bio */}
          <Field>
            <FieldLabel>Acerca de mí</FieldLabel>
            <textarea
              value={form.about}
              onChange={(e) => update('about')(e.target.value)}
              rows={3}
              placeholder="Cuéntanos sobre tu experiencia en el padel..."
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 resize-none"
            />
          </Field>

          {/* Save */}
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Guardar cambios
            </Button>
            {message && (
              <p
                className={`text-sm font-medium ${
                  message.type === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tournament Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            Mis Torneos
          </CardTitle>
          <CardDescription>
            Torneos en los que estás inscrito actualmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto size-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                No estás inscrito en ningún torneo aún.
              </p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <a href="/#torneos">Explorar torneos</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {enrollment.tournament.name}
                      </h4>
                      {statusBadge(enrollment.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {enrollment.tournament.location && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {enrollment.tournament.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(enrollment.tournament.date)}
                      </span>
                      {enrollment.tournament.category && (
                        <span>{enrollment.tournament.category}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(enrollment.tournament.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
