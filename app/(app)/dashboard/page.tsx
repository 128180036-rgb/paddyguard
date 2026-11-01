import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { KpiGrid } from '@/components/dashboard/kpi-grid'
import { RecentDetections } from '@/components/dashboard/recent-detections'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { HardwareStatus } from '@/components/dashboard/hardware-status'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { HealthTrendChart } from '@/components/charts/health-trend-chart'
import { HealthRatioGauge } from '@/components/charts/health-ratio-gauge'
import { DiseaseDistributionChart } from '@/components/charts/disease-distribution-chart'
import { HealthyVsDiseasedChart } from '@/components/charts/healthy-vs-diseased-chart'
import { ProcessingActivityChart } from '@/components/charts/processing-activity-chart'
import { currentUser, summary } from '@/lib/demo-data'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title={`Good morning, ${currentUser.name.split(' ')[0]}`}
        description="Crop health overview across 3 fields and 4 robots."
        actions={
          <>
            <Button variant="outline">
              <Download data-icon="inline-start" />
              Export report
            </Button>
            <Button render={<Link href="/upload" />} nativeButton={false}>
              <Upload data-icon="inline-start" />
              Upload images
            </Button>
          </>
        }
      />

      <Alert>
        <AlertTitle>Demo mode active</AlertTitle>
        <AlertDescription>
          Results come from the mock hardware gateway, not a fabricated ASIC. Health ratio is a sample-based estimate, not
          a field-wide measurement.
        </AlertDescription>
      </Alert>

      <KpiGrid />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HealthTrendChart />
        </div>
        <HealthRatioGauge healthy={summary.healthy} diseased={summary.diseased} invalid={summary.invalid} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DiseaseDistributionChart compact />
        <HealthyVsDiseasedChart />
        <div className="md:col-span-2 xl:col-span-1">
          <ProcessingActivityChart />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RecentDetections />
        </div>
        <AlertsPanel />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <HardwareStatus />
        <ActivityFeed />
      </div>
    </>
  )
}
