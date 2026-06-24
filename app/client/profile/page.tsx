import { getSession } from '@/app/actions/auth'
import { ClientProfileClient } from '@/components/client/profile-client'

export default async function ClientProfilePage() {
  const session = await getSession()
  return <ClientProfileClient user={session!.user} />
}
