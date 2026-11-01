import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'center' | 'left'
}) {
  return (
    <div className={cn('flex max-w-2xl flex-col gap-3', align === 'center' && 'mx-auto items-center text-center')}>
      <p className="text-sm font-semibold uppercase tracking-wider text-success">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {description && <p className="text-pretty leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}
