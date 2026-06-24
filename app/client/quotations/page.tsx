import { getSession } from '@/app/actions/auth'
import { db } from '@/lib/db'
import { quotations } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { ClientQuotationsClient } from '@/components/client/quotations-client'

export default async function ClientQuotationsPage() {
  const session = await getSession()
  const userId = session!.user.id
  const myQuotations = await db.select().from(quotations).where(eq(quotations.userId, userId)).orderBy(desc(quotations.createdAt))
  return <ClientQuotationsClient quotations={myQuotations} />
}
