import { Bot, CloudUpload, Grid3x3, Cpu, BellRing } from 'lucide-react'
import { SectionHeading } from './section-heading'

const steps = [
  { icon: Bot, title: 'Robot captures', body: 'An autonomous robot moves through the paddy field and photographs crop leaves.' },
  { icon: CloudUpload, title: 'Secure upload', body: 'Images are uploaded over Wi-Fi to the backend and stored in object storage.' },
  { icon: Grid3x3, title: 'Preprocess & quantize', body: 'Resized to 64×64 RGB and quantized to 12,288 signed INT8 values as .mem / .bin.' },
  { icon: Cpu, title: 'ASIC inference', body: 'The KV260 gateway streams data through FPGA logic to the custom NPU ASIC.' },
  { icon: BellRing, title: 'Alert & analyze', body: 'Class IDs update the dashboard and trigger email or SMS disease alerts.' },
]

export function Workflow() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From field image to disease alert"
          description="Robot-based crop monitoring paired with hardware-accelerated classification. The ASIC — not the cloud — performs CNN inference in hardware mode."
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <s.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
