'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/page-header'
import { SeverityBadge } from '@/components/shared/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

type AlertItem = {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  channels: string
  read: boolean
  created_at: string
}

const SEED_ALERTS = [
  { title: 'Blast detected', description: 'Robot-01 · Field-A North', severity: 'critical' as const, channels: 'Email sent · SMS sent', read: false },
  { title: 'Inference job retried 3×', description: 'job_4c14 · checksum mismatch', severity: 'warning' as const, channels: 'Email sent', read: false },
  { title: 'Robot-04 offline', description: 'No heartbeat for 22 minutes', severity: 'warning' as const, channels: 'Email sent · SMS failed', read: false },
  { title: 'Health ratio above 80%', description: 'Field-B East recovered', severity: 'info' as const, channels: 'In-app only', read: true },
  { title: 'Brown spot cluster detected', description: 'Robot-03 · Field-C South · 3 images', severity: 'warning' as const, channels: 'Email sent · SMS sent', read: true },
  { title: 'Weekly digest ready', description: 'Oct 25 – Nov 01 crop health summary', severity: 'info' as const, channels: 'Email sent', read: true },
  { title: 'Tungro detected', description: 'Robot-02 · Field-B East', severity: 'critical' as const, channels: 'Email sent · SMS sent', read: false },
]

export default function NotificationsPage() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  async function load() {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
    setAlerts((data as AlertItem[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  async function seedAlerts() {
    if (!user) return
    setSeeding(true)
    const supabase = createClient()
    await supabase.from('alerts').insert(SEED_ALERTS)
    setSeeding(false)
    toast.success('Sample alerts added')
    load()
  }

  async function markAllRead() {
    if (!user) return
    const supabase = createClient()
    await supabase.from('alerts').update({ read: true }).eq('user_id', user.id)
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
    toast.success('All alerts marked as read')
  }

  async function deleteAlert(id: string) {
    const supabase = createClient()
    await supabase.from('alerts').delete().eq('id', id)
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  async function toggleRead(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('alerts').update({ read: !current }).eq('id', id)
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: !current } : a))
  }

  const unread = alerts.filter((a) => !a.read).length

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Disease, hardware and robot alerts with delivery status."
        actions={
          <div className="flex gap-2">
            {alerts.length === 0 && !loading && (
              <Button variant="outline" onClick={seedAlerts} disabled={seeding}>
                <Plus data-icon="inline-start" />
                Add sample alerts
              </Button>
            )}
            {unread > 0 && (
              <Button variant="outline" onClick={markAllRead}>
                <CheckCheck data-icon="inline-start" />
                Mark all read
              </Button>
            )}
          </div>
        }
      />

      {!loading && (
        <div className="flex gap-4">
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-semibold tabular-nums">{alerts.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-semibold tabular-nums text-destructive">{alerts.filter((a) => a.severity === 'critical').length}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-semibold tabular-nums">{unread}</p>
            <p className="text-xs text-muted-foreground">Unread</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All alerts</CardTitle>
          <CardDescription>Click an alert to mark it as read</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bell className="size-5" />
              </span>
              <p className="font-medium">No alerts yet</p>
              <p className="text-sm text-muted-foreground">Alerts are created when diseases or hardware issues are detected.</p>
              <Button variant="outline" size="sm" onClick={seedAlerts} disabled={seeding}>
                <Plus data-icon="inline-start" />
                Add sample alerts
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col">
              {alerts.map((a, i) => (
                <li key={a.id}>
                  {i > 0 && <Separator className="my-1" />}
                  <button
                    onClick={() => toggleRead(a.id, a.read)}
                    className={`w-full rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted/50 ${!a.read ? 'bg-secondary/40' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          {!a.read && <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                          <span className={`truncate text-sm ${!a.read ? 'font-semibold' : 'font-medium'}`}>{a.title}</span>
                        </div>
                        <span className="truncate text-xs text-muted-foreground">{a.description}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(a.created_at).toLocaleString()} · {a.channels}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={a.severity} />
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteAlert(a.id) }}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Delete alert"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  )
}
