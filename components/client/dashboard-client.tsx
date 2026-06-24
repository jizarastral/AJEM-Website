'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Bell, ClipboardList, FileText, Wrench, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type WorkOrder = { id: number; title: string; status: string; createdAt: Date }
type Contract = { id: number; title: string; status: string; endDate: Date | null }
type ServiceRequest = { id: number; title: string; status: string; createdAt: Date }
type Notification = { id: number; title: string; message: string; read: boolean; createdAt: Date }

export function ClientDashboardClient({
  user, workOrders, contracts, serviceRequests, notifications
}: {
  user: { name: string }
  workOrders: WorkOrder[]
  contracts: Contract[]
  serviceRequests: ServiceRequest[]
  notifications: Notification[]
}) {
  const unreadNotifs = notifications.filter(n => !n.read).length
  const activeContracts = contracts.filter(c => c.status === 'active').length
  const pendingOrders = workOrders.filter(o => o.status === 'pending' || o.status === 'in_progress').length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground text-sm mt-1">Your AJEM service overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Active Orders', value: pendingOrders, icon: ClipboardList, color: 'text-primary', bg: 'bg-primary/10', href: '/client/work-orders' },
          { label: 'Contracts', value: activeContracts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500/10', href: '/client/contracts' },
          { label: 'Service Requests', value: serviceRequests.length, icon: Wrench, color: 'text-green-600', bg: 'bg-green-500/10', href: '/client/service-requests' },
          { label: 'Notifications', value: unreadNotifs, icon: Bell, color: 'text-yellow-600', bg: 'bg-yellow-500/10', href: '/client/dashboard' },
        ].map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
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
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Work Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/client/work-orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {workOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No work orders yet</p>
            ) : (
              <div className="flex flex-col gap-2">
                {workOrders.map((order, i) => (
                  <div key={order.id}>
                    <div className="flex items-center justify-between py-2">
                      <p className="text-sm font-medium">{order.title}</p>
                      <Badge variant="outline" className="capitalize text-xs">{order.status.replace('_', ' ')}</Badge>
                    </div>
                    {i < workOrders.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Notifications</CardTitle>
            {unreadNotifs > 0 && <Badge className="bg-primary text-primary-foreground">{unreadNotifs} new</Badge>}
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-sm">No notifications</p>
            ) : (
              <div className="flex flex-col gap-2">
                {notifications.map((notif, i) => (
                  <div key={notif.id}>
                    <div className="flex items-start gap-2 py-2">
                      <div className={`mt-1 size-2 shrink-0 rounded-full ${notif.read ? 'bg-muted' : 'bg-primary'}`} />
                      <div>
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                      </div>
                    </div>
                    {i < notifications.length - 1 && <Separator />}
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
