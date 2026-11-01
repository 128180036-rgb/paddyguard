import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaPositiveIsGood = true,
  hint,
  footer,
  accent = 'default',
}: {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  delta?: number
  deltaPositiveIsGood?: boolean
  hint?: string
  footer?: React.ReactNode
  accent?: 'default' | 'success' | 'warning' | 'critical'
}) {
  const isUp = (delta ?? 0) >= 0
  const isGood = isUp === deltaPositiveIsGood

  return (
    <Card size="sm" className="gap-0">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-md',
              accent === 'default' && 'bg-secondary text-primary',
              accent === 'success' && 'bg-success/10 text-success',
              accent === 'warning' && 'bg-warning/15 text-warning-foreground',
              accent === 'critical' && 'bg-destructive/10 text-destructive',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
          {delta !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium tabular-nums',
                isGood ? 'text-success' : 'text-destructive',
              )}
            >
              {isUp ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
              {Math.abs(delta).toFixed(1)}%
              <span className="sr-only">{isUp ? 'increase' : 'decrease'} versus last week</span>
            </span>
          )}
        </div>
        {(hint || footer) && (
          <div className="text-xs text-muted-foreground">{footer ?? hint}</div>
        )}
      </CardContent>
    </Card>
  )
}
