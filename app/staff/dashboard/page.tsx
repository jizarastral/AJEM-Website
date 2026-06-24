import { getSession } from '@/app/actions/auth'
import { getAllWorkOrders } from '@/app/actions/work-orders'
import { StaffDashboardClient } from '@/components/staff/dashboard-client'

export default async function StaffDashboardPage() {
  const session = await getSession()
  const allOrders = await getAllWorkOrders()
  const staffName = session?.user?.name ?? ''
  // Filter work orders assigned to this staff member
  const myOrders = allOrders.filter(o => o.assignedTo === staffName || o.assignedTo === session?.user?.email)
  return <StaffDashboardClient orders={myOrders} user={session!.user} />
}
