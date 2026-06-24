'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createContract } from '@/app/actions/contracts'
import { toast } from 'sonner'
import { Search, Plus, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

type Contract = {
  id: number
  title: string
  type: string
  status: string
  startDate: Date | null
  endDate: Date | null
  value: string | null
  autoRenew: boolean
  createdAt: Date
}

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    active: 'bg-green-500/10 text-green-700 border-green-200',
    expired: 'bg-red-500/10 text-red-700 border-red-200',
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    cancelled: 'bg-gray-500/10 text-gray-700 border-gray-200',
  }
  return map[status] ?? 'bg-muted text-muted-foreground'
}

function daysUntilExpiry(endDate: Date | null): number | null {
  if (!endDate) return null
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export function AdminContractsClient({ contracts }: { contracts: Contract[] }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const filtered = contracts.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  )

  const active = contracts.filter(c => c.status === 'active').length
  const expiringSoon = contracts.filter(c => {
    const days = daysUntilExpiry(c.endDate)
    return c.status === 'active' && days !== null && days <= 30
  }).length
  const expired = contracts.filter(c => c.status === 'expired').length

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await createContract({
        title: fd.get('title') as string,
        type: fd.get('type') as string,
        startDate: fd.get('startDate') ? new Date(fd.get('startDate') as string) : undefined,
        endDate: fd.get('endDate') ? new Date(fd.get('endDate') as string) : undefined,
        value: fd.get('value') ? Number(fd.get('value')) : undefined,
        terms: fd.get('terms') as string || undefined,
        autoRenew: fd.get('autoRenew') === 'on',
      })
      toast.success('Contract created')
      setOpen(false)
    } catch {
      toast.error('Failed to create contract')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contracts</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage AMC and service contracts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="size-4" />New Contract</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Contract</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-title">Title *</Label>
                <Input id="c-title" name="title" required placeholder="Contract title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="c-type">Type</Label>
                  <Select name="type" defaultValue="amc">
                    <SelectTrigger id="c-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amc">AMC</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="c-value">Value (AED)</Label>
                  <Input id="c-value" name="value" type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="c-start">Start Date</Label>
                  <Input id="c-start" name="startDate" type="date" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="c-end">End Date</Label>
                  <Input id="c-end" name="endDate" type="date" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-terms">Terms</Label>
                <Textarea id="c-terms" name="terms" placeholder="Contract terms and conditions..." rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Active', value: active, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Expiring Soon', value: expiringSoon, icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Expired', value: expired, icon: Clock, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`size-5 ${color}`} />
              </div>
              <span className="text-3xl font-bold">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No contracts found</TableCell>
                </TableRow>
              ) : filtered.map(contract => {
                const days = daysUntilExpiry(contract.endDate)
                return (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        {contract.title}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{contract.type}</Badge></TableCell>
                    <TableCell>{contract.value ? `AED ${Number(contract.value).toLocaleString()}` : '—'}</TableCell>
                    <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : '—'}</TableCell>
                    <TableCell>
                      {days !== null ? (
                        <span className={days <= 30 ? 'text-red-600 font-medium' : days <= 60 ? 'text-yellow-600 font-medium' : 'text-muted-foreground'}>
                          {days > 0 ? `${days}d` : 'Expired'}
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(contract.status)}`}>
                        {contract.status}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
