'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Mail, MailOpen } from 'lucide-react'

type Message = {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  createdAt: Date
}

export function AdminMessagesClient({ messages }: { messages: Message[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Message | null>(null)

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.subject ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const unread = messages.filter(m => m.status === 'unread').length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground text-sm mt-1">Website enquiries and contact form submissions</p>
        </div>
        {unread > 0 && (
          <Badge className="bg-primary text-primary-foreground">{unread} unread</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-border">
              {filtered.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground text-sm">No messages found</p>
              ) : filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setSelected(msg)}
                  className={`flex flex-col gap-1 p-4 text-left transition-colors hover:bg-accent ${selected?.id === msg.id ? 'bg-accent' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{msg.name}</span>
                    {msg.status === 'unread' ? (
                      <Mail className="size-4 text-primary" />
                    ) : (
                      <MailOpen className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{msg.subject ?? '(No subject)'}</span>
                  <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            {selected ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{selected.subject ?? '(No subject)'}</h2>
                    <p className="text-sm text-muted-foreground">From: {selected.name} &lt;{selected.email}&gt;</p>
                    {selected.phone && <p className="text-sm text-muted-foreground">Phone: {selected.phone}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                  <Badge variant={selected.status === 'unread' ? 'default' : 'secondary'} className="capitalize">
                    {selected.status}
                  </Badge>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center">
                <div className="text-center">
                  <Mail className="mx-auto size-10 text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground text-sm">Select a message to view</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
