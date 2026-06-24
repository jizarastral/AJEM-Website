import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { AdminPortalLayout } from '@/components/portal/admin-portal-layout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  const role = (session.user as { role?: string }).role ?? 'client'
  if (role !== 'admin') redirect('/client/dashboard')

  return (
    <AdminPortalLayout
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </AdminPortalLayout>
  )
}
