import { AlertTriangle, Bot, Images, Leaf, ShieldAlert, Sprout } from 'lucide-react'
import { KpiCard } from '@/components/shared/kpi-card'
import { summary } from '@/lib/demo-data'
import { healthRatio } from '@/lib/paddy'

export function KpiGrid() {
  const ratio = healthRatio(summary.healthy, summary.healthy + summary.diseased)

  return (
    <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Images analyzed" value={summary.totalImages.toLocaleString()} icon={Images} delta={summary.deltas.totalImages} hint="vs last week" />
      <KpiCard label="Health ratio" value={`${ratio.toFixed(1)}%`} icon={Sprout} accent="success" delta={summary.deltas.ratio} hint="Sample-based estimate" />
      <KpiCard label="Healthy samples" value={summary.healthy.toLocaleString()} icon={Leaf} accent="success" delta={summary.deltas.healthy} hint="Normal / Healthy class" />
      <KpiCard label="Diseased samples" value={summary.diseased.toLocaleString()} icon={ShieldAlert} accent="critical" delta={summary.deltas.diseased} deltaPositiveIsGood={false} hint="9 disease classes" />
      <KpiCard label="Active alerts" value={summary.activeAlerts} icon={AlertTriangle} accent="warning" hint="2 critical · 5 warning" />
      <KpiCard label="Robots online" value={`${summary.robotsOnline}/${summary.robotsTotal}`} icon={Bot} hint="Robot-04 offline 22 min" />
    </section>
  )
}
