'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts'
import { TrendingUp, Users, FileText, Wrench } from 'lucide-react'

type Stats = {
  total: number
  pending: number
  inProgress: number
  completed: number
}

const COLORS = ['#f97316', '#1e3a5f', '#22c55e', '#eab308']

export function AdminAnalyticsClient({
  stats,
  contracts,
  clients,
}: {
  stats: Stats
  contracts: { status: string; type: string; value: string | null }[]
  clients: { type: string; createdAt: Date }[]
}) {
  const workOrderStatusData = [
    { name: 'Pending', value: Number(stats.pending) },
    { name: 'In Progress', value: Number(stats.inProgress) },
    { name: 'Completed', value: Number(stats.completed) },
    { name: 'Other', value: Number(stats.total) - Number(stats.pending) - Number(stats.inProgress) - Number(stats.completed) },
  ].filter(d => d.value > 0)

  const contractTypeData = ['amc', 'service', 'maintenance', 'installation'].map(type => ({
    name: type.toUpperCase(),
    count: contracts.filter(c => c.type === type).length,
    value: contracts.filter(c => c.type === type).reduce((s, c) => s + Number(c.value ?? 0), 0),
  }))

  const clientTypeData = ['commercial', 'residential', 'industrial', 'government'].map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count: clients.filter(c => c.type === type).length,
  })).filter(d => d.count > 0)

  const totalContractValue = contracts.reduce((s, c) => s + Number(c.value ?? 0), 0)
  const activeContracts = contracts.filter(c => c.status === 'active').length

  const kpis = [
    { label: 'Total Work Orders', value: stats.total, icon: Wrench, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Active Contracts', value: activeContracts, icon: FileText, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Contract Value', value: `AED ${(totalContractValue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Business performance overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 pt-5">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`size-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Work Order Status</CardTitle>
            <CardDescription>Distribution across all statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-60 w-full">
              <PieChart>
                <Pie data={workOrderStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {workOrderStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract Types</CardTitle>
            <CardDescription>Count by contract category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-60 w-full">
              <BarChart data={contractTypeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-chart-1, #f97316)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Client Distribution</CardTitle>
            <CardDescription>Breakdown by client type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-60 w-full">
              <BarChart data={clientTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-chart-2, #1e3a5f)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
