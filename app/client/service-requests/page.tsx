import { getSession } from '@/app/actions/auth'
import { getMyServiceRequests } from '@/app/actions/service-requests'
import { ClientServiceRequestsClient } from '@/components/client/service-requests-client'

export default async function ClientServiceRequestsPage() {
  const session = await getSession()
  const requests = await getMyServiceRequests()
  return <ClientServiceRequestsClient requests={requests} user={session!.user} />
}
