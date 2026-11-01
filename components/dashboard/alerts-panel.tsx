import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SeverityBadge } from '@/components/shared/status-badge'
import { recentAlerts } from '@/lib/demo-data'

export function AlertsPanel() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent alerts</CardTitle>
        <CardDescription>Disease, robot and hardware events</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/notifications" />} nativeButton={false}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col">
          {recentAlerts.map((a, i) => (
            <li key={a.id} className="flex flex-col">
              {i > 0 && <Separator className="my-3" />}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">{a.title}</span>
                  <span className="truncate text-xs text-muted-foreground">{a.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.time} · {a.channels}
                  </span>
                </div>
                <SeverityBadge severity={a.severity} />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
