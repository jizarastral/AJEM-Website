import { getSession } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { ClientPortalLayout } from '@/components/portal/client-portal-layout'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  return <ClientPortalLayout user={session.user}>{children}</ClientPortalLayout>
}
