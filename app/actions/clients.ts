'use server'

import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { eq, desc, count } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId } from './auth'

export async function getClients() {
  const userId = await getUserId()
  return db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt))
}

export async function getAllClients() {
  return db.select().from(clients).orderBy(desc(clients.createdAt))
}

export async function getClientById(id: number) {
  const [client] = await db.select().from(clients).where(eq(clients.id, id)).limit(1)
  return client
}

export async function createClient(data: {
  name: string
  company?: string
  email?: string
  phone?: string
  address?: string
  contactPerson?: string
  type: string
  notes?: string
}) {
  const userId = await getUserId()
  const [client] = await db.insert(clients).values({ ...data, userId }).returning()
  revalidatePath('/admin/clients')
  return client
}

export async function updateClient(id: number, data: Partial<typeof clients.$inferInsert>) {
  await db.update(clients).set({ ...data, updatedAt: new Date() }).where(eq(clients.id, id))
  revalidatePath('/admin/clients')
}

export async function getClientStats() {
  const [stats] = await db.select({
    total: count(),
    active: count(),
  }).from(clients)
  return stats
}
