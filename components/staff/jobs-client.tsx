'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { updateWorkOrderStatus, addJobUpdate } from '@/app/actions/work-orders'
import { toast } from 'sonner'
import { Search, MapPin, Calendar, User } from 'lucide-react'

type Order = {
  id: number
  title: string
  status: string
  priority: string
  location: string | null
  scheduledDate: Date | null
  clientName: string | null
  type: string
  description?: string | null
}

const STATUS_OPTIONS = ['pending', 'in_progress', 'on_hold', 'completed', 'cancelled']
const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-500/10 text-red-700 border-red-200',
  high: 'bg-orange-500/10 text-orange-700 border-orange-200',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  low: 'bg-green-500/10 text-green-700 border-green-200',
}

export function StaffJobsClient({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Order | null>(null)
  const [note, setNote] = useState('')
  const [updating, setUpdating] = useState(false)

  const filtered = orders.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      (o.clientName ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleStatusChange(id: number, status: string) {
    setUpdating(true)
    try {
      await updateWorkOrderStatus(id, status, note || undefined)
      toast.success('Status updated')
      setSelected(null)
      setNote('')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Jobs</h1>
        <p className="text-muted-foreground text-sm mt-1">Work orders assigned to you</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No jobs found</TableCell>
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
                    <span className="flex items-center gap-1 text-sm">
                      <User className="size-3 text-muted-foreground" />{order.clientName ?? '—'}
                    </span>
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
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_COLORS[order.priority] ?? ''}`}>
                      {order.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{order.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelected(order)}>
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Job Status</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium">{selected.title}</p>
              <div className="flex flex-col gap-1.5">
                <Label>New Status</Label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selected.status === s ? 'default' : 'outline'}
                      onClick={() => setSelected({ ...selected, status: s })}
                      className="capitalize"
                    >
                      {s.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="note">Update Note</Label>
                <Textarea id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about this update..." rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                <Button onClick={() => handleStatusChange(selected.id, selected.status)} disabled={updating}>
                  {updating ? 'Saving...' : 'Save Update'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
