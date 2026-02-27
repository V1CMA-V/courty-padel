import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'
import { Bell, CreditCard, EllipsisVertical, LogOut, User } from 'lucide-react'

interface NavUserProps {
  user: {
    name: string
    email: string
    image?: string | null
  }
  variant?: 'header' | 'mobile'
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function NavUser({ user, variant = 'header' }: NavUserProps) {
  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = '/'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 rounded-lg p-1.5 text-left text-sm transition-colors hover:bg-accent outline-none ${
            variant === 'mobile' ? 'w-full' : ''
          }`}
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <EllipsisVertical className="ml-auto size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        side={variant === 'mobile' ? 'top' : 'bottom'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a href="/user">
              <User />
              Cuenta
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/user/facturazion">
              <CreditCard />
              Facturación
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/user/notification">
              <Bell />
              Notificaciones
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
