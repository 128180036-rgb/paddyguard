'use client'

import { useState } from 'react'
import { CircuitBoard, Cpu, RefreshCw, Router, TerminalSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { hardware } from '@/lib/demo-data'
import { toast } from 'sonner'

const pipeline = [
  {
    icon: Router,
    label: 'KV260 gateway',
    name: hardware.gateway.name,
    detail: `Firmware ${hardware.gateway.firmware} · last heartbeat ${hardware.gateway.heartbeat}`,
    status: hardware.gateway.status,
    tone: 'success' as const,
  },
  {
    icon: CircuitBoard,
    label: 'FPGA controller',
    name: hardware.fpga.status,
    detail: hardware.fpga.detail,
    status: 'Mock',
    tone: 'warning' as const,
  },
  {
    icon: Cpu,
    label: 'Paddy CNN ASIC',
    name: hardware.asic.status,
    detail: hardware.asic.detail,
    status: 'Planned',
    tone: 'neutral' as const,
  },
]

const logs = [
  { time: '10:31:04', text: 'Gateway kv260-lab-01 claimed job_4c16' },
  { time: '10:31:02', text: 'Image quantized — profile qp-v0.3 (unverified)' },
  { time: '10:30:47', text: 'Robot-03 uploaded 12 images' },
  { time: '10:27:15', text: 'Notification batch delivered to 3 recipients' },
  { time: '10:12:58', text: 'Technician R. Silva ran gateway diagnostics' },
  { time: '09:58:30', text: 'FPGA bitstream reloaded successfully' },
  { time: '09:44:12', text: 'Job retry #2 for job_4c14 — checksum mismatch' },
]

export default function HardwarePage() {
  const [running, setRunning] = useState<string | null>(null)
  const { transferred, total, id } = hardware.currentJob
  const pct = Math.round((transferred / total) * 100)

  function runDiagnostic(label: string) {
    setRunning(label)
    setTimeout(() => {
      setRunning(null)
      toast.success(`${label} diagnostic complete — no issues found`)
    }, 1800)
  }

  return (
    <>
      <PageHeader
        title="Hardware Monitor"
        description="KV260 gateway, FPGA controller and ASIC status with diagnostic actions."
      />

      <Alert>
        <AlertTitle>DEMO MODE — mock adapter active</AlertTitle>
        <AlertDescription>
          No physical ASIC is connected. All inference results come from the mock gateway.
          RTL-to-GDS and LVS are complete; fabrication is planned.
        </AlertDescription>
      </Alert>

      {/* Pipeline cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {pipeline.map((p) => (
          <Card key={p.label} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${p.tone === 'success' ? 'bg-success/10 text-success' : p.tone === 'warning' ? 'bg-warning/15 text-warning-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <p.icon className="size-4" />
                </span>
                <StatusBadge tone={p.tone}>{p.status}</StatusBadge>
              </div>
              <CardTitle className="text-sm text-muted-foreground">{p.label}</CardTitle>
              <CardDescription className="text-base font-medium text-foreground">{p.name}</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">{p.detail}</CardContent>
            <CardFooter className="mt-auto border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={running === p.label || p.tone === 'neutral'}
                onClick={() => runDiagnostic(p.label)}
              >
                {running === p.label ? (
                  <><RefreshCw className="size-3.5 animate-spin" />Running…</>
                ) : (
                  <><TerminalSquare className="size-3.5" />Run diagnostic</>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Active job transfer */}
      <Card>
        <CardHeader>
          <CardTitle>Active job transfer</CardTitle>
          <CardDescription>Current image batch being sent to the gateway</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Job <span className="font-mono text-foreground">{id}</span>
            </span>
            <span className="font-mono tabular-nums">
              {transferred.toLocaleString()} / {total.toLocaleString()} B
            </span>
          </div>
          <Progress value={pct} aria-label={`Transfer progress ${pct}%`} />
          <p className="text-xs text-muted-foreground">{pct}% transferred · mock gateway simulation</p>
        </CardContent>
      </Card>

      {/* Diagnostic log */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic log</CardTitle>
          <CardDescription>Recent hardware and pipeline events</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="relative flex flex-col gap-4 border-l pl-5">
            {logs.map((l, i) => (
              <li key={i} className="relative">
                <span className="absolute top-1.5 -left-[25px] size-2 rounded-full bg-primary ring-4 ring-card" aria-hidden="true" />
                <p className="text-sm">{l.text}</p>
                <time className="font-mono text-xs text-muted-foreground">{l.time}</time>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  )
}
