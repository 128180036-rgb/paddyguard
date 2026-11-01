import Link from 'next/link'
import { Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  href = '/',
  inverted = false,
  compact = false,
}: {
  className?: string
  href?: string
  inverted?: boolean
  compact?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2 rounded-md font-semibold tracking-tight', className)}
      aria-label="PaddyGuard AI home"
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg',
          inverted ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-primary text-primary-foreground',
        )}
      >
        <Sprout className="size-4.5" aria-hidden="true" />
      </span>
      {!compact && (
        <span className={cn('text-base', inverted ? 'text-sidebar-accent-foreground' : 'text-foreground')}>
          PaddyGuard <span className={inverted ? 'text-sidebar-ring' : 'text-success'}>AI</span>
        </span>
      )}
    </Link>
  )
}
