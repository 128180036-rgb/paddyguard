import { ChevronRight } from 'lucide-react'
import { SectionHeading } from './section-heading'

const layers = [
  { name: 'Edge', items: ['Robot camera', 'Secure upload API'] },
  { name: 'Cloud', items: ['FastAPI backend', 'Image processing', 'PostgreSQL + object storage', 'Inference job queue'] },
  { name: 'Hardware', items: ['KV260 gateway', 'FPGA programmable logic', 'Paddy NPU ASIC'] },
  { name: 'Insights', items: ['Result processing', 'Analytics', 'Dashboard + alerts'] },
]

const stack = ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Redis', 'WebSockets', 'AMD Kria KV260', 'Custom NPU ASIC']

export function Architecture() {
  return (
    <section id="architecture" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-6">
        <SectionHeading
          eyebrow="Technology architecture"
          title="Modular layers that scale independently"
          description="Hardware communication stays isolated from the frontend. Gateways connect outbound over authenticated HTTPS, so the cloud never touches local GPIO."
        />
        <div className="grid gap-4 lg:grid-cols-4">
          {layers.map((layer, i) => (
            <div key={layer.name} className="relative flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {String(i + 1).padStart(2, '0')} · {layer.name}
              </p>
              <ul className="flex flex-col gap-2">
                {layer.items.map((item) => (
                  <li key={item} className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    {item}
                  </li>
                ))}
              </ul>
              {i < layers.length - 1 && (
                <ChevronRight
                  className="absolute -right-4 top-1/2 hidden size-5 -translate-y-1/2 text-muted-foreground lg:block"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        <ul className="flex flex-wrap justify-center gap-2" aria-label="Technology stack">
          {stack.map((t) => (
            <li key={t} className="rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
