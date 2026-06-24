import { getSession, getUserId } from '@/app/actions/auth'
import { db } from '@/lib/db'
import { workOrders, contracts, serviceRequests, notifications } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { ClientDashboardClient } from '@/components/client/dashboard-client'

export default async function ClientDashboardPage() {
  const session = await getSession()
  const userId = session!.user.id

  const [myOrders, myContracts, myRequests, myNotifs] = await Promise.all([
    db.select().from(workOrders).where(eq(workOrders.userId, userId)).orderBy(desc(workOrders.createdAt)).limit(5),
    db.select().from(contracts).where(eq(contracts.userId, userId)).orderBy(desc(contracts.createdAt)).limit(3),
    db.select().from(serviceRequests).where(eq(serviceRequests.userId, userId)).orderBy(desc(serviceRequests.createdAt)).limit(3),
    db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(5),
  ])

  return (
    <ClientDashboardClient
      user={session!.user}
      workOrders={myOrders}
      contracts={myContracts}
      serviceRequests={myRequests}
      notifications={myNotifs}
    />
  )
}
