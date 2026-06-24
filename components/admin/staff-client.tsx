'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users } from 'lucide-react'

type StaffMember = {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
}

export function AdminStaffClient({ staffMembers }: { staffMembers: StaffMember[] }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage staff accounts and roles</p>
        </div>
        <Card className="flex-row items-center gap-3 px-4 py-2 flex">
          <Users className="size-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Total Staff</p>
            <p className="text-lg font-bold leading-none">{staffMembers.length}</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    <Users className="mx-auto size-8 text-muted-foreground/30 mb-2" />
                    <p>No staff members yet</p>
                    <p className="text-xs mt-1">Create staff accounts via sign-up with role &quot;staff&quot;</p>
                  </TableCell>
                </TableRow>
              ) : staffMembers.map(s => {
                const initials = s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-blue-500/10 text-blue-700 text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize bg-blue-500/10 text-blue-700 border-blue-200">{s.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(s.createdAt).toLocaleDateString()}
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
