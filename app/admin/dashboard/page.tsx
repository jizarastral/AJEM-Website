import { getAllWorkOrders, getWorkOrderStats } from '@/app/actions/work-orders'
import { getAllClients } from '@/app/actions/clients'
import { getExpiringContracts } from '@/app/actions/contracts'
import { getAllContactMessages } from '@/app/actions/notifications'
import { AdminDashboardClient } from '@/components/admin/dashboard-client'

export default async function AdminDashboardPage() {
  const [orders, stats, clients, expiring, messages] = await Promise.all([
    getAllWorkOrders(),
    getWorkOrderStats(),
    getAllClients(),
    getExpiringContracts(30),
    getAllContactMessages(),
  ])

  return (
    <AdminDashboardClient
      stats={stats}
      recentOrders={orders.slice(0, 8)}
      totalClients={clients.length}
      expiringContracts={expiring}
      unreadMessages={messages.filter((m) => m.status === 'unread').length}
    />
  )
}
