import { getSession } from '@/app/actions/auth'
import { getAllWorkOrders } from '@/app/actions/work-orders'
import { StaffJobsClient } from '@/components/staff/jobs-client'

export default async function StaffJobsPage() {
  const session = await getSession()
  const allOrders = await getAllWorkOrders()
  const staffName = session?.user?.name ?? ''
  const myOrders = allOrders.filter(o => o.assignedTo === staffName || o.assignedTo === session?.user?.email)
  return <StaffJobsClient orders={myOrders} />
}
