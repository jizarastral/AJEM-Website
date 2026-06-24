import { getAllClients } from '@/app/actions/clients'
import { AdminClientsClient } from '@/components/admin/clients-client'

export default async function AdminClientsPage() {
  const clients = await getAllClients()
  return <AdminClientsClient clients={clients} />
}
