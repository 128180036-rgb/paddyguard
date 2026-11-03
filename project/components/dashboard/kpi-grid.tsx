'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Bot, Images, Leaf, ShieldAlert, Sprout } from 'lucide-react'
import { KpiCard } from '@/components/shared/kpi-card'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { healthRatio } from '@/lib/paddy'
import { summary } from '@/lib/demo-data'

type Stats = {
  totalImages: number
  healthy: number
  diseased: number
  activeAlerts: number
  robotsOnline: number
  robotsTotal: number
}

export function KpiGrid() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    Promise.all([
      supabase.from('detections').select('id, healthy', { count: 'exact' }),
      supabase.from('alerts').select('id', { count: 'exact' }).eq('read', false),
      supabase.from('robots').select('id, status'),
    ]).then(([dRes, aRes, rRes]) => {
      const detections = (dRes.data ?? []) as { id: string; healthy: boolean }[]
      const healthy = detections.filter((d) => d.healthy).length
      const diseased = detections.filter((d) => !d.healthy).length
      const robots = (rRes.data ?? []) as { id: string; status: string }[]
      setStats({
        totalImages: dRes.count ?? detections.length,
        healthy,
        diseased,
        activeAlerts: aRes.count ?? 0,
        robotsOnline: robots.filter((r) => r.status === 'online').length,
        robotsTotal: robots.length,
      })
    })
  }, [user])

  const s = stats ?? {
    totalImages: summary.totalImages,
    healthy: summary.healthy,
    diseased: summary.diseased,
    activeAlerts: summary.activeAlerts,
    robotsOnline: summary.robotsOnline,
    robotsTotal: summary.robotsTotal,
  }
  const ratio = healthRatio(s.healthy, s.healthy + s.diseased)
  const isDemo = !stats

  return (
    <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Images analyzed" value={s.totalImages.toLocaleString()} icon={Images} hint={isDemo ? 'Demo data' : 'Your uploads'} />
      <KpiCard label="Health ratio" value={`${ratio.toFixed(1)}%`} icon={Sprout} accent="success" hint="Sample-based estimate" />
      <KpiCard label="Healthy samples" value={s.healthy.toLocaleString()} icon={Leaf} accent="success" hint="Normal / Healthy class" />
      <KpiCard label="Diseased samples" value={s.diseased.toLocaleString()} icon={ShieldAlert} accent="critical" hint="9 disease classes" />
      <KpiCard label="Active alerts" value={s.activeAlerts} icon={AlertTriangle} accent={s.activeAlerts > 0 ? 'warning' : 'default'} hint="Unread notifications" />
      <KpiCard label="Robots" value={s.robotsTotal === 0 ? '0' : `${s.robotsOnline}/${s.robotsTotal}`} icon={Bot} hint={s.robotsTotal === 0 ? 'None registered' : `${s.robotsTotal - s.robotsOnline} offline`} />
    </section>
  )
}
