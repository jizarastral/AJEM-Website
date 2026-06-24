import { getSession } from '@/app/actions/auth'
import { db } from '@/lib/db'
import { workOrders } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { ClientWorkOrdersClient } from '@/components/client/work-orders-client'

export default async function ClientWorkOrdersPage() {
  const session = await getSession()
  const userId = session!.user.id
  const orders = await db.select().from(workOrders).where(eq(workOrders.userId, userId)).orderBy(desc(workOrders.createdAt))
  return <ClientWorkOrdersClient orders={orders} />
}
