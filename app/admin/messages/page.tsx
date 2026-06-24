import { db } from '@/lib/db'
import { contactMessages } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { AdminMessagesClient } from '@/components/admin/messages-client'

export default async function AdminMessagesPage() {
  const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt))
  return <AdminMessagesClient messages={messages} />
}
