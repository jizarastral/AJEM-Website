import { getSession } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { StaffPortalLayout } from '@/components/portal/staff-portal-layout'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  const role = (session.user as { role?: string }).role ?? 'client'
  if (role !== 'staff' && role !== 'admin') redirect('/client/dashboard')
  return <StaffPortalLayout user={session.user}>{children}</StaffPortalLayout>
}
