import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const session = await getSession()
  if (session?.user) {
    const role = (session.user as { role?: string }).role ?? 'client'
    if (role === 'admin') redirect('/admin/dashboard')
    else if (role === 'staff') redirect('/staff/dashboard')
    else redirect('/client/dashboard')
  }
  return <AuthForm mode="sign-in" />
}
