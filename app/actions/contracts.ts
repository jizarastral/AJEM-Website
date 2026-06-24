'use server'

import { db } from '@/lib/db'
import { contracts, clients } from '@/lib/db/schema'
import { eq, desc, and, lte, gte, sql, count } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId } from './auth'

export async function getAllContracts() {
  return db.select({
    id: contracts.id,
    title: contracts.title,
    type: contracts.type,
    status: contracts.status,
    startDate: contracts.startDate,
    endDate: contracts.endDate,
    value: contracts.value,
    autoRenew: contracts.autoRenew,
    userId: contracts.userId,
    clientId: contracts.clientId,
    createdAt: contracts.createdAt,
    clientName: clients.name,
  })
    .from(contracts)
    .leftJoin(clients, eq(contracts.clientId, clients.id))
    .orderBy(desc(contracts.createdAt))
}

export async function getClientContracts(userId: string) {
  return db.select().from(contracts).where(eq(contracts.userId, userId)).orderBy(desc(contracts.createdAt))
}

export async function createContract(data: {
  title: string
  type: string
  clientId?: number
  startDate?: Date
  endDate?: Date
  value?: number
  terms?: string
  autoRenew?: boolean
}) {
  const userId = await getUserId()
  const [contract] = await db.insert(contracts).values({ ...data, userId, status: 'active' }).returning()
  revalidatePath('/admin/contracts')
  return contract
}

export async function updateContract(id: number, data: Partial<typeof contracts.$inferInsert>) {
  await db.update(contracts).set({ ...data, updatedAt: new Date() }).where(eq(contracts.id, id))
  revalidatePath('/admin/contracts')
}

export async function getExpiringContracts(days = 30) {
  const future = new Date()
  future.setDate(future.getDate() + days)
  return db.select({
    id: contracts.id,
    title: contracts.title,
    endDate: contracts.endDate,
    status: contracts.status,
    clientName: clients.name,
  })
    .from(contracts)
    .leftJoin(clients, eq(contracts.clientId, clients.id))
    .where(and(eq(contracts.status, 'active'), lte(contracts.endDate, future)))
    .orderBy(contracts.endDate)
}
