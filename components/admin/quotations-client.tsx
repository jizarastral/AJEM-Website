'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, FileText } from 'lucide-react'

type Quotation = {
  id: number
  title: string
  description: string | null
  amount: string | null
  status: string
  validUntil: Date | null
  createdAt: Date
  clientName: string | null
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-700',
  sent: 'bg-blue-500/10 text-blue-700',
  accepted: 'bg-green-500/10 text-green-700',
  rejected: 'bg-red-500/10 text-red-700',
  expired: 'bg-orange-500/10 text-orange-700',
}

export function AdminQuotationsClient({ quotations }: { quotations: Quotation[] }) {
  const [search, setSearch] = useState('')

  const filtered = quotations.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    (q.clientName ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const totalValue = quotations.filter(q => q.status === 'accepted').reduce((s, q) => s + Number(q.amount ?? 0), 0)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quotations</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage client quotations</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Accepted Value</p>
          <p className="text-xl font-bold text-primary">AED {totalValue.toLocaleString()}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search quotations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    <FileText className="mx-auto size-8 text-muted-foreground/30 mb-2" />
                    No quotations found
                  </TableCell>
                </TableRow>
              ) : filtered.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.title}</TableCell>
                  <TableCell>{q.clientName ?? '—'}</TableCell>
                  <TableCell>{q.amount ? `AED ${Number(q.amount).toLocaleString()}` : 'TBD'}</TableCell>
                  <TableCell>{q.validUntil ? new Date(q.validUntil).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[q.status] ?? ''}`}>
                      {q.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
