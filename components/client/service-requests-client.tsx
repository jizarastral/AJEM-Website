'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createServiceRequest } from '@/app/actions/service-requests'
import { toast } from 'sonner'
import { Plus, Search } from 'lucide-react'

type ServiceRequest = {
  id: number
  title: string
  type: string
  priority: string
  status: string
  location: string | null
  preferredDate: Date | null
  createdAt: Date
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-500/10 text-red-700',
  high: 'bg-orange-500/10 text-orange-700',
  medium: 'bg-yellow-500/10 text-yellow-700',
  low: 'bg-green-500/10 text-green-700',
}

export function ClientServiceRequestsClient({ requests, user }: { requests: ServiceRequest[]; user: { name: string } }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const filtered = requests.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await createServiceRequest({
        title: fd.get('title') as string,
        description: fd.get('description') as string || undefined,
        type: fd.get('type') as string,
        priority: fd.get('priority') as string,
        location: fd.get('location') as string || undefined,
        preferredDate: fd.get('preferredDate') ? new Date(fd.get('preferredDate') as string) : undefined,
      })
      toast.success('Service request submitted')
      setOpen(false)
    } catch {
      toast.error('Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Submit and track service requests</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="size-4" />New Request</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Submit Service Request</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sr-title">Issue Title *</Label>
                <Input id="sr-title" name="title" required placeholder="Brief description of issue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sr-desc">Description</Label>
                <Textarea id="sr-desc" name="description" placeholder="More details..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sr-type">Service Type</Label>
                  <Select name="type" defaultValue="maintenance">
                    <SelectTrigger id="sr-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sr-priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger id="sr-priority"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sr-location">Location</Label>
                <Input id="sr-location" name="location" placeholder="Building / unit / address" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sr-date">Preferred Date</Label>
                <Input id="sr-date" name="preferredDate" type="date" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Preferred Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No service requests yet</TableCell>
                </TableRow>
              ) : filtered.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.title}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{req.type}</Badge></TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_COLORS[req.priority] ?? ''}`}>
                      {req.priority}
                    </span>
                  </TableCell>
                  <TableCell>{req.preferredDate ? new Date(req.preferredDate).toLocaleDateString() : '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{req.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
