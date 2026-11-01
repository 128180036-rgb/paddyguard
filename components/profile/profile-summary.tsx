import { BadgeCheck, CalendarDays, Mail, MapPin, Phone } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import { currentUser, summary } from '@/lib/demo-data'

const details = [
  { icon: Mail, label: 'Email', value: currentUser.email },
  { icon: Phone, label: 'Phone', value: currentUser.phone },
  { icon: MapPin, label: 'Location', value: currentUser.location },
  { icon: CalendarDays, label: 'Member since', value: currentUser.memberSince },
]

export function ProfileSummary() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <Avatar className="size-20">
          <AvatarFallback className="bg-primary text-2xl text-primary-foreground">{currentUser.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <h2 className="flex items-center gap-1.5 text-lg font-semibold">
            {currentUser.name}
            {currentUser.verified && <BadgeCheck className="size-4 text-success" aria-label="Verified" />}
          </h2>
          <p className="text-sm text-muted-foreground">{currentUser.organization}</p>
          <StatusBadge tone="info" className="mt-1">
            {currentUser.role}
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
          <span className="font-semibold tabular-nums">{(summary.totalImages / 1000).toFixed(1)}k</span>
          <span className="text-xs text-muted-foreground">Images</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">3</span>
          <span className="text-xs text-muted-foreground">Fields</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">{summary.robotsTotal}</span>
          <span className="text-xs text-muted-foreground">Robots</span>
        </div>
      </CardFooter>
    </Card>
  )
}
