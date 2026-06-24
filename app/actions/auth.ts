'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getUserRole(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return 'guest'
  return (session.user as { role?: string }).role ?? 'client'
}
