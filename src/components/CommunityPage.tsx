import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Crown,
  Flame,
  Medal,
  MessageCircle,
  Search,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'

// -- Static data (replace with API calls when backend is ready) --

const LEADERBOARD = [
  {
    rank: 1,
    name: 'Carlos Mendoza',
    wins: 42,
    losses: 6,
    points: 2850,
    avatar: null,
  },
  {
    rank: 2,
    name: 'Ana García',
    wins: 38,
    losses: 8,
    points: 2720,
    avatar: null,
  },
  {
    rank: 3,
    name: 'Roberto Díaz',
    wins: 35,
    losses: 10,
    points: 2610,
    avatar: null,
  },
  {
    rank: 4,
    name: 'María López',
    wins: 33,
    losses: 11,
    points: 2480,
    avatar: null,
  },
  {
    rank: 5,
    name: 'Javier Torres',
    wins: 30,
    losses: 12,
    points: 2350,
    avatar: null,
  },
  {
    rank: 6,
    name: 'Sofía Hernández',
    wins: 28,
    losses: 13,
    points: 2240,
    avatar: null,
  },
  {
    rank: 7,
    name: 'Diego Ramírez',
    wins: 27,
    losses: 14,
    points: 2180,
    avatar: null,
  },
  {
    rank: 8,
    name: 'Laura Martínez',
    wins: 25,
    losses: 15,
    points: 2050,
    avatar: null,
  },
]

const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'result',
    player: 'Carlos Mendoza',
    action: 'ganó la final del Torneo Primavera 2026',
    time: 'Hace 2 horas',
  },
  {
    id: '2',
    type: 'enrollment',
    player: 'Ana García',
    action: 'se inscribió al Torneo Verano Open',
    time: 'Hace 5 horas',
  },
  {
    id: '3',
    type: 'result',
    player: 'Roberto Díaz',
    action: 'alcanzó las semifinales del Copa Nacional',
    time: 'Hace 1 día',
  },
  {
    id: '4',
    type: 'enrollment',
    player: 'María López',
    action: 'se inscribió al Torneo Nocturno Express',
    time: 'Hace 1 día',
  },
  {
    id: '5',
    type: 'result',
    player: 'Javier Torres',
    action: 'ganó su partido de cuartos de final',
    time: 'Hace 2 días',
  },
  {
    id: '6',
    type: 'enrollment',
    player: 'Sofía Hernández',
    action: 'se inscribió al Torneo Mixto Dobles',
    time: 'Hace 3 días',
  },
]

const COMMUNITY_STATS = [
  { label: 'Jugadores activos', value: '2,450+', icon: Users },
  { label: 'Partidos jugados', value: '8,320', icon: Swords },
  { label: 'Torneos celebrados', value: '156', icon: Trophy },
  { label: 'Puntos repartidos', value: '1.2M', icon: Zap },
]

const FEATURED_PLAYERS = [
  {
    name: 'Carlos Mendoza',
    title: 'Jugador del mes',
    stat: '42 victorias',
    avatar: null,
  },
  {
    name: 'Ana García',
    title: 'Racha más larga',
    stat: '12 victorias seguidas',
    avatar: null,
  },
  {
    name: 'Roberto Díaz',
    title: 'Más torneos jugados',
    stat: '24 torneos',
    avatar: null,
  },
]

// -- Helper components --

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="flex items-center justify-center size-8 rounded-full bg-yellow-500/15">
        <Crown className="size-4 text-yellow-500" />
      </div>
    )
  if (rank === 2)
    return (
      <div className="flex items-center justify-center size-8 rounded-full bg-slate-400/15">
        <Medal className="size-4 text-slate-400" />
      </div>
    )
  if (rank === 3)
    return (
      <div className="flex items-center justify-center size-8 rounded-full bg-amber-600/15">
        <Medal className="size-4 text-amber-600" />
      </div>
    )
  return (
    <div className="flex items-center justify-center size-8 rounded-full bg-muted">
      <span className="text-xs font-bold text-muted-foreground">{rank}</span>
    </div>
  )
}

function ActivityIcon({ type }: { type: string }) {
  if (type === 'result')
    return (
      <div className="flex items-center justify-center size-8 rounded-full bg-green-500/10">
        <Trophy className="size-4 text-green-600 dark:text-green-400" />
      </div>
    )
  return (
    <div className="flex items-center justify-center size-8 rounded-full bg-blue-500/10">
      <Target className="size-4 text-blue-600 dark:text-blue-400" />
    </div>
  )
}

// -- Main page component --

export function CommunityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_60%)] opacity-[0.04]" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Flame className="size-4" />
            Comunidad Courty Padel
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Conecta, compite y <span className="text-primary">crece</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Únete a la comunidad de jugadores de padel más activa. Revisa
            rankings, sigue la actividad y encuentra compañeros de juego.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {COMMUNITY_STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 shrink-0">
                  <stat.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard — takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="size-5 text-primary" />
                      Ranking General
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Los mejores jugadores de la temporada actual
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {/* Table header */}
                  <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem_5rem] sm:grid-cols-[2.5rem_1fr_5rem_5rem_6rem] items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground">
                    <span>#</span>
                    <span>Jugador</span>
                    <span className="text-right">V</span>
                    <span className="text-right">D</span>
                    <span className="text-right">Pts</span>
                  </div>
                  <Separator />
                  {LEADERBOARD.map((player) => (
                    <div
                      key={player.rank}
                      className="grid grid-cols-[2.5rem_1fr_4rem_4rem_5rem] sm:grid-cols-[2.5rem_1fr_5rem_5rem_6rem] items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <RankBadge rank={player.rank} />
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="size-8 shrink-0">
                          <AvatarImage src={player.avatar ?? undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(player.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">
                          {player.name}
                        </span>
                      </div>
                      <span className="text-sm text-right text-green-600 dark:text-green-400 font-medium">
                        {player.wins}
                      </span>
                      <span className="text-sm text-right text-red-500 dark:text-red-400">
                        {player.losses}
                      </span>
                      <span className="text-sm text-right font-bold text-foreground">
                        {player.points.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-5 text-primary" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>
                  Lo último que está pasando en la comunidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RECENT_ACTIVITY.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <ActivityIcon type={activity.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">
                            {activity.player}
                          </span>{' '}
                          <span className="text-muted-foreground">
                            {activity.action}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured players */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Crown className="size-4 text-yellow-500" />
                  Jugadores Destacados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {FEATURED_PLAYERS.map((player) => (
                  <div key={player.name} className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={player.avatar ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(player.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {player.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {player.title}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-primary whitespace-nowrap">
                      {player.stat}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Find a partner CTA */}
            <Card className="border-primary/20 bg-primary/3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Search className="size-4 text-primary" />
                  Encuentra Compañero
                </CardTitle>
                <CardDescription>
                  Busca jugadores de tu nivel para hacer pareja en torneos de
                  dobles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <a href="/sign-in">
                    <Users className="size-4" />
                    Buscar jugadores
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Community rules / tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="size-4 text-primary" />
                  Normas de la Comunidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                    Respeta a todos los jugadores, sin importar su nivel.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                    Sé puntual a tus partidos y torneos.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                    Reporta cualquier conducta inapropiada.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                    Diviértete y fomenta el juego limpio.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
