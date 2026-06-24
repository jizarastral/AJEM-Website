import { getSession } from '@/app/actions/auth'
import { db } from '@/lib/db'
import { contracts } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { ClientContractsClient } from '@/components/client/contracts-client'

export default async function ClientContractsPage() {
  const session = await getSession()
  const userId = session!.user.id
  const myContracts = await db.select().from(contracts).where(eq(contracts.userId, userId)).orderBy(desc(contracts.createdAt))
  return <ClientContractsClient contracts={myContracts} />
}
