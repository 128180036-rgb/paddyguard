import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'

const benefits = [
  'Detect disease early — before it spreads across the field',
  'Reduce manual scouting with autonomous robotic imaging',
  'Targeted treatment lowers pesticide cost and environmental impact',
  'Instant email and SMS alerts with a direct dashboard link',
  'Low-power on-device inference through a custom NPU ASIC',
  'Transparent results: demo predictions are always clearly labeled',
]

export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-2 gap-3">
          {[
            { src: '/images/leaf-healthy.png', alt: 'Healthy paddy leaf', label: 'Normal / Healthy' },
            { src: '/images/leaf-blast.png', alt: 'Paddy leaf with blast lesions', label: 'Blast' },
            { src: '/images/leaf-brown-spot.png', alt: 'Paddy leaf with brown spot disease', label: 'Brown spot' },
            { src: '/images/leaf-blight.png', alt: 'Paddy leaf with bacterial leaf blight', label: 'Bacterial leaf blight' },
          ].map((img) => (
            <figure key={img.src} className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-foreground/10">
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              <figcaption className="absolute bottom-2 left-2 rounded-md bg-card/95 px-2 py-1 text-xs font-medium">
                {img.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="Benefits for farmers"
            title="Protect yield with data you can trust"
            description="PaddyGuard AI turns thousands of field images into clear, actionable crop health insights."
          />
          <ul className="flex flex-col gap-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-pretty">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function CallToAction() {
  return (
    <section className="px-4 pb-16 md:px-6 md:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-2xl bg-secondary p-8 md:flex-row md:items-center md:p-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-secondary-foreground md:text-3xl">
            Ready to monitor your paddy fields?
          </h2>
          <p className="text-pretty text-secondary-foreground/80">
            Create an account and explore the platform in demo mode today.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="h-11 px-5" nativeButton={false} render={<Link href="/register" />}>
            Get started
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="outline" className="h-11 bg-card px-5" nativeButton={false} render={<Link href="/login" />}>
            Log in
          </Button>
        </div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:px-6">
        <p>{'© 2026 PaddyGuard AI. Intelligent paddy disease detection & crop health monitoring.'}</p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link href="/login" className="hover:text-foreground">Log in</Link>
          <Link href="/register" className="hover:text-foreground">Register</Link>
          <a href="#architecture" className="hover:text-foreground">Architecture</a>
        </nav>
      </div>
    </footer>
  )
}
