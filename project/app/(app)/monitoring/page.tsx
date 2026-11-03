'use client'

import { useEffect, useRef, useState } from 'react'
import { Activity, Bot, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge, InferenceStatusBadge } from '@/components/shared/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'

type Detection = {
  id: string
  class_name: string
  healthy: boolean
  robot_name: string | null
  field: string | null
  status: string
  source: string
  duration_ms: number | null
  created_at: string
}

type Robot = {
  id: string
  name: string
  status: string
  battery: number | null
  field: string | null
  last_seen: string | null
}

export default function MonitoringPage() {
  const { user } = useAuth()
  const [detections, setDetections] = useState<Detection[]>([])
  const [robots, setRobots] = useState<Robot[]>([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    async function load() {
      const [{ data: dData }, { data: rData }] = await Promise.all([
        supabase
          .from('detections')
          .select('id, class_name, healthy, robot_name, field, status, source, duration_ms, created_at')
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('robots')
          .select('id, name, status, battery, field, last_seen')
          .order('created_at', { ascending: true }),
      ])
      setDetections((dData as Detection[]) ?? [])
      setRobots((rData as Robot[]) ?? [])
      setLoading(false)
    }

    load()

    channelRef.current = supabase
      .channel('monitor-detections')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'detections' }, (payload) => {
        setDetections((prev) => [payload.new as Detection, ...prev].slice(0, 20))
      })
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [user])

  return (
    <>
      <PageHeader
        title="Live Monitoring"
        description="Real-time detection feed and robot status updates via Supabase Realtime."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Live feed */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-success" aria-hidden="true" />
                <CardTitle>Live detection feed</CardTitle>
              </div>
              <CardDescription>New entries appear automatically</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : detections.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No detections yet. Upload images to see results here.</p>
              ) : (
                <ol className="flex flex-col divide-y">
                  {detections.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge tone={d.healthy ? 'success' : 'critical'} className="text-xs">
                            {d.class_name}
                          </StatusBadge>
                          {d.robot_name && (
                            <span className="text-xs text-muted-foreground">{d.robot_name}</span>
                          )}
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(d.created_at).toLocaleTimeString()} · {d.source}
                          {d.duration_ms ? ` · ${d.duration_ms} ms` : ''}
                        </span>
                      </div>
                      <InferenceStatusBadge status={d.status as any} />
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Robot status */}
        <Card>
          <CardHeader>
            <CardTitle>Robot status</CardTitle>
            <CardDescription>Registered robots and their state</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : robots.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No robots registered yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {robots.map((r, i) => (
                  <li key={r.id}>
                    {i > 0 && <Separator className="mb-3" />}
                    <div className="flex items-center gap-3">
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${r.status === 'online' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                        <Bot className="size-4" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm">{r.name}</span>
                          <StatusBadge tone={r.status === 'online' ? 'success' : 'neutral'} className="capitalize text-xs">
                            {r.status}
                          </StatusBadge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {r.field ?? 'No field assigned'}
                          {r.battery != null ? ` · ${r.battery}% battery` : ''}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
