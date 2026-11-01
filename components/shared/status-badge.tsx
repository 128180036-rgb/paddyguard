import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AlertSeverity, InferenceStatus, SystemMode } from '@/lib/paddy'

type Tone = 'success' | 'warning' | 'critical' | 'neutral' | 'info'

const toneClasses: Record<Tone, string> = {
  success: 'border-success/25 bg-success/10 text-primary',
  warning: 'border-warning/40 bg-warning/15 text-warning-foreground',
  critical: 'border-destructive/25 bg-destructive/10 text-destructive',
  neutral: 'border-border bg-muted text-muted-foreground',
  info: 'border-primary/20 bg-secondary text-secondary-foreground',
}

const dotClasses: Record<Tone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-destructive',
  neutral: 'bg-muted-foreground',
  info: 'bg-primary',
}

export function StatusBadge({
  tone,
  children,
  dot = true,
  className,
}: {
  tone: Tone
  children: React.ReactNode
  dot?: boolean
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', toneClasses[tone], className)}>
      {dot && <span className={cn('size-1.5 rounded-full', dotClasses[tone])} aria-hidden="true" />}
      {children}
    </Badge>
  )
}

const inferenceTone: Record<InferenceStatus, Tone> = {
  completed: 'success',
  running: 'info',
  queued: 'neutral',
  failed: 'critical',
}

export function InferenceStatusBadge({ status }: { status: InferenceStatus }) {
  return (
    <StatusBadge tone={inferenceTone[status]} className="capitalize">
      {status}
    </StatusBadge>
  )
}

const severityTone: Record<AlertSeverity, Tone> = {
  critical: 'critical',
  warning: 'warning',
  info: 'info',
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <StatusBadge tone={severityTone[severity]} className="capitalize">
      {severity}
    </StatusBadge>
  )
}

export function ModeBadge({ mode, className }: { mode: SystemMode; className?: string }) {
  return (
    <StatusBadge tone={mode === 'HARDWARE' ? 'success' : 'warning'} className={cn('font-mono tracking-wide', className)}>
      {mode} MODE
    </StatusBadge>
  )
}
