import { getAllWorkOrders } from '@/app/actions/work-orders'
import { getAllClients } from '@/app/actions/clients'
import { WorkOrdersClient } from '@/components/admin/work-orders-client'

export default async function AdminWorkOrdersPage() {
  const [orders, clients] = await Promise.all([getAllWorkOrders(), getAllClients()])
  return <WorkOrdersClient orders={orders} clients={clients} />
}
