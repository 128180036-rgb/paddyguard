import { CircuitBoard, Cpu, Router } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/shared/status-badge'
import { hardware } from '@/lib/demo-data'

const rows = [
  { icon: Router, label: 'KV260 gateway', value: hardware.gateway.name, detail: `fw ${hardware.gateway.firmware} · ${hardware.gateway.heartbeat}`, status: hardware.gateway.status, tone: 'success' as const },
  { icon: CircuitBoard, label: 'FPGA controller', value: hardware.fpga.status, detail: hardware.fpga.detail, status: 'Mock', tone: 'warning' as const },
  { icon: Cpu, label: 'Paddy CNN ASIC', value: hardware.asic.status, detail: hardware.asic.detail, status: 'Planned', tone: 'neutral' as const },
]

export function HardwareStatus() {
  const { transferred, total, id } = hardware.currentJob
  const pct = Math.round((transferred / total) * 100)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hardware pipeline</CardTitle>
        <CardDescription>Gateway → FPGA → ASIC</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {rows.map((r) => (
            <li key={r.label} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                <r.icon className="size-4" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{r.label}</span>
                  <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
                </div>
                <span className="truncate text-sm font-medium">{r.value}</span>
                <span className="truncate text-xs text-muted-foreground">{r.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 border-t">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Transferring <span className="font-mono text-foreground">{id}</span>
          </span>
          <span className="font-mono tabular-nums">
            {transferred.toLocaleString()} / {total.toLocaleString()} B
          </span>
        </div>
        <Progress value={pct} aria-label={`Transfer progress ${pct}%`} />
      </CardFooter>
    </Card>
  )
}
