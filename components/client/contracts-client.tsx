'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileText, Calendar, RefreshCw } from 'lucide-react'

type Contract = {
  id: number
  title: string
  type: string
  status: string
  startDate: Date | null
  endDate: Date | null
  value: string | null
  autoRenew: boolean
  terms: string | null
}

function statusClass(s: string) {
  const m: Record<string, string> = {
    active: 'bg-green-500/10 text-green-700',
    expired: 'bg-red-500/10 text-red-700',
    pending: 'bg-yellow-500/10 text-yellow-700',
    cancelled: 'bg-gray-500/10 text-gray-700',
  }
  return m[s] ?? ''
}

export function ClientContractsClient({ contracts }: { contracts: Contract[] }) {
  if (contracts.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contracts</h1>
          <p className="text-muted-foreground text-sm mt-1">Your active service contracts</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <FileText className="size-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">No contracts found</p>
            <p className="text-sm text-muted-foreground">Contact AJEM to set up a service contract</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contracts</h1>
        <p className="text-muted-foreground text-sm mt-1">Your active service contracts</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {contracts.map(c => (
          <Card key={c.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  <CardTitle className="text-base">{c.title}</CardTitle>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass(c.status)}`}>
                  {c.status}
                </span>
              </div>
              <CardDescription className="capitalize">{c.type} Contract</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 flex flex-col gap-3">
              {c.value && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Value</span>
                  <span className="font-medium">AED {Number(c.value).toLocaleString()}</span>
                </div>
              )}
              {c.startDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Calendar className="size-3" />Start</span>
                  <span className="font-medium">{new Date(c.startDate).toLocaleDateString()}</span>
                </div>
              )}
              {c.endDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Calendar className="size-3" />Expiry</span>
                  <span className="font-medium">{new Date(c.endDate).toLocaleDateString()}</span>
                </div>
              )}
              {c.autoRenew && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <RefreshCw className="size-3" />
                  Auto-renewal enabled
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
