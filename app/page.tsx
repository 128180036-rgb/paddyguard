import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { Workflow } from '@/components/landing/workflow'
import { Features } from '@/components/landing/features'
import { Architecture } from '@/components/landing/architecture'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { Benefits, CallToAction, SiteFooter } from '@/components/landing/benefits'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Workflow />
        <Features />
        <Architecture />
        <DashboardPreview />
        <Benefits />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  )
}
