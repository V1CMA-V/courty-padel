import { ModeToggle } from '@/components/ModeToggle'
import { NavUser } from '@/components/NavUser'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LogIn, Menu, SplitSquareHorizontalIcon } from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Torneos', href: '/tournaments' },
  { label: 'Clubs', href: '/clubs' },
  { label: 'Comunidad', href: '/community' },
]

interface HeaderProps {
  user?: {
    name: string
    email: string
    image?: string | null
  } | null
  currentPath?: string
}

export function Header({ user, currentPath = '/' }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo / App name */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <SplitSquareHorizontalIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">
            <span className="text-primary">Courty</span> Padel
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                currentPath === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <NavUser user={user} />
          ) : (
            <Button variant="default" size="sm" asChild>
              <a href="/sign-in">
                <LogIn className="size-4" />
                Iniciar sesión
              </a>
            </Button>
          )}
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <span className="text-primary">Courty</span> Padel
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      currentPath === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto border-t px-4 pt-4 pb-4">
                {user ? (
                  <NavUser user={user} variant="mobile" />
                ) : (
                  <Button variant="default" className="w-full" asChild>
                    <a href="/sign-in">
                      <LogIn className="size-4" />
                      Iniciar sesión
                    </a>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
