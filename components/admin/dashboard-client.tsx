'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ClipboardList, Users, AlertTriangle, MessageSquare, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  in_progress: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-700 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-700 border-red-500/20',
  on_hold: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-500/10 text-blue-700',
  high: 'bg-orange-500/10 text-orange-700',
  urgent: 'bg-red-500/10 text-red-700',
}

interface Props {
  stats: { total: number | null; pending: number | null; inProgress: number | null; completed: number | null }
  recentOrders: Array<{ id: number; title: string; status: string; priority: string; clientName?: string | null; scheduledDate?: Date | null }>
  totalClients: number
  expiringContracts: Array<{ id: number; title: string; endDate?: Date | null; clientName?: string | null }>
  unreadMessages: number
}

const CHART_CONFIG = {
  pending: { label: 'Pending', color: 'hsl(var(--chart-4))' },
  inProgress: { label: 'In Progress', color: 'hsl(var(--chart-2))' },
  completed: { label: 'Completed', color: 'hsl(var(--chart-5))' },
}

export function AdminDashboardClient({ stats, recentOrders, totalClients, expiringContracts, unreadMessages }: Props) {
  const pieData = [
    { name: 'Pending', value: Number(stats.pending ?? 0), color: 'var(--color-chart-4)' },
    { name: 'In Progress', value: Number(stats.inProgress ?? 0), color: 'var(--color-chart-2)' },
    { name: 'Completed', value: Number(stats.completed ?? 0), color: 'var(--color-chart-5)' },
  ]

  const kpis = [
    { label: 'Total Work Orders', value: stats.total ?? 0, icon: ClipboardList, href: '/admin/work-orders', color: 'text-primary' },
    { label: 'Active Clients', value: totalClients, icon: Users, href: '/admin/clients', color: 'text-blue-600' },
    { label: 'Expiring Contracts', value: expiringContracts.length, icon: AlertTriangle, href: '/admin/contracts', color: 'text-orange-500' },
    { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, href: '/admin/messages', color: 'text-green-600' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of all operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link href={kpi.href} key={kpi.label}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  <div className={cn('size-8 rounded-lg bg-muted flex items-center justify-center', kpi.color)}>
                    <kpi.icon className="size-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Work Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={CHART_CONFIG} className="h-52">
              <BarChart data={[
                { name: 'Pending', value: Number(stats.pending ?? 0) },
                { name: 'In Progress', value: Number(stats.inProgress ?? 0) },
                { name: 'Completed', value: Number(stats.completed ?? 0) },
              ]}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={CHART_CONFIG} className="h-52">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders + Expiring Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Work Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/work-orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground px-6 py-4">No work orders yet.</p>
              )}
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/work-orders/${order.id}`} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{order.title}</p>
                    <p className="text-xs text-muted-foreground">{order.clientName ?? 'No client'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={cn('text-xs', PRIORITY_COLORS[order.priority] ?? '')}>
                      {order.priority}
                    </Badge>
                    <Badge variant="outline" className={cn('text-xs', STATUS_COLORS[order.status] ?? '')}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Expiring Contracts (30 days)</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/contracts">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {expiringContracts.length === 0 && (
                <p className="text-sm text-muted-foreground px-6 py-4">No contracts expiring soon.</p>
              )}
              {expiringContracts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-6 py-3">
                  <AlertTriangle className="size-4 text-orange-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.clientName ?? '—'}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {c.endDate ? new Date(c.endDate).toLocaleDateString() : '—'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
