'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/shared/page-header'
import { InferenceStatusBadge, StatusBadge } from '@/components/shared/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'

type Detection = {
  id: string
  job_id: string | null
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

export default function ResultsPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Detection[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!user) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('detections')
      .select('id, job_id, class_id, class_name, healthy, robot_name, field, status, source, duration_ms, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
    setRows((data as Detection[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader
        title="Results"
        description="Per-image disease class, hardware source, inference job and processing duration."
        actions={
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw data-icon="inline-start" className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Detection results</CardTitle>
          <CardDescription>Most recent 50 inference jobs</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 md:pl-6">Job ID</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="hidden md:table-cell">Robot · Field</TableHead>
                <TableHead className="hidden lg:table-cell">Source</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Duration</TableHead>
                <TableHead className="pr-4 md:pr-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : rows.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                        No results yet.{' '}
                        <Link href="/upload" className="underline underline-offset-4 hover:text-foreground">
                          Upload images
                        </Link>{' '}
                        to get started.
                      </TableCell>
                    </TableRow>
                  )
                : rows.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="pl-4 md:pl-6">
                        <span className="font-mono text-xs">{d.job_id ?? d.id.slice(0, 8)}</span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={d.healthy ? 'success' : 'critical'} className="text-xs">
                          {d.class_name}
                        </StatusBadge>
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
                      <TableCell className="pr-4 md:pr-6 text-right">
                        <InferenceStatusBadge status={d.status as any} />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
