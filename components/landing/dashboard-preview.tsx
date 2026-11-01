import { Activity, Bot, Cpu, Leaf } from 'lucide-react'
import { KpiCard } from '@/components/shared/kpi-card'
import { HealthTrendChart } from '@/components/charts/health-trend-chart'
import { DiseaseDistributionChart } from '@/components/charts/disease-distribution-chart'

export function DashboardPreview() {
  return (
    <section id="preview" className="scroll-mt-20 border-y bg-primary py-16 text-primary-foreground md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-sidebar-ring">Dashboard preview</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Crop health at a glance
          </h2>
          <p className="text-pretty leading-relaxed text-primary-foreground/75">
            KPIs, health trends and disease distribution in one data-focused workspace.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl bg-background p-3 text-foreground shadow-2xl ring-1 ring-white/10 md:p-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label="Images analyzed" value="12,486" icon={Activity} delta={8.2} />
            <KpiCard label="Health ratio" value="80.7%" icon={Leaf} accent="success" delta={1.7} />
            <KpiCard label="Connected robots" value="3 / 4" icon={Bot} />
            <KpiCard label="KV260 gateway" value="Online" icon={Cpu} accent="success" />
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <HealthTrendChart />
            </div>
            <div className="lg:col-span-2">
              <DiseaseDistributionChart compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
