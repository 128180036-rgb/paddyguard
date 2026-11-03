'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SeverityBadge } from '@/components/shared/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { recentAlerts } from '@/lib/demo-data'

type AlertItem = {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  channels: string
  read: boolean
  created_at: string
}

export function AlertsPanel() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<AlertItem[] | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('alerts')
      .select('id, title, description, severity, channels, read, created_at')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => setAlerts((data as AlertItem[]) ?? []))
  }, [user])

  const useDemo = alerts === null || alerts.length === 0
  const displayAlerts = useDemo ? recentAlerts.map((a) => ({ ...a, read: false, created_at: '' })) : alerts

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent alerts</CardTitle>
        <CardDescription>{useDemo ? 'Demo data' : 'Disease, robot and hardware events'}</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/notifications" />} nativeButton={false}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {alerts === null ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : (
          <ul className="flex flex-col">
            {displayAlerts.map((a, i) => (
              <li key={a.id} className="flex flex-col">
                {i > 0 && <Separator className="my-3" />}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className={`truncate text-sm ${!a.read ? 'font-semibold' : 'font-medium'}`}>{a.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{a.description}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleString()
                        : (a as any).time ?? ''} · {a.channels}
                    </span>
                  </div>
                  <SeverityBadge severity={a.severity} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
