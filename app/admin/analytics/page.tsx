import { getWorkOrderStats } from '@/app/actions/work-orders'
import { getAllContracts } from '@/app/actions/contracts'
import { getAllClients } from '@/app/actions/clients'
import { AdminAnalyticsClient } from '@/components/admin/analytics-client'

export default async function AdminAnalyticsPage() {
  const [stats, contracts, clients] = await Promise.all([
    getWorkOrderStats(),
    getAllContracts(),
    getAllClients(),
  ])
  return <AdminAnalyticsClient stats={stats} contracts={contracts} clients={clients} />
}
