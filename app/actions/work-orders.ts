'use server'

import { db } from '@/lib/db'
import { workOrders, jobUpdates, clients } from '@/lib/db/schema'
import { eq, desc, and, count, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId } from './auth'

export async function getWorkOrders() {
  const userId = await getUserId()
  return db.select().from(workOrders).where(eq(workOrders.userId, userId)).orderBy(desc(workOrders.createdAt))
}

export async function getAllWorkOrders() {
  // Admin: get all work orders with client info
  return db.select({
    id: workOrders.id,
    title: workOrders.title,
    type: workOrders.type,
    status: workOrders.status,
    priority: workOrders.priority,
    assignedTo: workOrders.assignedTo,
    location: workOrders.location,
    scheduledDate: workOrders.scheduledDate,
    completedDate: workOrders.completedDate,
    amount: workOrders.amount,
    userId: workOrders.userId,
    clientId: workOrders.clientId,
    createdAt: workOrders.createdAt,
    updatedAt: workOrders.updatedAt,
    clientName: clients.name,
  })
    .from(workOrders)
    .leftJoin(clients, eq(workOrders.clientId, clients.id))
    .orderBy(desc(workOrders.createdAt))
}

export async function getWorkOrderById(id: number) {
  const [order] = await db.select().from(workOrders).where(eq(workOrders.id, id)).limit(1)
  return order
}

export async function createWorkOrder(data: {
  title: string
  description?: string
  type: string
  priority: string
  clientId?: number
  assignedTo?: string
  location?: string
  scheduledDate?: Date
  estimatedHours?: number
  amount?: number
  notes?: string
}) {
  const userId = await getUserId()
  const [order] = await db.insert(workOrders).values({ ...data, userId, status: 'pending' }).returning()
  revalidatePath('/admin/work-orders')
  revalidatePath('/staff/jobs')
  return order
}

export async function updateWorkOrderStatus(id: number, status: string, note?: string) {
  const userId = await getUserId()
  await db.update(workOrders).set({ status, updatedAt: new Date() }).where(eq(workOrders.id, id))
  if (note) {
    await db.insert(jobUpdates).values({ userId, workOrderId: id, message: note, status })
  }
  revalidatePath('/admin/work-orders')
  revalidatePath('/staff/jobs')
  revalidatePath('/client/work-orders')
}

export async function getWorkOrderStats() {
  const [stats] = await db.select({
    total: count(),
    pending: sql<number>`count(*) filter (where status = 'pending')`,
    inProgress: sql<number>`count(*) filter (where status = 'in_progress')`,
    completed: sql<number>`count(*) filter (where status = 'completed')`,
  }).from(workOrders)
  return stats
}

export async function getJobUpdates(workOrderId: number) {
  return db.select().from(jobUpdates).where(eq(jobUpdates.workOrderId, workOrderId)).orderBy(desc(jobUpdates.createdAt))
}

export async function addJobUpdate(workOrderId: number, message: string, status?: string) {
  const userId = await getUserId()
  await db.insert(jobUpdates).values({ userId, workOrderId, message, status })
  revalidatePath(`/admin/work-orders/${workOrderId}`)
  revalidatePath(`/staff/jobs/${workOrderId}`)
}
