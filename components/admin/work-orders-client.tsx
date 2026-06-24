'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { createWorkOrder, updateWorkOrderStatus } from '@/app/actions/work-orders'
import { Plus, Search, Filter, Eye, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  in_progress: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-700 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-700 border-red-500/20',
  on_hold: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  scheduled: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-500/10 text-blue-700',
  high: 'bg-orange-500/10 text-orange-700',
  urgent: 'bg-red-500/10 text-red-700',
}

type Order = {
  id: number; title: string; type: string; status: string; priority: string;
  assignedTo?: string | null; location?: string | null; scheduledDate?: Date | null;
  clientId?: number | null; clientName?: string | null; userId: string; createdAt: Date; updatedAt: Date; amount?: string | null
}

type Client = { id: number; name: string; company?: string | null }

interface Props { orders: Order[]; clients: Client[] }

export function WorkOrdersClient({ orders, clients }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({
    title: '', description: '', type: 'maintenance', priority: 'medium',
    clientId: '', assignedTo: '', location: '', notes: '',
  })

  const filtered = orders.filter((o) => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      (o.clientName ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await createWorkOrder({
          ...form,
          clientId: form.clientId ? Number(form.clientId) : undefined,
        })
        toast.success('Work order created')
        setCreateOpen(false)
        setForm({ title: '', description: '', type: 'maintenance', priority: 'medium', clientId: '', assignedTo: '', location: '', notes: '' })
      } catch {
        toast.error('Failed to create work order')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">{orders.length} total orders</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          New Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No work orders found.</TableCell>
                </TableRow>
              )}
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{o.title}</div>
                    <div className="text-xs text-muted-foreground">#{o.id}</div>
                  </TableCell>
                  <TableCell className="text-sm">{o.clientName ?? '—'}</TableCell>
                  <TableCell className="text-sm capitalize">{o.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', PRIORITY_COLORS[o.priority] ?? '')}>
                      {o.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', STATUS_COLORS[o.status] ?? '')}>
                      {o.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {o.scheduledDate ? new Date(o.scheduledDate).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/work-orders/${o.id}`}><Eye className="size-4" /></Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Work Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="wo-title">Title *</Label>
              <Input id="wo-title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="Work order title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="wo-type">Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger id="wo-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="wo-priority">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                  <SelectTrigger id="wo-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="wo-client">Client</Label>
                <Select value={form.clientId} onValueChange={v => setForm(p => ({ ...p, clientId: v }))}>
                  <SelectTrigger id="wo-client"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="wo-assigned">Assigned To</Label>
                <Input id="wo-assigned" value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))} placeholder="Staff name" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="wo-location">Location</Label>
              <Input id="wo-location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Job location" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="wo-desc">Description</Label>
              <Textarea id="wo-desc" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Details..." className="resize-none min-h-20" />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create Order'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
