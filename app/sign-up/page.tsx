import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { AuthForm } from '@/components/auth-form'

export default async function SignUpPage() {
  const session = await getSession()
  if (session?.user) redirect('/client/dashboard')
  return <AuthForm mode="sign-up" />
}
