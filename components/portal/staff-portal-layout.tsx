'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ClipboardList, User, LogOut
} from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staff/jobs', label: 'My Jobs', icon: ClipboardList },
  { href: '/staff/profile', label: 'Profile', icon: User },
]

export function StaffPortalLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: { name: string; email: string }
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-8GUzX7yUBYDmcov60x1qAFtnqEoKIV.png"
            alt="AJEM Logo"
            width={36}
            height={36}
            className="rounded"
          />
          <div>
            <p className="text-xs font-semibold text-sidebar-foreground leading-tight">AJEM</p>
            <p className="text-[10px] text-sidebar-foreground/60">Staff Portal</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-1">
            <Avatar className="size-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
