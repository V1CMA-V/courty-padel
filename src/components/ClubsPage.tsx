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
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  ExternalLink,
  Filter,
  Globe,
  Loader2,
  MapPin,
  Phone,
  Search,
  Trophy,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface Club {
  id: string
  name: string
  description: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  phone: string | null
  website: string | null
  imageUrl: string | null
  _count: { tournaments: number }
}

interface Filters {
  search: string
  city: string
  state: string
}

function ClubCard({ club }: { club: Club }) {
  const locationParts = [club.city, club.state, club.country].filter(Boolean)
  const locationStr = locationParts.join(', ')

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30 h-full group">
      {/* Image */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {club.imageUrl ? (
          <img
            src={club.imageUrl}
            alt={club.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/5 to-primary/15">
            <Building2 className="size-10 text-primary/30" />
          </div>
        )}
        {club._count.tournaments > 0 && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              <Trophy className="size-3" />
              {club._count.tournaments} {club._count.tournaments === 1 ? 'torneo' : 'torneos'}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {club.name}
        </CardTitle>
        {club.description && (
          <CardDescription className="line-clamp-2 text-xs">
            {club.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="space-y-1.5 text-xs text-muted-foreground">
          {locationStr && (
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{locationStr}</span>
            </div>
          )}
          {club.address && (
            <div className="flex items-center gap-2">
              <Building2 className="size-3.5 shrink-0" />
              <span className="truncate">{club.address}</span>
            </div>
          )}
          {club.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 shrink-0" />
              <span>{club.phone}</span>
            </div>
          )}
          {club.website && (
            <div className="flex items-center gap-2">
              <Globe className="size-3.5 shrink-0" />
              <a
                href={club.website.startsWith('http') ? club.website : `https://${club.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-primary transition-colors underline underline-offset-2"
              >
                {club.website.replace(/^https?:\/\//, '')}
                <ExternalLink className="inline size-2.5 ml-1" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function FiltersPanel({
  filters,
  onChange,
  onClear,
  cities,
  states,
  isMobile = false,
}: {
  filters: Filters
  onChange: (f: Filters) => void
  onClear: () => void
  cities: string[]
  states: string[]
  isMobile?: boolean
}) {
  const hasFilters = filters.city || filters.state

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
            <FieldLabel>Ciudad</FieldLabel>
            <Input
              value={filters.city}
              onChange={(e) => onChange({ ...filters, city: e.target.value })}
              placeholder="Filtrar por ciudad..."
            />
          </Field>

          <Separator />

          <Field>
            <FieldLabel>Estado</FieldLabel>
            <Input
              value={filters.state}
              onChange={(e) => onChange({ ...filters, state: e.target.value })}
              placeholder="Filtrar por estado..."
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  )
}

export function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    city: '',
    state: '',
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const fetchClubs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.city) params.set('city', filters.city)
      if (filters.state) params.set('state', filters.state)

      const res = await fetch(`/api/clubs?${params.toString()}`)
      const data = await res.json()
      setClubs(data.clubs ?? [])
    } catch {
      setClubs([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const timeout = setTimeout(fetchClubs, 300)
    return () => clearTimeout(timeout)
  }, [fetchClubs])

  const clearFilters = () => {
    setFilters({ search: '', city: '', state: '' })
  }

  const cities = [...new Set(clubs.map((c) => c.city).filter(Boolean))] as string[]
  const states = [...new Set(clubs.map((c) => c.state).filter(Boolean))] as string[]

  const activeFilterCount = [filters.city, filters.state].filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Clubs</h1>
        <p className="text-muted-foreground mt-1">
          Descubre los clubs de padel asociados y sus instalaciones.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Buscar por nombre, ciudad o dirección..."
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
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            cities={cities}
            states={states}
            isMobile
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex gap-6">
        {/* Desktop filters sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            cities={cities}
            states={states}
          />
        </div>

        {/* Clubs grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : clubs.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="mx-auto size-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No se encontraron clubs
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Intenta ajustar tus filtros de búsqueda.
              </p>
              {(filters.search || filters.city || filters.state) && (
                <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {clubs.length} {clubs.length === 1 ? 'club encontrado' : 'clubs encontrados'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {clubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
