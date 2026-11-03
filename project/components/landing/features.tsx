import { Activity, BarChart3, Bell, Cpu, FileCode2, ShieldCheck } from 'lucide-react'
import { SectionHeading } from './section-heading'

const features = [
  { icon: Activity, title: 'Live crop monitoring', body: 'Real-time robot status, upload and processing progress streamed over WebSockets.' },
  { icon: Cpu, title: 'Hardware inference queue', body: 'Transactional job claiming so every image is classified exactly once by a gateway.' },
  { icon: FileCode2, title: 'INT8 memory export', body: 'Download verified .mem and .bin payloads with checksums and quantization profiles.' },
  { icon: BarChart3, title: 'Crop health analytics', body: 'Sample-based health ratios by robot, field, day, week and month.' },
  { icon: Bell, title: 'Email & SMS alerts', body: 'Configurable cooldowns, retries and delivery logs for every disease detection.' },
  { icon: ShieldCheck, title: 'Secure by design', body: 'Role-based access, Argon2id hashing, device authentication and audit logs.' },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-y bg-card py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-6">
        <SectionHeading
          eyebrow="Key features"
          title="Everything you need to protect your harvest"
          description="An enterprise IoT platform built for farmers, agronomists and hardware technicians."
        />
        <div className="grid gap-px overflow-hidden rounded-xl bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3 bg-card p-6">
              <f.icon className="size-5 text-success" aria-hidden="true" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
