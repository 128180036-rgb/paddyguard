import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Cpu, ShieldCheck, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  { value: '12,288', label: 'INT8 values per image' },
  { value: '10', label: 'Disease classes' },
  { value: '64×64', label: 'RGB NPU input' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div className="flex flex-col gap-6">
          <Badge variant="secondary" className="w-fit gap-1.5">
            <Cpu aria-hidden="true" />
            Custom Paddy NPU ASIC · RTL-to-GDS & LVS verified
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl xl:text-6xl">
            Smarter Paddy Farming Through <span className="text-success">ASIC-Powered</span> Crop Intelligence
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Monitor paddy crop health, detect diseases, and receive real-time alerts through autonomous robotic imaging and
            custom NPU acceleration.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-11 px-5" nativeButton={false} render={<Link href="/register" />}>
              Get started
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-5" nativeButton={false} render={<Link href="/login" />}>
              Log in to dashboard
            </Button>
          </div>
          <dl className="grid max-w-lg grid-cols-3 gap-4 border-t pt-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="order-2 text-xs text-muted-foreground">{s.label}</dt>
                <dd className="order-1 font-mono text-xl font-semibold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-foreground/10">
            <Image
              src="/images/hero-paddy-robot.png"
              alt="Autonomous PaddyGuard robot capturing images between rows of paddy rice"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-xl bg-card p-3 shadow-lg ring-1 ring-foreground/10 sm:left-6">
            <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
              <Bot className="size-4.5" aria-hidden="true" />
            </span>
            <div className="text-sm">
              <p className="font-medium">Robot-01 · Field-A</p>
              <p className="text-xs text-muted-foreground">Captured 24 images · uploading</p>
            </div>
          </div>
          <div className="absolute -top-4 right-4 hidden items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-lg ring-1 ring-foreground/10 sm:flex">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            <span className="text-sm font-medium">Health ratio 80.7%</span>
          </div>
        </div>
      </div>
    </section>
  )
}
