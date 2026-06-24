import { db } from '@/lib/db'
import { quotations, clients } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { AdminQuotationsClient } from '@/components/admin/quotations-client'

export default async function AdminQuotationsPage() {
  const rows = await db.select({
    id: quotations.id,
    title: quotations.title,
    description: quotations.description,
    amount: quotations.amount,
    status: quotations.status,
    validUntil: quotations.validUntil,
    createdAt: quotations.createdAt,
    clientName: clients.name,
  })
    .from(quotations)
    .leftJoin(clients, eq(quotations.clientId, clients.id))
    .orderBy(desc(quotations.createdAt))
  return <AdminQuotationsClient quotations={rows} />
}
