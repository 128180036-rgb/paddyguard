import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InferenceStatusBadge, StatusBadge } from '@/components/shared/status-badge'
import { recentDetections } from '@/lib/demo-data'
import { getDisease } from '@/lib/paddy'

export function RecentDetections() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent detections</CardTitle>
        <CardDescription>Latest inference jobs from field robots</CardDescription>
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
            {recentDetections.map((d) => {
              const disease = getDisease(d.classId)
              const resolved = d.status === 'completed'
              return (
                <TableRow key={d.id}>
                  <TableCell className="pl-4 md:pl-6">
                    <div className="flex items-center gap-3">
                      <Image src={d.image} alt={`Leaf sample ${d.id}`} width={40} height={40} className="size-10 rounded-md object-cover" />
                      <div className="flex flex-col">
                        <span className="font-mono text-xs">{d.id}</span>
                        <span className="text-xs text-muted-foreground">{d.capturedAt}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {resolved ? (
                      <StatusBadge tone={disease.healthy ? 'success' : 'critical'}>{disease.name}</StatusBadge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="text-sm">{d.robot}</span>
                      <span className="text-xs text-muted-foreground">{d.field}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{d.source}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right font-mono text-xs tabular-nums">
                    {d.durationMs ? `${d.durationMs} ms` : '—'}
                  </TableCell>
                  <TableCell className="pr-4 text-right md:pr-6">
                    <InferenceStatusBadge status={d.status} />
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
