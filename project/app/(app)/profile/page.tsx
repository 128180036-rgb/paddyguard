'use client'

import { PageHeader } from '@/components/shared/page-header'
import { ProfileSummary } from '@/components/profile/profile-summary'
import { ProfileForm } from '@/components/profile/profile-form'
import { AssignedFields } from '@/components/profile/assigned-fields'
import { ActivityFeed } from '@/components/dashboard/activity-feed'

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Manage your personal details and field access." />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-6">
          <ProfileSummary />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <ProfileForm />
          <AssignedFields />
          <ActivityFeed />
        </div>
      </div>
    </>
  )
}