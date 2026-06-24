import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { AdminStaffClient } from '@/components/admin/staff-client'

export default async function AdminStaffPage() {
  const staffMembers = await db.select().from(user).where(eq(user.role, 'staff'))
  return <AdminStaffClient staffMembers={staffMembers} />
}
