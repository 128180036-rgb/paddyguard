import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { SettingsTabs } from '@/components/settings/settings-tabs'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Configure preferences, alerts and the hardware pipeline." />
      <div className="max-w-4xl">
        <SettingsTabs />
      </div>
    </>
  )
}
