import { getSession } from '@/app/actions/auth'
import { StaffProfileClient } from '@/components/staff/profile-client'

export default async function StaffProfilePage() {
  const session = await getSession()
  return <StaffProfileClient user={session!.user} />
}
