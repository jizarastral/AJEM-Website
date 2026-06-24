import { getAllContracts } from '@/app/actions/contracts'
import { AdminContractsClient } from '@/components/admin/contracts-client'

export default async function AdminContractsPage() {
  const contracts = await getAllContracts()
  return <AdminContractsClient contracts={contracts} />
}
