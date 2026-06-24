'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MessageSquare } from 'lucide-react'

type Quotation = {
  id: number
  title: string
  description: string | null
  amount: string | null
  status: string
  validUntil: Date | null
  createdAt: Date
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-700',
  sent: 'bg-blue-500/10 text-blue-700',
  accepted: 'bg-green-500/10 text-green-700',
  rejected: 'bg-red-500/10 text-red-700',
  expired: 'bg-orange-500/10 text-orange-700',
}

export function ClientQuotationsClient({ quotations }: { quotations: Quotation[] }) {
  if (quotations.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quotations</h1>
          <p className="text-muted-foreground text-sm mt-1">Service quotations from AJEM</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <MessageSquare className="size-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">No quotations yet</p>
            <p className="text-sm text-muted-foreground">Submit a service request to receive a quotation</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quotations</h1>
        <p className="text-muted-foreground text-sm mt-1">Service quotations from AJEM</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.title}</TableCell>
                  <TableCell className="max-w-48 truncate text-muted-foreground text-sm">{q.description ?? '—'}</TableCell>
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
