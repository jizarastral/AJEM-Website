import { PortalLayout, NavItem } from './portal-layout'
import {
  LayoutDashboard, ClipboardList, Users, FileText,
  MessageSquare, FileCheck, BarChart2
} from 'lucide-react'

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Work Orders', href: '/admin/work-orders', icon: ClipboardList },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Contracts', href: '/admin/contracts', icon: FileCheck },
  { label: 'Quotations', href: '/admin/quotations', icon: FileText },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Staff', href: '/admin/staff', icon: Users },
]

interface Props {
  children: React.ReactNode
  userName: string
  userEmail: string
}

export function AdminPortalLayout({ children, userName, userEmail }: Props) {
  return (
    <PortalLayout role="admin" userName={userName} userEmail={userEmail} navItems={ADMIN_NAV}>
      {children}
    </PortalLayout>
  )
}
