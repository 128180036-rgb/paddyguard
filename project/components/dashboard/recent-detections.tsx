'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InferenceStatusBadge, StatusBadge } from '@/components/shared/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { recentDetections } from '@/lib/demo-data'
import { getDisease } from '@/lib/paddy'

type Detection = {
  id: string
  class_id: number
  class_name: string
  healthy: boolean
  robot_name: string | null
  field: string | null
  status: string
  source: string
  duration_ms: number | null
  created_at: string
}

export function RecentDetections() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Detection[] | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('detections')
      .select('id, class_id, class_name, healthy, robot_name, field, status, source, duration_ms, created_at')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setRows((data as Detection[]) ?? []))
  }, [user])

  const useDemo = rows === null || rows.length === 0
  const displayRows = useDemo
    ? recentDetections.map((d) => ({
        id: d.id,
        class_id: d.classId,
        class_name: getDisease(d.classId).name,
        healthy: getDisease(d.classId).healthy,
        robot_name: d.robot,
        field: d.field,
        status: d.status,
        source: d.source,
        duration_ms: d.durationMs,
        created_at: d.capturedAt,
      }))
    : rows

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent detections</CardTitle>
        <CardDescription>{useDemo ? 'Demo data · upload images to see your results' : 'Latest inference jobs'}</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" render={<Link href="/results" />} nativeButton={false}>
            View all
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 md:pl-6">Image</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="hidden md:table-cell">Robot · Field</TableHead>
              <TableHead className="hidden lg:table-cell">Source</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Duration</TableHead>
              <TableHead className="pr-4 text-right md:pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows === null
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-8 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : displayRows.map((d) => {
                  const resolved = d.status === 'completed'
                  const imgSrc = useDemo
                    ? `/images/${d.class_id === 8 ? 'leaf-healthy' : d.class_id === 3 ? 'leaf-blast' : d.class_id === 4 ? 'leaf-brown-spot' : 'leaf-blight'}.png`
                    : null
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="pl-4 md:pl-6">
                        <div className="flex items-center gap-3">
                          {imgSrc ? (
                            <Image src={imgSrc} alt="" width={40} height={40} className="size-10 rounded-md object-cover" />
                          ) : (
                            <div className="size-10 rounded-md bg-muted" />
                          )}
                          <div className="flex flex-col">
                            <span className="font-mono text-xs">{d.id.slice(0, 8)}</span>
                            <span className="text-xs text-muted-foreground">
                              {typeof d.created_at === 'string' && d.created_at.length <= 5
                                ? d.created_at
                                : new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {resolved ? (
                          <StatusBadge tone={d.healthy ? 'success' : 'critical'}>{d.class_name}</StatusBadge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Pending</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col">
                          <span className="text-sm">{d.robot_name ?? '—'}</span>
                          <span className="text-xs text-muted-foreground">{d.field ?? '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{d.source}</TableCell>
                      <TableCell className="hidden sm:table-cell text-right font-mono text-xs tabular-nums">
                        {d.duration_ms ? `${d.duration_ms} ms` : '—'}
                      </TableCell>
                      <TableCell className="pr-4 text-right md:pr-6">
                        <InferenceStatusBadge status={d.status as any} />
                      </TableCell>
                    </TableRow>
                  )
                })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
