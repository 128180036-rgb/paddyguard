import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { PageHeader } from '@/components/shared/page-header'
import { DiseaseDistributionChart } from '@/components/charts/disease-distribution-chart'
import { HealthyVsDiseasedChart } from '@/components/charts/healthy-vs-diseased-chart'
import { HealthTrendChart } from '@/components/charts/health-trend-chart'
import { ProcessingActivityChart } from '@/components/charts/processing-activity-chart'
import { PLANNED_MODULES } from '@/lib/nav'

export function generateStaticParams() {
  return PLANNED_MODULES.map((m) => ({ module: m.href.slice(1) }))
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params
  const item = PLANNED_MODULES.find((m) => m.href === `/${module}`)
  return { title: item?.title ?? 'Not found' }
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params
  const item = PLANNED_MODULES.find((m) => m.href === `/${module}`)
  if (!item) notFound()

  if (module === 'analytics') {
    return (
      <>
        <PageHeader title={item.title} description={item.description} />
        <HealthTrendChart />
        <div className="grid gap-4 lg:grid-cols-2">
          <DiseaseDistributionChart />
          <div className="flex flex-col gap-4">
            <HealthyVsDiseasedChart />
            <ProcessingActivityChart />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title={item.title} description={item.description} />
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <item.icon />
          </EmptyMedia>
          <EmptyTitle>{item.title} is coming next</EmptyTitle>
          <EmptyDescription>{item.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" render={<Link href="/dashboard" />} nativeButton={false}>
            Back to dashboard
          </Button>
        </EmptyContent>
      </Empty>
    </>
  )
}
