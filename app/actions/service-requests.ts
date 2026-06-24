'use server'

import { db } from '@/lib/db'
import { serviceRequests, quotations } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId } from './auth'

export async function getMyServiceRequests() {
  const userId = await getUserId()
  return db.select().from(serviceRequests).where(eq(serviceRequests.userId, userId)).orderBy(desc(serviceRequests.createdAt))
}

export async function getAllServiceRequests() {
  return db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt))
}

export async function createServiceRequest(data: {
  title: string
  description?: string
  type: string
  priority: string
  location?: string
  preferredDate?: Date
}) {
  const userId = await getUserId()
  const [req] = await db.insert(serviceRequests).values({ ...data, userId, status: 'pending' }).returning()
  revalidatePath('/client/requests')
  revalidatePath('/admin/work-orders')
  return req
}

export async function updateServiceRequestStatus(id: number, status: string) {
  await db.update(serviceRequests).set({ status, updatedAt: new Date() }).where(eq(serviceRequests.id, id))
  revalidatePath('/client/requests')
  revalidatePath('/admin/work-orders')
}

export async function getMyQuotations() {
  const userId = await getUserId()
  return db.select().from(quotations).where(eq(quotations.userId, userId)).orderBy(desc(quotations.createdAt))
}

export async function getAllQuotations() {
  return db.select().from(quotations).orderBy(desc(quotations.createdAt))
}

export async function createQuotation(data: {
  title: string
  description?: string
  clientId?: number
  amount?: number
  validUntil?: Date
  notes?: string
}) {
  const userId = await getUserId()
  const [q] = await db.insert(quotations).values({ ...data, userId, status: 'draft' }).returning()
  revalidatePath('/admin/quotations')
  return q
}

export async function updateQuotationStatus(id: number, status: string) {
  await db.update(quotations).set({ status, updatedAt: new Date() }).where(eq(quotations.id, id))
  revalidatePath('/admin/quotations')
  revalidatePath('/client/quotations')
}
