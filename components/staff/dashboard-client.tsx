'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react'

type Order = {
  id: number
  title: string
  status: string
  priority: string
  location: string | null
  scheduledDate: Date | null
  clientName: string | null
}

function priorityColor(p: string) {
  const map: Record<string, string> = { urgent: 'bg-red-500/10 text-red-700 border-red-200', high: 'bg-orange-500/10 text-orange-700 border-orange-200', medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', low: 'bg-green-500/10 text-green-700 border-green-200' }
  return map[p] ?? ''
}

function statusColor(s: string) {
  const map: Record<string, string> = { pending: 'bg-yellow-500/10 text-yellow-700', in_progress: 'bg-blue-500/10 text-blue-700', completed: 'bg-green-500/10 text-green-700', cancelled: 'bg-gray-500/10 text-gray-700' }
  return map[s] ?? ''
}

export function StaffDashboardClient({ orders, user }: { orders: Order[]; user: { name: string } }) {
  const pending = orders.filter(o => o.status === 'pending').length
  const inProgress = orders.filter(o => o.status === 'in_progress').length
  const completed = orders.filter(o => o.status === 'completed').length
  const urgent = orders.filter(o => o.priority === 'urgent').length

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayJobs = orders.filter(o => {
    if (!o.scheduledDate) return false
    const d = new Date(o.scheduledDate)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground text-sm mt-1">Here&apos;s your work summary for today</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Assigned', value: orders.length, icon: ClipboardList, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/10' },
          { label: 'Urgent', value: urgent, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
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
            <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {todayJobs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No jobs scheduled for today</p>
            ) : (
              <div className="flex flex-col gap-3">
                {todayJobs.map(job => (
                  <div key={job.id} className="flex items-start justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm">{job.title}</p>
                      {job.clientName && <p className="text-xs text-muted-foreground">{job.clientName}</p>}
                      {job.location && <p className="text-xs text-muted-foreground">{job.location}</p>}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No jobs assigned yet</p>
            ) : (
              <div className="flex flex-col gap-2">
                {orders.slice(0, 6).map((job, i) => (
                  <div key={job.id}>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{job.title}</p>
                        {job.clientName && <p className="text-xs text-muted-foreground">{job.clientName}</p>}
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(job.status)}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>
                    {i < orders.slice(0, 6).length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
