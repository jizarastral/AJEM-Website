'use server'

import { db } from '@/lib/db'
import { notifications, contactMessages } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId } from './auth'

export async function getMyNotifications() {
  const userId = await getUserId()
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt))
}

export async function markNotificationRead(id: number) {
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id))
  revalidatePath('/client/dashboard')
  revalidatePath('/admin/dashboard')
}

export async function createNotification(userId: string, title: string, message: string, type = 'info') {
  await db.insert(notifications).values({ userId, title, message, type })
}

export async function getAllContactMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt))
}

export async function markContactMessageRead(id: number) {
  await db.update(contactMessages).set({ status: 'read' }).where(eq(contactMessages.id, id))
  revalidatePath('/admin/messages')
}
