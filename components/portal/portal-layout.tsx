'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'
import {
  LayoutDashboard, ClipboardList, Users, FileText, Bell, Settings,
  LogOut, Menu, X, ChevronRight, Briefcase, MessageSquare, FileCheck,
  Home, Wrench, Send
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface PortalLayoutProps {
  children: React.ReactNode
  role: 'admin' | 'staff' | 'client'
  userName: string
  userEmail: string
  navItems: NavItem[]
}

const ROLE_LABELS = {
  admin: 'Administrator',
  staff: 'Staff',
  client: 'Client',
}

const ROLE_BADGE_CLASSES = {
  admin: 'bg-primary/10 text-primary border-primary/20',
  staff: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  client: 'bg-green-500/10 text-green-600 border-green-500/20',
}

export function PortalLayout({ children, role, userName, userEmail, navItems }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="block">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-8GUzX7yUBYDmcov60x1qAFtnqEoKIV.png"
            alt="AJEM"
            width={130}
            height={52}
            className="object-contain h-9 w-auto brightness-200"
          />
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-sm font-bold">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{userName}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{userEmail}</p>
          </div>
        </div>
        <Badge variant="outline" className={cn('mt-2 text-xs', ROLE_BADGE_CLASSES[role])}>
          {ROLE_LABELS[role]}
        </Badge>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-primary/20 text-primary">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent gap-3"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-20">
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Home className="size-3" />
              <span className="hidden sm:inline">Back to website</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
