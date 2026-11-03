'use client'

import { BadgeCheck, CalendarDays, Mail, MapPin, Phone } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import { useAuth } from '@/lib/auth-context'

function getInitials(name: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

export function ProfileSummary() {
  const { user, profile } = useAuth()

  const displayName = profile?.full_name || user?.email || 'User'
  const initials = getInitials(displayName)
  const email = user?.email ?? ''
  const phone = profile?.phone ?? '—'
  const location = profile?.location ?? '—'
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  const details = [
    { icon: Mail, label: 'Email', value: email },
    { icon: Phone, label: 'Phone', value: phone },
    { icon: MapPin, label: 'Location', value: location },
    { icon: CalendarDays, label: 'Member since', value: memberSince },
  ]

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <Avatar className="size-20">
          <AvatarFallback className="bg-primary text-2xl text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <h2 className="flex items-center gap-1.5 text-lg font-semibold">
            {displayName}
            <BadgeCheck className="size-4 text-success" aria-label="Verified" />
          </h2>
          <p className="text-sm text-muted-foreground">{profile?.organization ?? 'Independent'}</p>
          <StatusBadge tone="info" className="mt-1 capitalize">
            {profile?.role ?? 'User'}
          </StatusBadge>
        </div>
        <Separator />
        <dl className="flex w-full flex-col gap-3 text-left">
          {details.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <d.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">{d.label}</dt>
              <dd className="truncate text-sm">{d.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 border-t text-center">
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">0</span>
          <span className="text-xs text-muted-foreground">Images</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">3</span>
          <span className="text-xs text-muted-foreground">Fields</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">4</span>
          <span className="text-xs text-muted-foreground">Robots</span>
        </div>
      </CardFooter>
    </Card>
  )
}