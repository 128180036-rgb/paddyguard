'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/shared/page-header'
import { InferenceStatusBadge, StatusBadge } from '@/components/shared/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { DISEASE_CLASSES } from '@/lib/paddy'

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

const filterOptions = [
  { value: 'all', label: 'All classes' },
  { value: 'healthy', label: 'Healthy only' },
  { value: 'diseased', label: 'Diseased only' },
  ...DISEASE_CLASSES.filter((d) => !d.healthy).map((d) => ({ value: String(d.id), label: d.name })),
]

export default function HistoryPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Detection[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    const supabase = createClient()
    supabase
      .from('detections')
      .select('id, job_id, class_id, class_name, healthy, robot_name, field, status, source, duration_ms, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setRows((data as Detection[]) ?? [])
        setLoading(false)
      })
  }, [user])

  const filtered = rows.filter((r) => {
    const matchSearch =
      !search ||
      r.class_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.robot_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (r.field ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (r.job_id ?? r.id).toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'healthy' && r.healthy) ||
      (filter === 'diseased' && !r.healthy) ||
      String(r.class_id) === filter
    return matchSearch && matchFilter
  })

  function exportCsv() {
    const header = 'job_id,class_name,healthy,robot,field,source,duration_ms,date\n'
    const body = filtered
      .map((r) => [r.job_id ?? r.id, r.class_name, r.healthy, r.robot_name ?? '', r.field ?? '', r.source, r.duration_ms ?? '', new Date(r.created_at).toISOString()].join(','))
      .join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'paddyguard-history.csv'
    a.click()
  }

  return (
    <>
      <PageHeader
        title="History"
        description="Searchable, sortable and exportable history of all detection results."
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!filtered.length}>
            <Download data-icon="inline-start" />
            Export CSV
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Detection history</CardTitle>
              <CardDescription>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <InputGroup className="w-full sm:w-56">
                <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
                <InputGroupInput
                  placeholder="Search job, robot, field…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
              <Select value={filter} onValueChange={setFilter} items={filterOptions}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filterOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 md:pl-6">Date</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="hidden md:table-cell">Robot · Field</TableHead>
                <TableHead className="hidden lg:table-cell">Source</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Duration</TableHead>
                <TableHead className="pr-4 md:pr-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : filtered.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                        {rows.length === 0
                          ? <>No history yet. <Link href="/upload" className="underline underline-offset-4 hover:text-foreground">Upload images</Link> to get started.</>
                          : 'No results match your search.'}
                      </TableCell>
                    </TableRow>
                  )
                : filtered.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="pl-4 md:pl-6">
                        <p className="text-sm">{new Date(d.created_at).toLocaleDateString()}</p>
                        <p className="font-mono text-xs text-muted-foreground">
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
