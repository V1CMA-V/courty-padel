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
import {
  Calendar,
  Filter,
  Loader2,
  MapPin,
  Search,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface TournamentCategory {
  id: string
  name: string
  modality: string | null
  gender: string | null
  level: string | null
  entryFeeCents: number | null
  maxEntries: number | null
}

interface Tournament {
  id: string
  name: string
  description: string | null
  venueNote: string | null
  location: string | null
  imageUrl: string | null
  startDate: string
  endDate: string | null
  status: string
  visibility: string
  categories: TournamentCategory[]
  _count: { enrollments: number }
}

interface Filters {
  search: string
  status: string
  modality: string
  gender: string
}

const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Borrador' },
  REGISTRATION_OPEN: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', label: 'Inscripción abierta' },
  REGISTRATION_CLOSED: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', label: 'Inscripción cerrada' },
  IN_PROGRESS: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', label: 'En curso' },
  FINISHED: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Finalizado' },
  CANCELLED: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', label: 'Cancelado' },
}

const MODALITY_MAP: Record<string, string> = {
  SINGLES: 'Individual',
  DOUBLES: 'Dobles',
}

const GENDER_MAP: Record<string, string> = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  MIXED: 'Mixto',
  OPEN: 'Abierto',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateRange(start: string, end: string | null) {
  if (!end) return formatDate(start)
  const s = new Date(start)
  const e = new Date(end)
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} - ${e.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }
  return `${formatDate(start)} - ${formatDate(end)}`
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(cents / 100)
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { bg: 'bg-muted', text: 'text-muted-foreground', label: status }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      {label}
    </span>
  )
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const minFee = tournament.categories
    .map((c) => c.entryFeeCents)
    .filter((f): f is number => f !== null)
  const lowestFee = minFee.length > 0 ? Math.min(...minFee) : null

  return (
    <a href={`/tournaments/${tournament.id}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30 h-full">
        {/* Image */}
        <div className="relative h-40 bg-muted overflow-hidden">
          {tournament.imageUrl ? (
            <img
              src={tournament.imageUrl}
              alt={tournament.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/5 to-primary/15">
              <Trophy className="size-10 text-primary/30" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <StatusBadge status={tournament.status} />
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {tournament.name}
          </CardTitle>
          {tournament.description && (
            <CardDescription className="line-clamp-2 text-xs">
              {tournament.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Info rows */}
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 shrink-0" />
              <span>{formatDateRange(tournament.startDate, tournament.endDate)}</span>
            </div>
            {tournament.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{tournament.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="size-3.5 shrink-0" />
              <span>{tournament._count.enrollments} inscritos</span>
            </div>
          </div>

          {/* Categories */}
          {tournament.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tournament.categories.slice(0, 3).map((cat) => (
                <CategoryBadge key={cat.id} label={cat.name} />
              ))}
              {tournament.categories.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{tournament.categories.length - 3} más
                </span>
              )}
            </div>
          )}

          {/* Price */}
          {lowestFee !== null && (
            <div className="pt-1 border-t">
              <span className="text-sm font-semibold text-foreground">
                Desde {formatPrice(lowestFee)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  )
}

function FiltersPanel({
  filters,
  onChange,
  onClear,
  isMobile = false,
}: {
  filters: Filters
  onChange: (f: Filters) => void
  onClear: () => void
  isMobile?: boolean
}) {
  const hasFilters = filters.status || filters.modality || filters.gender

  return (
    <div className={isMobile ? '' : 'sticky top-24'}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="size-4" />
              Filtros
            </CardTitle>
            {hasFilters && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClear}>
                <X className="size-3" />
                Limpiar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Estado</FieldLabel>
            <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="REGISTRATION_OPEN">Inscripción abierta</SelectItem>
                  <SelectItem value="REGISTRATION_CLOSED">Inscripción cerrada</SelectItem>
                  <SelectItem value="IN_PROGRESS">En curso</SelectItem>
                  <SelectItem value="FINISHED">Finalizado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Separator />

          <Field>
            <FieldLabel>Modalidad</FieldLabel>
            <Select value={filters.modality} onValueChange={(v) => onChange({ ...filters, modality: v })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="SINGLES">Individual</SelectItem>
                  <SelectItem value="DOUBLES">Dobles</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Separator />

          <Field>
            <FieldLabel>Género</FieldLabel>
            <Select value={filters.gender} onValueChange={(v) => onChange({ ...filters, gender: v })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="MALE">Masculino</SelectItem>
                  <SelectItem value="FEMALE">Femenino</SelectItem>
                  <SelectItem value="MIXED">Mixto</SelectItem>
                  <SelectItem value="OPEN">Abierto</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>
    </div>
  )
}

export function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    modality: '',
    gender: '',
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const fetchTournaments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.status) params.set('status', filters.status)
      if (filters.modality) params.set('modality', filters.modality)
      if (filters.gender) params.set('gender', filters.gender)

      const res = await fetch(`/api/tournaments?${params.toString()}`)
      const data = await res.json()
      setTournaments(data.tournaments ?? [])
    } catch {
      setTournaments([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const timeout = setTimeout(fetchTournaments, 300)
    return () => clearTimeout(timeout)
  }, [fetchTournaments])

  const clearFilters = () => {
    setFilters({ search: '', status: '', modality: '', gender: '' })
  }

  const activeFilterCount = [filters.status, filters.modality, filters.gender].filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Torneos</h1>
        <p className="text-muted-foreground mt-1">
          Explora y participa en los torneos de padel disponibles.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Buscar por nombre o ubicación..."
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setShowMobileFilters((v) => !v)}
        >
          <Filter className="size-4" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile filters */}
      {showMobileFilters && (
        <div className="md:hidden mb-6">
          <FiltersPanel filters={filters} onChange={setFilters} onClear={clearFilters} isMobile />
        </div>
      )}

      {/* Main content */}
      <div className="flex gap-6">
        {/* Desktop filters sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <FiltersPanel filters={filters} onChange={setFilters} onClear={clearFilters} />
        </div>

        {/* Tournament grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="mx-auto size-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No se encontraron torneos
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Intenta ajustar tus filtros de búsqueda.
              </p>
              {(filters.search || filters.status || filters.modality || filters.gender) && (
                <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {tournaments.length} {tournaments.length === 1 ? 'torneo encontrado' : 'torneos encontrados'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {tournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
