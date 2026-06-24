import { getSession } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { PublicHomepage } from '@/components/public/homepage'

export default async function RootPage() {
  const session = await getSession()
  if (session?.user) {
    const role = (session.user as { role?: string }).role ?? 'client'
    if (role === 'admin') redirect('/admin/dashboard')
    else if (role === 'staff') redirect('/staff/dashboard')
    else redirect('/client/dashboard')
  }
  return <PublicHomepage />
}
