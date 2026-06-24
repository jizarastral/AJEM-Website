'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, MapPin, Calendar } from 'lucide-react'

type WorkOrder = {
  id: number
  title: string
  type: string
  status: string
  priority: string
  location: string | null
  scheduledDate: Date | null
  completedDate: Date | null
  amount: string | null
  createdAt: Date
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700',
  in_progress: 'bg-blue-500/10 text-blue-700',
  completed: 'bg-green-500/10 text-green-700',
  cancelled: 'bg-gray-500/10 text-gray-700',
  on_hold: 'bg-orange-500/10 text-orange-700',
}

export function ClientWorkOrdersClient({ orders }: { orders: WorkOrder[] }) {
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Work Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Track the status of your service jobs</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No work orders found</TableCell>
                </TableRow>
              ) : filtered.map(order => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{order.title}</p>
                      {order.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="size-3" />{order.location}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{order.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {order.scheduledDate ? (
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="size-3 text-muted-foreground" />
                        {new Date(order.scheduledDate).toLocaleDateString()}
                      </span>
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    {order.amount ? `AED ${Number(order.amount).toLocaleString()}` : '—'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? ''}`}>
                      {order.status.replace('_', ' ')}
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
